import axios from 'axios';

// Configurar a base URL do Django
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor para incluir token (JWT ou similar)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
