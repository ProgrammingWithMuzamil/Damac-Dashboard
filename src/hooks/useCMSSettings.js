import { useSelector } from 'react-redux';
import { 
  selectCMSSettings, 
  selectCMSLoading, 
  selectCMSLoaded, 
  selectSectionVisibility 
} from '../store/cmsSettingsSlice';

/**
 * Custom hook for accessing CMS settings directly from Redux
 * This is the recommended way for components to access CMS settings
 * 
 * Usage:
 * const { settings, loading, loaded, isVisible } = useCMSSettings();
 * 
 * // Check if a section is visible
 * const showHero = isVisible('heroSection');
 */
export const useCMSSettings = () => {
  const settings = useSelector(selectCMSSettings);
  const loading = useSelector(selectCMSLoading);
  const loaded = useSelector(selectCMSLoaded);

  const isVisible = (section) => {
    return useSelector((state) => selectSectionVisibility(state, section));
  };

  return {
    settings,
    loading,
    loaded,
    isVisible,
  };
};

export default useCMSSettings;
