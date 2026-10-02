import axios from 'axios';

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getProducts = () => axios.get(`${API}/products`).then((r) => r.data);
export const createCheckout = (payload) => axios.post(`${API}/checkout`, payload).then((r) => r.data);
export const getPaymentStatus = (sid) => axios.get(`${API}/payments/status/${sid}`).then((r) => r.data);
export const getOrder = (oid) => axios.get(`${API}/orders/${oid}`).then((r) => r.data);

export const adminLogin = (password) =>
  axios.post(`${API}/admin/login`, { password }).then((r) => r.data);
export const adminOrders = (token) =>
  axios.get(`${API}/admin/orders`, { headers: { 'X-Admin-Token': token } }).then((r) => r.data);
export const adminInventory = (token) =>
  axios.get(`${API}/admin/inventory`, { headers: { 'X-Admin-Token': token } }).then((r) => r.data);
export const updateInventory = (token, body) =>
  axios.put(`${API}/admin/inventory`, body, { headers: { 'X-Admin-Token': token } }).then((r) => r.data);
