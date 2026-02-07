import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { analyticsAPI } from '../services/modules';

const AgentDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await analyticsAPI.getMyAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        toast.error('Could not load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num) => new Intl.NumberFormat().format(num ?? 0);
  const formatPercentage = (num) => `${(num ?? 0).toFixed(1)}%`;

  const statusStyles = {
    new: { bg: 'bg-blue-100', text: 'text-blue-800', bar: 'bg-blue-500' },
    contacted: { bg: 'bg-amber-100', text: 'text-amber-800', bar: 'bg-amber-500' },
    in_progress: { bg: 'bg-orange-100', text: 'text-orange-800', bar: 'bg-orange-500' },
    converted: { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500' },
    closed_lost: { bg: 'bg-red-100', text: 'text-red-800', bar: 'bg-red-500' },
  };

  const getStatusStyle = (status) => statusStyles[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    bar: 'bg-gray-400'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No data available</h2>
          <p className="text-gray-600 mb-8">
            You don't have any assigned leads yet or there was an issue loading your analytics.
          </p>
          <a
            href="/agent/leads"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Go to My Leads
          </a>
        </div>
      </div>
    );
  }

  const total = analytics.overview?.total_leads ?? 0;
  const conversionRate = analytics.overview?.conversion_rate ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-10 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="mt-2 text-base md:text-lg text-gray-600">
            Overview of your assigned leads and performance
          </p>
        </div>

        {/* KPI Cards - responsive: 1 → 2 → 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {formatNumber(total)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Converted</p>
                <p className="text-2xl md:text-3xl font-bold text-emerald-600 mt-1">
                  {formatNumber(analytics.overview?.converted_leads)}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-600 mt-1">
                  {formatNumber(analytics.overview?.in_progress_leads)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {formatPercentage(conversionRate)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(conversionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Status Breakdown - takes more space on large screens */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 md:mb-6">
              Lead Status Distribution
            </h3>

            <div className="space-y-4 md:space-y-5">
              {analytics.status_breakdown?.map((item) => {
                const style = getStatusStyle(item.status);
                const percentage = total > 0 ? (item.count / total) * 100 : 0;

                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm md:text-base">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                          {item.label || item.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="font-medium text-gray-800">{formatNumber(item.count)}</span>
                      </div>
                      <span className="text-gray-500 font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${style.bar} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 md:mb-6">
              Recent Activity
            </h3>

            {analytics.recent_activity?.length > 0 ? (
              <div className="space-y-5 md:space-y-6">
                {analytics.recent_activity.map((act) => {
                  const style = getStatusStyle(act.status);

                  return (
                    <div key={act.id} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{act.name}</p>
                          <p className="text-sm text-gray-500 break-all">{act.email}</p>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text} whitespace-nowrap`}>
                          {act.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        Updated: {new Date(act.updated_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>

                      {act.internal_notes && Object.keys(act.internal_notes).length > 0 && (
                        <div className="mt-3 text-xs bg-gray-50 p-3 rounded border border-gray-100">
                          <strong className="text-gray-700 block mb-1">Latest note:</strong>
                          <span className="text-gray-600">
                            {Object.values(act.internal_notes)[0]?.note?.slice(0, 140)}
                            {Object.values(act.internal_notes)[0]?.note?.length > 140 ? '...' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm md:text-base italic py-4">
                No recent activity in the last 7 days
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentDashboard;