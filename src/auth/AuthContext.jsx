import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post('/users/signin', { email, password });
    console.log('🔍 Response:', response.data);

    // ✅ التوكن والمستخدم جوه data
    const payload = response.data.data || response.data;
    const token = payload.token;
    const userData = payload.user || { email };

    if (!token) {
      throw new Error('التوكن مش موجود في الـ response');
    }

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return response.data;
  };

  const signup = async (userData) => {
    const response = await axiosInstance.post('/users/signup', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);