/**
 * api.js — BidPulse API client with JWT Authentication
 * All protected calls send: Authorization: Bearer <token>
 */

const BASE = 'http://localhost:8080';

/* ──────────────────────────────────────────────────────────
   Token helpers
────────────────────────────────────────────────────────── */
const getToken = () => localStorage.getItem('token');

const storeAuth = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/* ──────────────────────────────────────────────────────────
   Internal fetch helper
   - Attaches Bearer token on every request except explicit skipAuth
   - Extracts backend error messages
   - Redirects to /login on 401
────────────────────────────────────────────────────────── */
async function request(path, options = {}, skipAuth = false) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (!skipAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  let body;
  try { body = await res.json(); } catch { body = null; }

  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const msg = body?.error || body?.message || `Request failed (HTTP ${res.status})`;
    throw new Error(msg);
  }

  return body;
}

/* ══════════════════ AUTH ════════════════════════════════════
   Public endpoints — no token required
═══════════════════════════════════════════════════════════ */

/**
 * POST /users/login
 * Returns { token, user } — stores both in localStorage.
 */
export const loginUser = async (email, password) => {
  const data = await request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, true /* skipAuth */);
  storeAuth(data);          // saves token + user
  return data.user;         // caller gets the user object
};

/**
 * POST /users/add  — Register
 * Also skipAuth — user doesn't have a token yet.
 */
export const registerUser = (data) =>
  request('/users/add', {
    method: 'POST',
    body: JSON.stringify(data),
  }, true /* skipAuth */);

export { clearAuth };

/* ══════════════════ USER endpoints ══════════════════════════ */

export const getUsers = () => request('/users/get');

export const deleteUser = (id) =>
  request(`/users/del/${id}`, { method: 'DELETE' });

export const updateUser = (id, data) =>
  request(`/users/put/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

/* ══════════════════ AUCTION endpoints ═══════════════════════ */

export const getAuctions = () => request('/auctions/get');

export const getAuctionsBySeller = (sellerId) =>
  request(`/auctions/seller/${sellerId}`);

export const addAuction = (data) =>
  request('/auctions/add', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAuction = (id, data) =>
  request(`/auctions/put/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const verifyAuction = (id, adminUserId) =>
  request(`/auctions/verify/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ adminUserId }),
  });

export const deleteAuction = (id) =>
  request(`/auctions/del/${id}`, { method: 'DELETE' });

/* ══════════════════ BID endpoints ═══════════════════════════ */

export const getBids = () => request('/bids/get');

export const addBid = (auctionId, userId, amount) =>
  request('/bids/add', {
    method: 'POST',
    body: JSON.stringify({
      bidAmount: amount,
      bidTime: new Date().toISOString(),
      auction: { auctionId },
      user: { userId },
    }),
  });

export const deleteBid = (id) =>
  request(`/bids/del/${id}`, { method: 'DELETE' });
