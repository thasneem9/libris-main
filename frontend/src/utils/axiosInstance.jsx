import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,  // ✅ include cookies in requests
});

// ✅ No need for request interceptor to attach token
// Axios will send cookies automatically

// Response interceptor (optional, if you still want auto-refresh)
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // Handle token expiration using refresh token from cookie
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await api.post('/users/refresh'); // ✅ refresh accessToken cookie
        return api(original); // retry original request
      } catch (refreshErr) {
        console.error('Refresh token failed:', refreshErr);
        // Optionally: redirect to login
      }
    }

    return Promise.reject(err);
  }
);

export default api;
