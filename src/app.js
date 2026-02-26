const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const ProductRepository = require('./repositories/productRepository');
const CategoryRepository = require('./repositories/categoryRepository');
const SaleRepository = require('./repositories/saleRepository');

const ProductService = require('./services/productService');
const CategoryService = require('./services/categoryService');
const SaleService = require('./services/saleService');

const ProductController = require('./controllers/productController');
const CategoryController = require('./controllers/categoryController');
const SaleController = require('./controllers/saleController');

const createProductRoutes = require('./routes/productRoutes');
const createCategoryRoutes = require('./routes/categoryRoutes');
const createSaleRoutes = require('./routes/saleRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const categoryRepository = new CategoryRepository(db);
const productRepository = new ProductRepository(db);
const saleRepository = new SaleRepository(db);

const categoryService = new CategoryService(categoryRepository);
const productService = new ProductService(productRepository, categoryRepository);
const saleService = new SaleService(db, saleRepository, productRepository);

const categoryController = new CategoryController(categoryService);
const productController = new ProductController(productService);
const saleController = new SaleController(saleService);

app.use('/api/rubros', createCategoryRoutes(categoryController));
app.use('/api/productos', createProductRoutes(productController));
app.use('/api/ventas', createSaleRoutes(saleController));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

module.exports = app;
