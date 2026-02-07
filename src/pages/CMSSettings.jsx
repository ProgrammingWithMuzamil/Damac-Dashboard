import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCMSSettings, 
  selectCMSLoading, 
  updateCMSSettings,
  fetchCMSSettings 
} from '../store/cmsSettingsSlice';

const CMSSettings = () => {
  const dispatch = useDispatch();
  const cmsSettings = useSelector(selectCMSSettings);
  const loading = useSelector(selectCMSLoading);
  const [saving, setSaving] = useState(false);

  // Initialize local settings with Redux state
  const [settings, setSettings] = useState(cmsSettings);

  // Update local state when Redux state changes
  useEffect(() => {
    setSettings(cmsSettings);
  }, [cmsSettings]);

  const resetSettings = () => {
    dispatch(fetchCMSSettings());
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await dispatch(updateCMSSettings(settings)).unwrap();
      toast.success('CMS settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save CMS settings');
      console.error('Error saving CMS settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChange = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const toggleFields = [
    {
      key: 'heroSection',
      label: 'Hero Section',
      description: 'Show main hero banner on homepage',
    },
    {
      key: 'agentsSection',
      label: 'Agents Section',
      description: 'Display agents/team section',
    },
    {
      key: 'propertiesSection',
      label: 'Properties Section',
      description: 'Show properties listings',
    },
    {
      key: 'leadFormSection',
      label: 'Lead Form Section',
      description: 'Display contact/lead generation form',
    },
    {
      key: 'marketingSection',
      label: 'Marketing Section',
      description: 'Show marketing/promotional content',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading CMS Settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CMS Settings</h1>
        <p className="text-gray-600">
          Control the visibility of different sections on the website
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {toggleFields.map((field) => (
            <div key={field.key} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {field.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {field.description}
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => handleToggleChange(field.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    settings[field.key]
                      ? 'bg-blue-600 focus:ring-blue-500'
                      : 'bg-gray-200 focus:ring-gray-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      settings[field.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={resetSettings}
            disabled={saving}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Note
        </h4>
        <p className="text-sm text-blue-600">
          These settings control which sections are visible on the public website. 
          Changes take effect immediately after saving.
        </p>
      </div>
    </div>
  );
};

export default CMSSettings;
