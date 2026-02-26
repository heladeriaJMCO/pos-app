class SaleController {
  constructor(saleService) {
    this.saleService = saleService;
  }

  create = async (req, res, next) => {
    try {
      const data = await this.saleService.createSale(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  report = async (req, res, next) => {
    try {
      const data = await this.saleService.getSalesReport(req.query);
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = SaleController;
