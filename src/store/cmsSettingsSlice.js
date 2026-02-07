import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cmssettingsAPI } from '../services/modules/cmssettings';

// Async thunk for fetching CMS settings
export const fetchCMSSettings = createAsyncThunk(
  'cmsSettings/fetchCMSSettings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cmsSettings } = getState();
      
      // IMPORTANT GUARD: Only fetch if not already loaded
      if (cmsSettings.loaded) {
        return rejectWithValue('CMS settings already loaded');
      }

      const response = await cmssettingsAPI.get();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch CMS settings');
    }
  }
);

// Async thunk for updating CMS settings
export const updateCMSSettings = createAsyncThunk(
  'cmsSettings/updateCMSSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await cmssettingsAPI.update(settingsData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update CMS settings');
    }
  }
);

const initialState = {
  data: {
    heroSection: true,
    agentsSection: true,
    propertiesSection: true,
    leadFormSection: true,
    marketingSection: true,
  },
  loading: false,
  loaded: false,
  error: null,
};

const cmsSettingsSlice = createSlice({
  name: 'cmsSettings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCMSSettings: (state) => {
      state.data = initialState.data;
      state.loading = false;
      state.loaded = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CMS Settings
      .addCase(fetchCMSSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCMSSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.loaded = true;
        state.error = null;
      })
      .addCase(fetchCMSSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Keep default values on error
        state.loaded = true; // Set to true to prevent repeated failed calls
      })
      // Update CMS Settings
      .addCase(updateCMSSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCMSSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateCMSSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCMSSettings } = cmsSettingsSlice.actions;

// Selectors
export const selectCMSSettings = (state) => state.cmsSettings.data;
export const selectCMSLoading = (state) => state.cmsSettings.loading;
export const selectCMSLoaded = (state) => state.cmsSettings.loaded;
export const selectCMSError = (state) => state.cmsSettings.error;

// Helper selector for checking section visibility
export const selectSectionVisibility = (state, section) => {
  const settings = state.cmsSettings.data;
  
  // Map frontend section names to backend field names
  const sectionMap = {
    'heroSection': 'heroSection',
    'agentsSection': 'agentsSection', 
    'propertiesSection': 'propertiesSection',
    'leadFormSection': 'leadFormSection',
    'marketingSection': 'marketingSection',
  };
  
  const backendField = sectionMap[section] || section;
  return settings[backendField] || false;
};

// Hook for components to easily access CMS settings
export const useCMSSettings = () => {
  const data = selectCMSSettings;
  const loading = selectCMSLoading;
  const loaded = selectCMSLoaded;
  const error = selectCMSError;
  
  const isVisible = (section) => (state) => selectSectionVisibility(state, section);
  
  return {
    data,
    loading,
    loaded,
    error,
    isVisible,
  };
};

export default cmsSettingsSlice.reducer;
