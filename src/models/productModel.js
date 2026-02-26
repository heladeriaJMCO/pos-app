class ProductModel {
  constructor({ id, nombre, precio, stock, rubro_id, activo }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = Number(precio);
    this.stock = Number(stock);
    this.rubro_id = rubro_id;
    this.activo = Boolean(activo);
  }
}

module.exports = ProductModel;
