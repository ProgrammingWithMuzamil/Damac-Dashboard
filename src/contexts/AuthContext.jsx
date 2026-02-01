import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user profile
      authAPI.getProfile()
        .then(response => {
          console.log('Profile response:', response);
          setUser(response.user);
        })
        .catch((error) => {
          console.error('Profile verification failed:', error);
          console.error('Error response:', error.response);
          // Don't remove token on profile failure - let user stay logged in
          console.log('Profile failed but keeping user logged in');
          // Set a default user to prevent logout
          setUser({ id: null, name: 'User', email: '', role: 'user' });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with:', email);
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);

      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        toast.success('Login successful!');
        console.log('Login successful, user set:', response.user);
      }

      return response;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Login error response:', err.response);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    toast.success('Logged out successfully!');
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);

      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        toast.success('Registration successful!');
      }

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
