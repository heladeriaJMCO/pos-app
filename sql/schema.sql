CREATE DATABASE IF NOT EXISTS pos_local;
USE pos_local;

CREATE TABLE IF NOT EXISTS Rubros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  rubro_id INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_producto_rubro
    FOREIGN KEY (rubro_id) REFERENCES Rubros(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_precio_positivo CHECK (precio > 0),
  CONSTRAINT chk_stock_no_negativo CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS Ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12,2) NOT NULL,
  descuento DECIMAL(12,2) NOT NULL DEFAULT 0,
  medio_pago VARCHAR(50) NOT NULL,
  CONSTRAINT chk_total_no_negativo CHECK (total >= 0),
  CONSTRAINT chk_descuento_no_negativo CHECK (descuento >= 0)
);

CREATE TABLE IF NOT EXISTS DetalleVenta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  venta_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_detalle_venta
    FOREIGN KEY (venta_id) REFERENCES Ventas(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (producto_id) REFERENCES Productos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT chk_cantidad_positiva CHECK (cantidad > 0),
  CONSTRAINT chk_subtotal_no_negativo CHECK (subtotal >= 0)
);
