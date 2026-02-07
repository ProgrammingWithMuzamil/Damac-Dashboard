import React, { useState, useEffect } from 'react';
import { heroAPI } from '../services/modules';
import { useCMSSettings } from '../hooks/useCMSSettings';

const PublicHero = () => {
  const { isVisible } = useCMSSettings();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible('heroSection')) {
      fetchHero();
    } else {
      setLoading(false);
    }
  }, [isVisible]);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const data = await heroAPI.getPublicHero();
      setHero(data);
    } catch (error) {
      console.error('Error fetching hero:', error);
      setHero(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible('heroSection')) {
    return null; // Section is disabled in CMS settings
  }

  if (loading) {
    return (
      <section className="relative h-96 bg-gray-200 animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading hero...</div>
        </div>
      </section>
    );
  }

  if (!hero) {
    return null; // No active hero
  }

  return (
    <section className="relative h-96 overflow-hidden">
      {hero.type === 'image' && hero.media_url ? (
        <div className="relative h-full">
          <img
            src={hero.media_url}
            alt={hero.heading}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {hero.heading}
              </h1>
              {hero.subheading && (
                <p className="text-xl md:text-2xl mb-6">
                  {hero.subheading}
                </p>
              )}
              {hero.cta_text && hero.cta_link && (
                <a
                  href={hero.cta_link}
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {hero.cta_text}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : hero.type === 'video' && hero.video ? (
        <div className="relative h-full">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              src={hero.video}
              title={hero.heading}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {hero.heading}
              </h1>
              {hero.subheading && (
                <p className="text-xl md:text-2xl mb-6">
                  {hero.subheading}
                </p>
              )}
              {hero.cta_text && hero.cta_link && (
                <a
                  href={hero.cta_link}
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {hero.cta_text}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-600 px-6">
            <h2 className="text-2xl font-semibold mb-2">Hero Section</h2>
            <p>No active hero configured</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublicHero;
