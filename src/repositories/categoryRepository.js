const CategoryModel = require('../models/categoryModel');

class CategoryRepository {
  constructor(db) {
    this.db = db;
  }

  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM Rubros ORDER BY id DESC');
    return rows.map((row) => new CategoryModel(row));
  }

  async findById(id) {
    const [rows] = await this.db.query('SELECT * FROM Rubros WHERE id = ?', [id]);
    if (!rows.length) return null;
    return new CategoryModel(rows[0]);
  }

  async create(nombre) {
    const [result] = await this.db.query('INSERT INTO Rubros (nombre) VALUES (?)', [nombre]);
    return this.findById(result.insertId);
  }

  async update(id, nombre) {
    await this.db.query('UPDATE Rubros SET nombre = ? WHERE id = ?', [nombre, id]);
    return this.findById(id);
  }
}

module.exports = CategoryRepository;
