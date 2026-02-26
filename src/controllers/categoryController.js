class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  list = async (_req, res, next) => {
    try {
      const data = await this.categoryService.list();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.categoryService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.categoryService.update(Number(req.params.id), req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CategoryController;
