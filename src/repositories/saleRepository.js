const SaleModel = require('../models/saleModel');

class SaleRepository {
  constructor(db) {
    this.db = db;
  }

  async createSale({ total, descuento, medio_pago }, connection) {
    const [result] = await connection.query(
      'INSERT INTO Ventas (fecha, total, descuento, medio_pago) VALUES (NOW(), ?, ?, ?)',
      [total, descuento, medio_pago]
    );
    return result.insertId;
  }

  async insertDetail(detail, connection) {
    const { venta_id, producto_id, cantidad, precio_unitario, subtotal } = detail;
    await connection.query(
      `INSERT INTO DetalleVenta
        (venta_id, producto_id, cantidad, precio_unitario, subtotal)
       VALUES (?, ?, ?, ?, ?)`,
      [venta_id, producto_id, cantidad, precio_unitario, subtotal]
    );
  }

  async listSales({ desde, hasta }) {
    const filters = [];
    const values = [];

    if (desde) {
      filters.push('DATE(fecha) >= ?');
      values.push(desde);
    }

    if (hasta) {
      filters.push('DATE(fecha) <= ?');
      values.push(hasta);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [rows] = await this.db.query(
      `SELECT id, fecha, total, descuento, medio_pago FROM Ventas ${where} ORDER BY fecha DESC`,
      values
    );

    return rows.map((row) => new SaleModel(row));
  }

  async getSaleDetails(ventaId) {
    const [rows] = await this.db.query(
      `SELECT d.id, d.venta_id, d.producto_id, p.nombre AS producto_nombre,
              d.cantidad, d.precio_unitario, d.subtotal
       FROM DetalleVenta d
       INNER JOIN Productos p ON p.id = d.producto_id
       WHERE d.venta_id = ?`,
      [ventaId]
    );
    return rows;
  }
}

module.exports = SaleRepository;
