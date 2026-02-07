import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { leadsAPI } from '../services/modules';
import { useCMSSettings } from '../hooks/useCMSSettings';
import { initializeTrafficTracking, getTrafficTrackingData, getCurrentSourcePage } from '../utils/trafficTracking';

const PublicLeadForm = () => {
  const { isVisible } = useCMSSettings();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source_page: '',
    traffic_source: 'organic',
  });
  const [loading, setLoading] = useState(false);

  const trafficSourceOptions = [
    { value: 'organic', label: 'Organic Search' },
    { value: 'ads', label: 'Advertisement' },
    { value: 'campaign', label: 'Marketing Campaign' },
    { value: 'referral', label: 'Referral' },
    { value: 'social', label: 'Social Media' },
    { value: 'direct', label: 'Direct Visit' },
    { value: 'other', label: 'Other' },
  ];

  // Initialize traffic tracking on component mount
  useEffect(() => {
    initializeTrafficTracking();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name && !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Get traffic tracking data
      const trackingData = getTrafficTrackingData();
      const currentSourcePage = getCurrentSourcePage();
      
      const leadData = {
        ...formData,
        source_page: currentSourcePage,
        traffic_source: trackingData.traffic_source,
        utm_source: trackingData.utm_source,
        utm_medium: trackingData.utm_medium,
        utm_campaign: trackingData.utm_campaign,
      };

      const response = await leadsAPI.submitLead(leadData);
      
      toast.success('Lead submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        source_page: '',
        traffic_source: 'organic',
      });
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      
      if (error.response?.status === 403) {
        toast.error('Lead form is currently disabled. Please try again later.');
      } else {
        toast.error('Failed to submit lead. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible('leadFormSection')) {
    return null; 
    
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="traffic_source" className="block text-sm font-medium text-gray-700 mb-2">
                  How did you hear about us?
                </label>
                <select
                  id="traffic_source"
                  name="traffic_source"
                  value={formData.traffic_source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {trafficSourceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  * Required fields
                </p>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              We'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicLeadForm;
