import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { analyticsAPI } from '../services/modules';
import { useSelector } from 'react-redux';
import { selectToken, selectIsAuthenticated } from '../store/authSlice';

const Analytics = () => {
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    date_from: '',
    date_to: '',
    agent_id: '',
  });

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [filters, token, isAuthenticated]);

  const fetchAnalytics = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.agent_id) params.agent_id = filters.agent_id;

      const data = await analyticsAPI.getOverview(params);
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics fetch failed:', err);
      const msg = err.response?.data?.detail || 'Failed to load analytics data';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ date_from: '', date_to: '', agent_id: '' });
  };

  const getStatusColor = (status) => {
    const map = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-amber-100 text-amber-800 border-amber-200',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      converted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      closed_lost: 'bg-red-100 text-red-800 border-red-200',
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getConversionColor = (rate = 0) => {
    if (rate >= 25) return 'text-emerald-600';
    if (rate >= 15) return 'text-green-600';
    if (rate >= 8) return 'text-yellow-600';
    if (rate >= 3) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatPercent = (val = 0) => val.toFixed(1) + '%';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">
            There are no analytics records yet or the current filters are too restrictive.
          </p>
          <button
            onClick={clearFilters}
            className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition shadow-md"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  const total = analytics.overview?.total_leads || 0;

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Analytics Overview
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Track leads, conversions, traffic sources and team performance
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={e => handleFilterChange('date_from', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={e => handleFilterChange('date_to', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>
              <select
                value={filters.agent_id}
                onChange={e => handleFilterChange('agent_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">All Agents</option>
                {analytics?.agent_performance?.map(agent => (
                  <option key={agent.agent_id} value={agent.agent_id}>
                    {agent.agent_name || agent.agent_email || `Agent #${agent.agent_id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full lg:w-auto px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-xl transition shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Leads', value: analytics.overview?.total_leads ?? 0, color: 'text-gray-900' },
            { title: 'Recent Leads', value: analytics.overview?.recent_leads ?? 0, color: 'text-blue-600' },
            { title: 'Converted', value: analytics.overview?.converted_leads ?? 0, color: 'text-emerald-600' },
            {
              title: 'Conversion Rate',
              value: formatPercent(analytics.overview?.conversion_rate ?? 0),
              color: getConversionColor(analytics.overview?.conversion_rate ?? 0),
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                {card.title}
              </h4>
              <p className={`text-4xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-7">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Lead Status Distribution</h3>
            <div className="space-y-5">
              {analytics.status_breakdown?.length > 0 ? (
                analytics.status_breakdown.map(item => {
                  const pct = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <div key={item.status} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="font-medium text-gray-800">{item.count}</span>
                        </div>
                        <span className="text-gray-600 font-medium">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500 italic">
                  No status data available in selected period
                </div>
              )}
            </div>
          </div>

          {/* Traffic Breakdown */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-7">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Traffic Sources</h3>
            <div className="space-y-5">
              {analytics.traffic_breakdown?.length > 0 ? (
                analytics.traffic_breakdown.map(item => {
                  const pct = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <div key={item.traffic_source} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {item.traffic_source.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="font-medium text-gray-800">{item.count}</span>
                        </div>
                        <span className="text-gray-600 font-medium">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500 italic">
                  No traffic source data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        {analytics?.agent_performance?.length > 0 && (
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="px-7 py-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Agent Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-7 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-7 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Leads
                    </th>
                    <th className="px-7 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Converted
                    </th>
                    <th className="px-7 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analytics.agent_performance.map(agent => (
                    <tr key={agent.agent_id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-7 py-5 whitespace-nowrap">
                        <div className="text-base font-medium text-gray-900">
                          {agent.agent_name || agent.agent_email || `Agent #${agent.agent_id}`}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          ID: {agent.agent_id}
                        </div>
                      </td>
                      <td className="px-7 py-5 text-base font-medium text-gray-900">
                        {agent.total_leads ?? 0}
                      </td>
                      <td className="px-7 py-5 text-base font-medium text-emerald-600">
                        {agent.converted_leads ?? 0}
                      </td>
                      <td className="px-7 py-5">
                        <span className={`text-xl font-bold ${getConversionColor(agent.conversion_rate)}`}>
                          {formatPercent(agent.conversion_rate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info footer */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-blue-900 mb-5">Quick Reference</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-blue-800">
            <li>• Conversion rate = Converted ÷ Total Leads</li>
            <li>• Data updates in real-time based on selected filters</li>
            <li>• Only converted leads contribute to success metrics</li>
            <li>• Traffic sources help identify best acquisition channels</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;