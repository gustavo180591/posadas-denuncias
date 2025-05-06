import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurar axios
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  // Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  // Verificar autenticación
  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/profile');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return user;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Error al registrar usuario');
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put('/auth/profile', profileData);
      setUser(response.data.data.user);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Error al actualizar perfil');
      throw error;
    }
  };

  // Cambiar contraseña
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      const response = await axios.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Error al cambiar contraseña');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 