class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  list = async (_req, res, next) => {
    try {
      const data = await this.productService.list();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.productService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.productService.update(Number(req.params.id), req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ProductController;
