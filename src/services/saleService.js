const HttpError = require('../utils/httpError');

class SaleService {
  constructor(db, saleRepository, productRepository) {
    this.db = db;
    this.saleRepository = saleRepository;
    this.productRepository = productRepository;
  }

  async createSale(payload) {
    const { items, descuento = 0, medio_pago } = payload;

    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, 'La venta no puede estar vacía');
    }

    if (!medio_pago || !medio_pago.trim()) {
      throw new HttpError(400, 'Medio de pago requerido');
    }

    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      const saleDetails = [];
      let grossTotal = 0;

      for (const item of items) {
        if (!item.producto_id || Number(item.cantidad) <= 0) {
          throw new HttpError(400, 'Ítem inválido');
        }

        const product = await this.productRepository.findById(item.producto_id, connection);
        if (!product) throw new HttpError(404, `Producto ${item.producto_id} inexistente`);
        if (!product.activo) throw new HttpError(400, `Producto ${product.nombre} inactivo`);
        if (product.stock < item.cantidad) {
          throw new HttpError(400, `Stock insuficiente para ${product.nombre}`);
        }

        const subtotal = Number(product.precio) * Number(item.cantidad);
        grossTotal += subtotal;

        saleDetails.push({
          producto_id: product.id,
          cantidad: Number(item.cantidad),
          precio_unitario: Number(product.precio),
          subtotal
        });
      }

      const discountValue = Number(descuento) || 0;
      if (discountValue < 0) throw new HttpError(400, 'Descuento inválido');
      if (discountValue > grossTotal) throw new HttpError(400, 'Descuento no puede superar el total');

      const total = grossTotal - discountValue;
      const saleId = await this.saleRepository.createSale(
        { total, descuento: discountValue, medio_pago: medio_pago.trim() },
        connection
      );

      for (const detail of saleDetails) {
        await this.saleRepository.insertDetail({ ...detail, venta_id: saleId }, connection);
        await this.productRepository.decrementStock(detail.producto_id, detail.cantidad, connection);
      }

      await connection.commit();
      return { id: saleId, total, descuento: discountValue, items: saleDetails };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getSalesReport(query) {
    const sales = await this.saleRepository.listSales(query);

    const enriched = [];
    for (const sale of sales) {
      const details = await this.saleRepository.getSaleDetails(sale.id);
      enriched.push({ ...sale, detalles: details });
    }

    const totalVendido = enriched.reduce((acc, item) => acc + Number(item.total), 0);

    return { total_registros: enriched.length, total_vendido: totalVendido, ventas: enriched };
  }
}

module.exports = SaleService;
