(function () {
  if (!auth.requireAdmin()) return;

  // --- Tabs ---
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
      if (tab.dataset.tab === 'orders') loadOrders();
    });
  });

  loadOverview();
  loadProducts();

  // --- Overview ---
  async function loadOverview() {
    try {
      const s = await api.stats();
      document.getElementById('statGrid').innerHTML = `
        ${statCard('Total revenue', formatBDT(s.totalRevenue))}
        ${statCard('Total orders', s.totalOrders)}
        ${statCard('Pending orders', s.pendingOrders)}
        ${statCard('Products listed', s.totalProducts)}
        ${statCard('Low stock (≤5)', s.lowStock)}
        ${statCard('Customers', s.totalCustomers)}
      `;
    } catch (err) {
      toast(err.message, 'error');
    }
  }
  function statCard(label, value) {
    return `<div class="stat-card"><div class="label">${label}</div><div class="value">${value}</div></div>`;
  }

  // --- Products ---
  let productCache = [];

  async function loadProducts() {
    try {
      const { items } = await api.listProducts();
      productCache = items;
      document.getElementById('productCount').textContent = `${items.length} products`;
      document.getElementById('productTableBody').innerHTML = items.map((p) => `
        <tr>
          <td>${p.icon} ${escapeHtml(p.name)}</td>
          <td>${escapeHtml(p.category)}</td>
          <td class="mono">${formatBDT(p.price)}</td>
          <td>${p.stock}</td>
          <td>
            <div class="row-actions">
              <button class="btn btn-outline btn-sm" data-edit="${p.id}">Edit</button>
              <button class="btn btn-danger btn-sm" data-delete="${p.id}">Delete</button>
            </div>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-edit]').forEach((btn) =>
        btn.addEventListener('click', () => openModal(productCache.find((p) => p.id === btn.dataset.edit)))
      );
      document.querySelectorAll('[data-delete]').forEach((btn) =>
        btn.addEventListener('click', () => deleteProduct(btn.dataset.delete))
      );
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function deleteProduct(id) {
    const product = productCache.find((p) => p.id === id);
    if (!confirm(`Delete "${product?.name}"? This can't be undone.`)) return;
    try {
      await api.deleteProduct(id);
      toast('Product deleted');
      loadProducts();
      loadOverview();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  // --- Product modal ---
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  const specRows = document.getElementById('specRows');

  document.getElementById('newProductBtn').addEventListener('click', () => openModal(null));
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.getElementById('addSpecBtn').addEventListener('click', () => addSpecRow('', ''));

  function openModal(product) {
    document.getElementById('modalError').style.display = 'none';
    document.getElementById('modalTitle').textContent = product ? 'Edit product' : 'Add product';
    document.getElementById('pf-id').value = product?.id || '';
    document.getElementById('pf-name').value = product?.name || '';
    document.getElementById('pf-brand').value = product?.brand || '';
    document.getElementById('pf-category').value = product?.category || 'Smartphones';
    document.getElementById('pf-price').value = product?.price ?? '';
    document.getElementById('pf-oldPrice').value = product?.oldPrice ?? '';
    document.getElementById('pf-stock').value = product?.stock ?? '';
    document.getElementById('pf-icon').value = product?.icon || '📦';
    document.getElementById('pf-description').value = product?.description || '';
    document.getElementById('pf-featured').checked = !!product?.featured;

    specRows.innerHTML = '';
    (product?.specs?.length ? product.specs : [{ label: '', value: '' }]).forEach((s) => addSpecRow(s.label, s.value));

    modal.classList.add('open');
  }

  function closeModal() { modal.classList.remove('open'); }

  function addSpecRow(label, value) {
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = `
      <input type="text" placeholder="Label (e.g. RAM)" class="spec-label" value="${escapeHtml(label)}" />
      <input type="text" placeholder="Value (e.g. 8GB)" class="spec-value" value="${escapeHtml(value)}" />
      <button type="button" class="btn btn-ghost btn-sm" title="Remove">✕</button>
    `;
    row.querySelector('button').addEventListener('click', () => row.remove());
    specRows.appendChild(row);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('modalError');
    errorBox.style.display = 'none';

    const id = document.getElementById('pf-id').value;
    const specs = [...specRows.querySelectorAll('.spec-row')]
      .map((row) => ({
        label: row.querySelector('.spec-label').value.trim(),
        value: row.querySelector('.spec-value').value.trim()
      }))
      .filter((s) => s.label && s.value);

    const payload = {
      name: document.getElementById('pf-name').value.trim(),
      brand: document.getElementById('pf-brand').value.trim() || 'Generic',
      category: document.getElementById('pf-category').value,
      price: Number(document.getElementById('pf-price').value),
      oldPrice: document.getElementById('pf-oldPrice').value ? Number(document.getElementById('pf-oldPrice').value) : null,
      stock: Number(document.getElementById('pf-stock').value),
      icon: document.getElementById('pf-icon').value.trim() || '📦',
      description: document.getElementById('pf-description').value.trim(),
      featured: document.getElementById('pf-featured').checked,
      specs
    };

    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    try {
      if (id) await api.updateProduct(id, payload);
      else await api.createProduct(payload);
      closeModal();
      toast(id ? 'Product updated' : 'Product added');
      loadProducts();
      loadOverview();
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save product';
    }
  });

  // --- Orders ---
  async function loadOrders() {
    try {
      const { orders } = await api.allOrders();
      document.getElementById('orderCount').textContent = `${orders.length} orders`;
      document.getElementById('orderTableBody').innerHTML = orders.map((o) => `
        <tr>
          <td class="mono">${o.id.slice(0, 8).toUpperCase()}</td>
          <td>${escapeHtml(o.customerEmail)}</td>
          <td>${o.items.reduce((n, i) => n + i.qty, 0)} item(s)</td>
          <td class="mono">${formatBDT(o.total)}</td>
          <td>
            <select class="status-select" data-order="${o.id}">
              ${['pending', 'processing', 'shipped', 'delivered', 'cancelled']
                .map((s) => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`)
                .join('')}
            </select>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('[data-order]').forEach((sel) => {
        sel.addEventListener('change', async () => {
          try {
            await api.setOrderStatus(sel.dataset.order, sel.value);
            toast('Order status updated');
            loadOverview();
          } catch (err) {
            toast(err.message, 'error');
          }
        });
      });
    } catch (err) {
      toast(err.message, 'error');
    }
  }
})();
