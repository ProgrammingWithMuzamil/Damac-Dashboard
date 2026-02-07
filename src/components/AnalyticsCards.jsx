import React from 'react';

const AnalyticsCards = ({ data, loading }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`;
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return '↑';
    if (current < previous) return '↓';
    return '→';
  };

  const getTrendColor = (current, previous) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getConversionRateColor = (rate) => {
    if (rate >= 20) return 'text-green-600';
    if (rate >= 10) return 'text-yellow-600';
    if (rate >= 5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Leads Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2zm0 0V9a2 2 0 002-2h2a2 2 0 002 2v2a2 2 0 002-2H9a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Total Leads</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(data.overview?.total_leads)}
            </p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
        </div>
      </div>

      {/* Conversion Rate Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2m0 0l7-7 7-7" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Conversion Rate</h3>
            <p className={`text-2xl font-bold ${getConversionRateColor(data.overview?.conversion_rate)}`}>
              {formatPercentage(data.overview?.conversion_rate)}
            </p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Active Agents Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-full">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 100 8 0 4 4 0 00-8 0zM12 14a7 7 0 00-7 7h14a7 7 0 007 7 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Active Agents</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(data.overview?.active_agents || 0)}
            </p>
            <p className="text-sm text-gray-500">With assigned leads</p>
          </div>
        </div>
      </div>

      {/* Recent Leads Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-full">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0 0l7-7 7-7M5 19h14a2 2 0 002 2v6a2 2 0 002-2H7a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Leads</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(data.overview?.recent_leads)}
            </p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
        </div>
      </div>

      {/* Converted Leads Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 bg-teal-100 rounded-full">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2m0 0l7-7 7-7M5 19h14a2 2 0 002 2v6a2 2 0 002 2H7a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Converted</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(data.overview?.converted_leads)}
            </p>
            <p className="text-sm text-gray-500">All time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCards;
