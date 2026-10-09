const API_BASE = '/api';

async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('gbd_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (networkErr) {
    throw new Error('Could not reach the server. Is it running?');
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data;
}

const api = {
  // auth
  register: (payload) => apiFetch('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiFetch('/auth/login', { method: 'POST', body: payload }),
  me: () => apiFetch('/auth/me', { auth: true }),

  // products
  listProducts: (query = '') => apiFetch(`/products${query}`),
  getProduct: (id) => apiFetch(`/products/${id}`),
  createProduct: (payload) => apiFetch('/products', { method: 'POST', body: payload, auth: true }),
  updateProduct: (id, payload) => apiFetch(`/products/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteProduct: (id) => apiFetch(`/products/${id}`, { method: 'DELETE', auth: true }),

  // orders
  placeOrder: (payload) => apiFetch('/orders', { method: 'POST', body: payload, auth: true }),
  myOrders: () => apiFetch('/orders/my', { auth: true }),
  allOrders: () => apiFetch('/orders', { auth: true }),
  setOrderStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: 'PUT', body: { status }, auth: true }),

  // stats
  stats: () => apiFetch('/stats', { auth: true })
};
