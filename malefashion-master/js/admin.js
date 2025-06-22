// js/admin.js
// เพิ่ม error-handling และตรวจสอบ status ก่อน parse JSON

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('product-table');
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  const form = document.getElementById('productForm');
  const btnAdd = document.getElementById('btn-add');

  // fields
  const idEl    = document.getElementById('prod-id');
  const nameEl  = document.getElementById('prod-name');
  const priceEl = document.getElementById('prod-price');
  const catEl   = document.getElementById('prod-cat');
  const imgEl   = document.getElementById('prod-img');

  // โหลดสินค้า
  const loadProducts = () => {
    fetch('/api/admin/products')
      .then(r => {
        if (!r.ok) throw new Error(`Load error: ${r.status} ${r.statusText}`);
        return r.json();
      })
      .then(data => {
        tableBody.innerHTML = data.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.price.toFixed(2)}</td>
            <td>${p.category}</td>
            <td><img src="${p.image}" width="60"></td>
            <td>
              <button class="btn btn-sm btn-warning btn-edit" data-id="${p.id}">Edit</button>
              <button class="btn btn-sm btn-danger btn-del" data-id="${p.id}">Delete</button>
            </td>
          </tr>
        `).join('');

        document.querySelectorAll('.btn-edit').forEach(btn =>
          btn.onclick = () => editProduct(btn.dataset.id)
        );
        document.querySelectorAll('.btn-del').forEach(btn =>
          btn.onclick = () => deleteProduct(btn.dataset.id)
        );
      })
      .catch(err => {
        console.error('loadProducts error:', err);
        alert('Error loading products: ' + err.message);
      });
  };

  // เปิด modal สร้างใหม่
  btnAdd.onclick = () => {
    idEl.value = '';
    form.reset();
    document.getElementById('productModalLabel').innerText = 'New Product';
    modal.show();
  };

  // Edit: โหลดข้อมูลขึ้นฟอร์ม
  const editProduct = id => {
    fetch(`/api/admin/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error(`Fetch error: ${r.status}`);
        return r.json();
      })
      .then(p => {
        idEl.value = p.id;
        nameEl.value = p.name;
        priceEl.value = p.price;
        catEl.value = p.category;
        imgEl.value = p.image;
        document.getElementById('productModalLabel').innerText = 'Edit Product';
        modal.show();
      })
      .catch(err => {
        console.error('editProduct error:', err);
        alert('Error fetching product: ' + err.message);
      });
  };

  // Delete
  const deleteProduct = id => {
    if (!confirm('Delete this product?')) return;
    fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      .then(r => {
        if (!r.ok) throw new Error(`Delete error: ${r.status}`);
        return r.json();
      })
      .then(() => loadProducts())
      .catch(err => {
        console.error('deleteProduct error:', err);
        alert('Error deleting product: ' + err.message);
      });
  };

  // Submit form (Add/Update)
  form.onsubmit = e => {
    e.preventDefault();
    const payload = {
      name: nameEl.value,
      price: parseFloat(priceEl.value),
      category: catEl.value,
      image: imgEl.value
    };
    const id = idEl.value;
    const url = id ? `/api/admin/products/${id}` : '/api/admin/products';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => {
      if (!r.ok) throw new Error(`Save error: ${r.status}`);
      return r.json();
    })
    .then(() => {
      modal.hide();
      loadProducts();
    })
    .catch(err => {
      console.error('saveProduct error:', err);
      alert('Error saving product: ' + err.message);
    });
  };

  // เริ่มต้น
  loadProducts();
});
