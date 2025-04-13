// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Django API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // important if using cookies
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// Optional: Refresh token on 401
api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh');
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = res.data.access;
        localStorage.setItem('access', newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token failed:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
