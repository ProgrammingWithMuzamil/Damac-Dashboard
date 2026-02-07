import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCMSSettings, selectCMSLoaded } from '../store/cmsSettingsSlice';

/**
 * CMS Initializer Component
 * 
 * This component handles the one-time initialization of CMS settings.
 * It should be placed high in the component tree (like in App.jsx) to ensure
 * CMS settings are fetched only once per session.
 */
const CMSInitializer = () => {
  const dispatch = useDispatch();
  const loaded = useSelector(selectCMSLoaded);

  useEffect(() => {
    // Only fetch CMS settings if they haven't been loaded yet
    if (!loaded) {
      dispatch(fetchCMSSettings())
        .unwrap()
        .catch((error) => {
          console.error('CMS settings initialization failed:', error);
          // Don't show toast for initialization failures to avoid annoying users
          // The slice already has default values as fallback
        });
    }
  }, [dispatch, loaded]);

  // This component doesn't render anything
  return null;
};

export default CMSInitializer;
