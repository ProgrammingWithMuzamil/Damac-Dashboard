import React, { createContext, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  fetchProfile,
  logout as logoutAction,
  clearError,
  setTokenFromStorage,
  updateUser as updateUserAction,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectProfileLoaded,
  selectAuthLoading,
  selectAuthError,
  selectIsAdmin,
  selectIsAgent
} from '../store/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profileLoaded = useSelector(selectProfileLoaded);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAdmin = useSelector(selectIsAdmin);
  const isAgent = useSelector(selectIsAgent);

  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(setTokenFromStorage(storedToken));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token && !user && !profileLoaded && !loading) {
      dispatch(fetchProfile())
        .unwrap()
        .catch((error) => {
          console.error('Profile fetch failed:', error);
        });
    }
  }, [dispatch, token, user, profileLoaded, loading]);

  const login = async (email, password) => {
    try {
      dispatch(clearError());
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        toast.success('Login successful!');
        return result.payload;
      } else {
        throw new Error(result.payload || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      toast.error(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch(logoutAction());
    setShowLogoutModal(false);
    toast.success('Logged out successfully!');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const register = async (userData) => {
    try {
      dispatch(clearError());
      const { authAPI } = await import('../services/modules/auth');
      const response = await authAPI.register(userData);

      if (response.token) {
        await dispatch(loginUser({ email: userData.email, password: userData.password }));
        toast.success('Registration successful!');
      }

      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw err;
    }
  };
  const updateUser = (userData) => {
    dispatch(updateUserAction(userData));
  };

  const value = {
    user,
    login,
    logout,
    confirmLogout,
    cancelLogout,
    register,
    updateUser,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isAgent,
    showLogoutModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
