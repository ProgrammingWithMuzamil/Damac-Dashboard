import React from 'react';
import { useSelector } from 'react-redux';
import { selectCMSSettings, selectCMSLoading } from '../store/cmsSettingsSlice';
import PublicHero from './PublicHero';
import PublicAgents from './PublicAgents';
import PublicLeadForm from './PublicLeadForm';

/**
 * Complete Public Website with CMS-controlled section visibility
 * 
 * This component demonstrates the proper implementation pattern:
 * 1. Read CMS settings from Redux ONLY
 * 2. For EACH section: IF cms?.[section] === false → do NOT render
 * 3. No API calls inside components for CMS settings
 * 4. If cmsSettings not loaded yet → render skeleton
 */
const PublicWebsite = () => {
  // 1. Read CMS settings from Redux ONLY
  const cms = useSelector(selectCMSSettings);
  const loading = useSelector(selectCMSLoading);

  // 4. If cmsSettings not loaded yet → render skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Skeleton */}
        <section className="relative h-96 bg-gray-200 animate-pulse">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading...</div>
          </div>
        </section>

        {/* Properties Skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-12 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agents Skeleton */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-12 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Form Skeleton */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-12 animate-pulse"></div>
              <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketing Skeleton */}
        <section className="py-16 bg-blue-600">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-blue-400 rounded w-96 mx-auto mb-12 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-16 h-16 bg-blue-400 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-blue-400 rounded w-24 mx-auto mb-2"></div>
                  <div className="h-4 bg-blue-400 rounded w-32 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* 2. IF cms?.heroSection === false → do NOT render Hero */}
      {cms?.heroSection !== false && <PublicHero />}

      {/* Properties Section */}
      {/* 2. IF cms?.propertiesSection === false → do NOT render Properties */}
      {cms?.propertiesSection !== false && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Luxury Villa {i}</h3>
                    <p className="text-gray-600 mb-4">Stunning 4-bedroom villa with pool</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">$2,500,000</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Agents Section */}
      {/* 2. IF cms?.agentsSection === false → do NOT render Agents */}
      {cms?.agentsSection !== false && <PublicAgents />}

      {/* Lead Form Section */}
      {/* 2. IF cms?.leadFormSection === false → do NOT render Lead Form */}
      {cms?.leadFormSection !== false && <PublicLeadForm />}

      {/* Marketing Section */}
      {/* 2. IF cms?.marketingSection === false → do NOT render Marketing */}
      {cms?.marketingSection !== false && (
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose DAMAC Properties?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Award Winning</h3>
                <p className="text-blue-100">
                  Recognized excellence in real estate development
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Presence</h3>
                <p className="text-blue-100">
                  Properties in prime locations worldwide
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Luxury Living</h3>
                <p className="text-blue-100">
                  Premium amenities and exceptional quality
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DAMAC Properties. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">
            Sections visibility controlled by CMS Settings
          </p>
          {/* Debug: Show current CMS settings (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-gray-500">
              CMS Settings: {JSON.stringify(cms)}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;
