import React from 'react';
import SectionGated from './SectionGated';
import PublicAgents from './PublicAgents';
import PublicLeadForm from './PublicLeadForm';
import PublicHero from './PublicHero';

/**
 * Example component showing how to use CMS settings for section gating
 * This simulates a public website layout with conditional sections
 * 
 * UPDATED: Now using proper Redux-based CMS control pattern
 */
const PublicWebsiteExample = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Using PublicHero Component (has its own CMS guard) */}
      <PublicHero />

      {/* Properties Section - Using SectionGated wrapper */}
      <SectionGated section="propertiesSection">
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
      </SectionGated>

      {/* Agents Section - Using PublicAgents Component (has its own CMS guard) */}
      <PublicAgents />

      {/* Lead Form Section - Using PublicLeadForm Component (has its own CMS guard) */}
      <PublicLeadForm />

      {/* Marketing Section - Using SectionGated wrapper */}
      <SectionGated section="marketingSection">
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
      </SectionGated>

      {/* Hidden Section Example - Shows fallback content */}
      <SectionGated 
        section="heroSection" 
        fallback={
          <section className="py-16 bg-gray-200">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-600 text-lg">
                Hero section is currently disabled by administrator
              </p>
            </div>
          </section>
        }
      >
        {/* This content won't show because heroSection is checked above */}
      </SectionGated>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 DAMAC Properties. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">
            Sections visibility controlled by CMS Settings
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsiteExample;
