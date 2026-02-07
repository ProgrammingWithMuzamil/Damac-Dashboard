import React from 'react';
import { useCMSSettings } from '../hooks/useCMSSettings';

/**
 * SectionGated component - conditionally renders children based on CMS settings
 * 
 * @param {string} section - The CMS setting key (e.g., 'heroSection', 'agentsSection')
 * @param {React.ReactNode} children - Content to render if section is visible
 * @param {React.ReactNode} fallback - Optional fallback content if section is hidden
 * @param {string} className - Optional CSS classes for the wrapper
 */
const SectionGated = ({ 
  section, 
  children, 
  fallback = null, 
  className = '' 
}) => {
  const { isVisible, loading } = useCMSSettings();

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!isVisible(section)) {
    return fallback;
  }

  return <div className={className}>{children}</div>;
};

export default SectionGated;
