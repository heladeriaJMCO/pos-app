# POS Local (Node.js + Express + MySQL)

Aplicación POS para entorno local con:
- Gestión de rubros y productos (ABM básico)
- Control de stock
- Registro de ventas con detalle
- Transacciones SQL para ventas
- Reporte básico por fecha
- Frontend en HTML/CSS/JS puro

## Estructura

```
public/
  admin.html
  index.html
  css/styles.css
  js/admin.js
  js/pos.js
sql/
  schema.sql
src/
  app.js
  server.js
  config/db.js
  controllers/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
```

## Requisitos

- Node.js 18+
- MySQL local

Credenciales esperadas por defecto:
- host: `localhost`
- user: `root`
- password: `(vacío)`
- database: `pos_local`

## Configuración

1. Crear base y tablas:

```bash
mysql -u root < sql/schema.sql
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

4. Ejecutar en desarrollo:

```bash
npm run dev
```

Abrir:
- Caja: `http://localhost:3000/index.html`
- Administración: `http://localhost:3000/admin.html`

## Endpoints REST

### Rubros
- `GET /api/rubros`
- `POST /api/rubros`
- `PUT /api/rubros/:id`

### Productos
- `GET /api/productos`
- `POST /api/productos`
- `PUT /api/productos/:id`

### Ventas
- `POST /api/ventas`
- `GET /api/ventas/reporte?desde=YYYY-MM-DD&hasta=YYYY-MM-DD`

## Ejemplo de venta

`POST /api/ventas`

```json
{
  "items": [
    { "producto_id": 1, "cantidad": 2 },
    { "producto_id": 3, "cantidad": 1 }
  ],
  "descuento": 100,
  "medio_pago": "Efectivo"
}
```

## Notas técnicas

- Arquitectura por capas: routes/controllers/services/repositories/models.
- Patrón repository aplicado para desacoplar acceso a datos.
- Uso de `async/await` en todo el backend.
- Manejo centralizado de errores con middleware.
- Validaciones para evitar stock negativo, venta vacía y productos inactivos.
- Registro de venta con transacción MySQL (`BEGIN/COMMIT/ROLLBACK`).
