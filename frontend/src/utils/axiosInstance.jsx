import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, 
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await api.post('/token/refresh'); 
        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original); 
      } catch (refreshErr) {
        console.error('Refresh token failed:', refreshErr);

      }
    }
    return Promise.reject(err);
  }
);

export default api;
