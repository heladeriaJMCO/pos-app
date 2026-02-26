let categories = [];

async function loadCategories() {
  const res = await fetch('/api/rubros');
  categories = await res.json();

  const list = document.getElementById('category-list');
  const select = document.getElementById('product-category');

  list.innerHTML = '';
  select.innerHTML = '';

  categories.forEach((c) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<span>${c.id} - ${c.nombre}</span>`;
    list.appendChild(div);

    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.nombre;
    select.appendChild(opt);
  });
}

async function loadProductsAdmin() {
  const res = await fetch('/api/productos');
  const products = await res.json();

  const list = document.getElementById('product-list-admin');
  list.innerHTML = '';

  products.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<span>${p.id} - ${p.nombre} | $${Number(p.precio).toFixed(2)} | stock ${p.stock} | ${p.activo ? 'activo' : 'inactivo'}</span>`;
    list.appendChild(div);
  });
}

async function saveCategory() {
  const nombre = document.getElementById('category-name').value.trim();
  if (!nombre) return alert('Ingrese nombre de rubro');

  const res = await fetch('/api/rubros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Error al guardar rubro');

  document.getElementById('category-name').value = '';
  await loadCategories();
}

async function saveProduct() {
  const payload = {
    nombre: document.getElementById('product-name').value.trim(),
    precio: Number(document.getElementById('product-price').value),
    stock: Number(document.getElementById('product-stock').value),
    rubro_id: Number(document.getElementById('product-category').value),
    activo: Number(document.getElementById('product-active').value)
  };

  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) return alert(data.message || 'Error al guardar producto');

  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-stock').value = '';
  await loadProductsAdmin();
}

document.getElementById('save-category').addEventListener('click', saveCategory);
document.getElementById('save-product').addEventListener('click', saveProduct);

loadCategories();
loadProductsAdmin();
