const express = require('express');

function createCategoryRoutes(controller) {
  const router = express.Router();

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.put('/:id', controller.update);

  return router;
}

module.exports = createCategoryRoutes;
