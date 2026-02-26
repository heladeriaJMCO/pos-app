const HttpError = require('../utils/httpError');

class ProductService {
  constructor(productRepository, categoryRepository) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  async list() {
    return this.productRepository.findAll();
  }

  async create(payload) {
    this.validatePayload(payload);
    await this.validateCategory(payload.rubro_id);
    return this.productRepository.create(payload);
  }

  async update(id, payload) {
    this.validatePayload(payload);
    await this.validateCategory(payload.rubro_id);

    const existing = await this.productRepository.findById(id);
    if (!existing) throw new HttpError(404, 'Producto no encontrado');

    return this.productRepository.update(id, payload);
  }

  validatePayload({ nombre, precio, stock, rubro_id }) {
    if (!nombre || typeof nombre !== 'string') throw new HttpError(400, 'Nombre inválido');
    if (Number(precio) <= 0) throw new HttpError(400, 'Precio inválido');
    if (Number(stock) < 0) throw new HttpError(400, 'Stock no puede ser negativo');
    if (!rubro_id) throw new HttpError(400, 'rubro_id es requerido');
  }

  async validateCategory(categoryId) {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new HttpError(400, 'Rubro inexistente');
  }
}

module.exports = ProductService;
