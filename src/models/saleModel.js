class SaleModel {
  constructor({ id, fecha, total, descuento, medio_pago }) {
    this.id = id;
    this.fecha = fecha;
    this.total = Number(total);
    this.descuento = Number(descuento);
    this.medio_pago = medio_pago;
  }
}

module.exports = SaleModel;
