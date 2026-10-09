const auth = {
  getToken: () => localStorage.getItem('gbd_token'),

  getUser: () => {
    const raw = localStorage.getItem('gbd_user');
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn: () => !!auth.getToken(),

  isAdmin: () => auth.getUser()?.role === 'admin',

  save: (token, user) => {
    localStorage.setItem('gbd_token', token);
    localStorage.setItem('gbd_user', JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem('gbd_token');
    localStorage.removeItem('gbd_user');
    window.location.href = '/index.html';
  },

  requireLogin: (redirectBackTo) => {
    if (!auth.isLoggedIn()) {
      const target = redirectBackTo || window.location.pathname;
      window.location.href = `/login.html?next=${encodeURIComponent(target)}`;
      return false;
    }
    return true;
  },

  requireAdmin: () => {
    if (!auth.isLoggedIn() || !auth.isAdmin()) {
      window.location.href = '/login.html?next=' + encodeURIComponent('/admin.html');
      return false;
    }
    return true;
  }
};
