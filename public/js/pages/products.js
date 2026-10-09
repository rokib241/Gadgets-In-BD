(function () {
  const params = new URLSearchParams(window.location.search);
  const sortSelect = document.getElementById('sortSelect');
  const searchBox = document.getElementById('searchBox');

  if (params.get('sort')) sortSelect.value = params.get('sort');
  if (params.get('search')) searchBox.value = params.get('search');

  async function load() {
    try {
      const query = new URLSearchParams();
      if (params.get('category')) query.set('category', params.get('category'));
      if (searchBox.value.trim()) query.set('search', searchBox.value.trim());
      if (sortSelect.value) query.set('sort', sortSelect.value);

      const { items, categories } = await api.listProducts('?' + query.toString());

      renderCategoryStrip(categories, params.get('category') || 'All');

      const grid = document.getElementById('productGrid');
      const empty = document.getElementById('emptyState');
      document.getElementById('resultCount').textContent = `${items.length} result${items.length === 1 ? '' : 's'}`;

      if (items.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
      } else {
        empty.style.display = 'none';
        grid.innerHTML = items.map(productCardHTML).join('');
        bindAddToCartButtons(grid);
      }
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  sortSelect.addEventListener('change', () => {
    params.set('sort', sortSelect.value);
    history.replaceState(null, '', '?' + params.toString());
    load();
  });

  let searchTimer;
  searchBox.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(load, 300);
  });

  load();
})();
