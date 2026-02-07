/**
 * Traffic Source Tracking Utility
 * 
 * Automatically detects traffic source from URL parameters and referrer
 * Persists tracking data for the session
 * Provides data for lead form submission
 */

// Storage keys
const STORAGE_KEYS = {
  TRAFFIC_SOURCE: 'traffic_source',
  UTM_SOURCE: 'utm_source',
  UTM_MEDIUM: 'utm_medium', 
  UTM_CAMPAIGN: 'utm_campaign',
  FIRST_LANDING_PAGE: 'first_landing_page',
  SESSION_STARTED: 'session_started'
};

// Social media domains for detection
const SOCIAL_DOMAINS = [
  'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com',
  'youtube.com', 'tiktok.com', 'pinterest.com', 'reddit.com'
];

/**
 * Initialize traffic tracking on first page load
 */
export const initializeTrafficTracking = () => {
  // Only initialize once per session
  if (localStorage.getItem(STORAGE_KEYS.SESSION_STARTED)) {
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    const currentPath = window.location.pathname + window.location.search;

    // Get UTM parameters
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');

    // Determine traffic source
    let trafficSource = 'organic'; // default
    
    if (utmSource || utmMedium) {
      // If UTM exists, prioritize it
      if (utmMedium?.toLowerCase().includes('cpc') || 
          utmMedium?.toLowerCase().includes('paid') || 
          utmMedium?.toLowerCase().includes('ppc')) {
        trafficSource = 'ads';
      } else {
        trafficSource = 'campaign';
      }
    } else if (referrer) {
      // Check referrer
      const referrerDomain = new URL(referrer).hostname;
      
      if (SOCIAL_DOMAINS.some(domain => referrerDomain.includes(domain))) {
        trafficSource = 'social';
      } else if (referrerDomain !== window.location.hostname) {
        trafficSource = 'referral';
      } else {
        trafficSource = 'direct';
      }
    } else {
      // No referrer and no UTM = organic or direct
      trafficSource = 'direct';
    }

    // Store tracking data
    const trackingData = {
      trafficSource,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      firstLandingPage: currentPath,
      timestamp: new Date().toISOString()
    };

    // Persist to localStorage
    Object.entries(trackingData).forEach(([key, value]) => {
      const storageKey = STORAGE_KEYS[key.toUpperCase()];
      if (value) {
        localStorage.setItem(storageKey, value);
      }
    });

    // Mark session as started
    localStorage.setItem(STORAGE_KEYS.SESSION_STARTED, 'true');

    console.log('Traffic tracking initialized:', trackingData);
    
  } catch (error) {
    console.error('Error initializing traffic tracking:', error);
  }
};

/**
 * Get stored traffic tracking data
 */
export const getTrafficTrackingData = () => {
  try {
    return {
      traffic_source: localStorage.getItem(STORAGE_KEYS.TRAFFIC_SOURCE) || 'organic',
      utm_source: localStorage.getItem(STORAGE_KEYS.UTM_SOURCE),
      utm_medium: localStorage.getItem(STORAGE_KEYS.UTM_MEDIUM),
      utm_campaign: localStorage.getItem(STORAGE_KEYS.UTM_CAMPAIGN),
      source_page: localStorage.getItem(STORAGE_KEYS.FIRST_LANDING_PAGE) || window.location.pathname
    };
  } catch (error) {
    console.error('Error getting traffic tracking data:', error);
    return {
      traffic_source: 'organic',
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      source_page: window.location.pathname
    };
  }
};

/**
 * Clear traffic tracking data (for testing)
 */
export const clearTrafficTrackingData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing traffic tracking data:', error);
  }
};

/**
 * Get current page path for lead submission
 */
export const getCurrentSourcePage = () => {
  return window.location.pathname + window.location.search;
};

/**
 * Debug function to get all tracking data
 */
export const getDebugTrackingInfo = () => {
  const data = getTrafficTrackingData();
  return {
    ...data,
    raw_url: window.location.href,
    referrer: document.referrer,
    user_agent: navigator.userAgent
  };
};
