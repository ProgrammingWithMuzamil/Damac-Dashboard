import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/modules/auth';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (!response.token) {
        throw new Error('No token received from login');
      }

      let userData = response.user || {
        id: response.id,
        username: response.username || email.split('@')[0],
        email: email,
        role: response.role || 'user',
        is_active: response.is_active || true,
        is_staff: response.is_staff || false,
        is_superuser: response.is_superuser || false
      };

      // Force correct role for admin@gmail.com only if it's actually an admin
      if (userData.email === 'admin@gmail.com' && userData.role === 'admin') {
        userData.role = 'admin';
        userData.is_staff = true;
        userData.is_superuser = true;
      }

      // Create name field from username or email for display purposes
      if (!userData.name) {
        userData.name = userData.username || userData.email.split('@')[0];
      }

      return {
        user: userData,
        token: response.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // IMPORTANT GUARD: Only fetch profile if token exists AND user is null AND profileLoaded is false
      if (!auth.token || auth.user || auth.profileLoaded) {
        return rejectWithValue('Profile fetch not needed - already loaded or no token');
      }

      const response = await authAPI.getProfile();
      let userData = response.user;

      // Force correct role for admin@gmail.com only if it's actually an admin
      if (userData.email === 'admin@gmail.com' && userData.role === 'admin') {
        userData.role = 'admin';
        userData.is_staff = true;
        userData.is_superuser = true;
      }

      // Ensure user has a name field
      if (!userData.name && userData.first_name) {
        userData.name = `${userData.first_name} ${userData.last_name || ''}`.trim();
      } else if (!userData.name) {
        userData.name = userData.email.split('@')[0];
      }

      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile fetch failed');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  profileLoaded: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.profileLoaded = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setTokenFromStorage: (state, action) => {
      const token = action.payload;
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.profileLoaded = true; // Set to true after successful login
        state.error = null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.profileLoaded = true;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Don't logout on profile fetch failure - keep token
      });
  },
});

export const { logout, clearError, setTokenFromStorage, updateUser } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectProfileLoaded = (state) => state.auth.profileLoaded;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Role-based selectors
export const selectIsAdmin = (state) => {
  const user = state.auth.user;
  return user?.role === 'admin' || user?.is_admin || user?.is_staff || user?.is_superuser;
};

export const selectIsAgent = (state) => {
  const user = state.auth.user;
  return user?.role === 'agent' || user?.is_agent;
};

export default authSlice.reducer;
