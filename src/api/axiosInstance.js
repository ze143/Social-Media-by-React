import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://route-posts.routemisr.com',
  timeout: 10000,
});

// Request Interceptor: إضافة التوكن لكل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: التعامل مع 401 (Token منتهي)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;