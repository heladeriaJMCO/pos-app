const express = require('express');

function createSaleRoutes(controller) {
  const router = express.Router();

  router.post('/', controller.create);
  router.get('/reporte', controller.report);

  return router;
}

module.exports = createSaleRoutes;
