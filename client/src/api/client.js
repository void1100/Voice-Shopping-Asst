import axios from 'axios';

const API = import.meta.env.VITE_BACKEND_URL;

const client = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s to allow Render free tier to wake up
});

// Attach token from localStorage on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic for network errors (server waking up from sleep)
client.interceptors.response.use(
  (res) => res,
  async (err) => {
    // On 401, clear token and redirect to login
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }

    // Retry once on network error (server may be waking up)
    const config = err.config;
    if (!config || config._retry) return Promise.reject(err);

    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
      config._retry = true;
      // Wait 5s for server to wake, then retry
      await new Promise((r) => setTimeout(r, 5000));
      return client(config);
    }

    return Promise.reject(err);
  }
);

export default client;
