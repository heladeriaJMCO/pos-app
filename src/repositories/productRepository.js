const ProductModel = require('../models/productModel');

class ProductRepository {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const [rows] = await this.db.query(
      `SELECT p.id, p.nombre, p.precio, p.stock, p.rubro_id, p.activo, r.nombre AS rubro_nombre
       FROM Productos p
       LEFT JOIN Rubros r ON p.rubro_id = r.id
       ORDER BY p.id DESC`
    );
    return rows;
  }

  async findById(id, connection = null) {
    const executor = connection || this.db;
    const [rows] = await executor.query('SELECT * FROM Productos WHERE id = ?', [id]);
    if (!rows.length) return null;
    return new ProductModel(rows[0]);
  }

  async create(data) {
    const { nombre, precio, stock, rubro_id, activo } = data;
    const [result] = await this.db.query(
      'INSERT INTO Productos (nombre, precio, stock, rubro_id, activo) VALUES (?, ?, ?, ?, ?)',
      [nombre, precio, stock, rubro_id, activo]
    );
    return this.findById(result.insertId);
  }

  async update(id, data) {
    const { nombre, precio, stock, rubro_id, activo } = data;
    await this.db.query(
      'UPDATE Productos SET nombre = ?, precio = ?, stock = ?, rubro_id = ?, activo = ? WHERE id = ?',
      [nombre, precio, stock, rubro_id, activo, id]
    );
    return this.findById(id);
  }

  async decrementStock(id, qty, connection) {
    await connection.query('UPDATE Productos SET stock = stock - ? WHERE id = ?', [qty, id]);
  }
}

module.exports = ProductRepository;
