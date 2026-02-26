const api = {
  products: '/api/productos',
  sales: '/api/ventas'
};

let products = [];
let cart = [];

async function loadProducts() {
  const res = await fetch(api.products);
  products = await res.json();
  renderProducts(products);
}

function renderProducts(list) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  list.forEach((p) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <div>
        <strong>${p.nombre}</strong><br>
        <small>$${Number(p.precio).toFixed(2)} | Stock: ${p.stock} | ${p.activo ? 'Activo' : 'Inactivo'}</small>
      </div>
      <button ${!p.activo || p.stock <= 0 ? 'disabled' : ''}>Agregar</button>
    `;

    item.querySelector('button').addEventListener('click', () => addToCart(p));
    container.appendChild(item);
  });
}

function addToCart(product) {
  const existing = cart.find((i) => i.producto_id === product.id);
  if (existing) {
    if (existing.cantidad + 1 > product.stock) {
      alert('Stock insuficiente');
      return;
    }
    existing.cantidad += 1;
  } else {
    cart.push({ producto_id: product.id, nombre: product.nombre, precio: Number(product.precio), cantidad: 1, stock: product.stock });
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-list');
  container.innerHTML = '';

  cart.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div>${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}</div>
      <button>Quitar</button>
    `;
    div.querySelector('button').addEventListener('click', () => {
      cart = cart.filter((c) => c.producto_id !== item.producto_id);
      renderCart();
    });
    container.appendChild(div);
  });

  const discount = Number(document.getElementById('discount').value || 0);
  const total = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0) - discount;
  document.getElementById('total').textContent = `Total: $${Math.max(total, 0).toFixed(2)}`;
}

async function confirmSale() {
  if (!cart.length) {
    alert('La venta está vacía');
    return;
  }

  const payload = {
    items: cart.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
    descuento: Number(document.getElementById('discount').value || 0),
    medio_pago: document.getElementById('payment-method').value
  };

  const res = await fetch(api.sales, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.message || 'No se pudo registrar la venta');
    return;
  }

  alert(`Venta registrada #${data.id}`);
  cart = [];
  document.getElementById('discount').value = 0;
  renderCart();
  await loadProducts();
}

async function loadReport() {
  const from = document.getElementById('from-date').value;
  const to = document.getElementById('to-date').value;

  const params = new URLSearchParams();
  if (from) params.append('desde', from);
  if (to) params.append('hasta', to);

  const res = await fetch(`/api/ventas/reporte?${params}`);
  const data = await res.json();
  document.getElementById('report-output').textContent = JSON.stringify(data, null, 2);
}

document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  renderProducts(products.filter((p) => p.nombre.toLowerCase().includes(q)));
});

document.getElementById('discount').addEventListener('input', renderCart);
document.getElementById('confirm-sale').addEventListener('click', confirmSale);
document.getElementById('load-report').addEventListener('click', loadReport);

loadProducts();
