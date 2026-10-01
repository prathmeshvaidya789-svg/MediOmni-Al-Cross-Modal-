import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('omni_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('omni_auth_token');
      const storedUser = localStorage.getItem('omni_user_data');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const res = await axiosClient.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('omni_user_data', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('[Auth Verify Failed]:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('omni_auth_token', receivedToken);
    localStorage.setItem('omni_user_data', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return response.data;
  };

  const register = async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('omni_auth_token', receivedToken);
    localStorage.setItem('omni_user_data', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('omni_auth_token');
    localStorage.removeItem('omni_user_data');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
