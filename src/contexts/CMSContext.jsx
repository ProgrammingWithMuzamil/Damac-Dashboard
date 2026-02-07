import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchCMSSettings, 
  updateCMSSettings,
  selectCMSSettings,
  selectCMSLoading,
  selectCMSLoaded,
  selectCMSError,
  selectSectionVisibility
} from '../store/cmsSettingsSlice';

const CMSContext = createContext();

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

export const CMSProvider = ({ children }) => {
  const dispatch = useDispatch();
  const settings = useSelector(selectCMSSettings);
  const loading = useSelector(selectCMSLoading);
  const loaded = useSelector(selectCMSLoaded);
  const error = useSelector(selectCMSError);

  // CMS settings are now fetched by CMSInitializer component
  // No need for useEffect here anymore

  const updateSettings = async (newSettings) => {
    try {
      const result = await dispatch(updateCMSSettings(newSettings));
      if (updateCMSSettings.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw new Error(result.payload || 'Failed to update CMS settings');
      }
    } catch (error) {
      toast.error('Failed to update CMS settings');
      console.error('Error updating CMS settings:', error);
      throw error;
    }
  };

  const value = {
    settings,
    loading,
    loaded,
    error,
    fetchSettings: () => dispatch(fetchCMSSettings()), // Manual fetch if needed
    updateSettings,
    // Helper methods for checking visibility - now using Redux selector
    isVisible: (section) => {
      return (state) => selectSectionVisibility(state, section);
    },
  };

  return (
    <CMSContext.Provider value={value}>
      {children}
    </CMSContext.Provider>
  );
};
