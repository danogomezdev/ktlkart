import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('portfolio_token');
    const savedUser = localStorage.getItem('portfolio_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      api.get('/auth/verify').catch(() => { localStorage.removeItem('portfolio_token'); localStorage.removeItem('portfolio_user'); setUser(null); });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('portfolio_token', data.token);
    localStorage.setItem('portfolio_user', JSON.stringify({ username: data.username }));
    setUser({ username: data.username });
    return data;
  };

  const logout = () => { localStorage.removeItem('portfolio_token'); localStorage.removeItem('portfolio_user'); setUser(null); };

  return <AuthContext.Provider value={{ user, login, logout, loading, isAdmin: !!user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
