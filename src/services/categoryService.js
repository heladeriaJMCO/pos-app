const HttpError = require('../utils/httpError');

class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async list() {
    return this.categoryRepository.findAll();
  }

  async create(payload) {
    if (!payload.nombre || !payload.nombre.trim()) {
      throw new HttpError(400, 'Nombre de rubro inválido');
    }
    return this.categoryRepository.create(payload.nombre.trim());
  }

  async update(id, payload) {
    if (!payload.nombre || !payload.nombre.trim()) {
      throw new HttpError(400, 'Nombre de rubro inválido');
    }

    const existing = await this.categoryRepository.findById(id);
    if (!existing) throw new HttpError(404, 'Rubro no encontrado');

    return this.categoryRepository.update(id, payload.nombre.trim());
  }
}

module.exports = CategoryService;
