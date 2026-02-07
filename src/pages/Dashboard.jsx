import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { leadsAPI, agentsAPI, propertiesAPI, analyticsAPI } from '../services/modules';
import { useSelector } from 'react-redux';
import { selectToken, selectIsAuthenticated } from '../store/authSlice';

const Dashboard = () => {
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // DEBUG: Log authentication state
  console.log('Dashboard - Auth State:', { 
    token: token ? 'exists' : 'missing', 
    isAuthenticated, 
    localStorageToken: localStorage.getItem('token') ? 'exists' : 'missing' 
  });
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsByStatus: {
      new: 0,
      contacted: 0,
      in_progress: 0,
      converted: 0,
      closed_lost: 0
    },
    totalAgents: 0,
    totalProperties: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // CRITICAL: Only fetch data if we have a valid token AND user is authenticated
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }
    
    fetchDashboardData();
  }, [token, isAuthenticated]);

  const fetchDashboardData = async () => {
    // CRITICAL: Double-check token before making any API calls
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [leadsData, agentsData, propertiesData, analyticsData] = await Promise.all([
        leadsAPI.getAll().catch(() => ({ results: [] })),
        agentsAPI.getAll().catch(() => ({ results: [] })),
        propertiesAPI.getAll().catch(() => ({ results: [] })),
        analyticsAPI.getOverview().catch(() => ({}))
      ]);

      // Calculate leads by status
      const leadsByStatus = {
        new: 0,
        contacted: 0,
        in_progress: 0,
        converted: 0,
        closed_lost: 0
      };

      const leads = leadsData.results || [];
      leads.forEach(lead => {
        if (leadsByStatus.hasOwnProperty(lead.status)) {
          leadsByStatus[lead.status]++;
        }
      });

      // Set dashboard stats
      setStats({
        totalLeads: leads.length,
        leadsByStatus,
        totalAgents: agentsData.results?.length || 0,
        totalProperties: propertiesData.results?.length || 0,
        totalRevenue: analyticsData.total_revenue || 0,
      });

    } catch (err) {
      setError('Failed to fetch dashboard data');
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12 text-red-500">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error loading dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your real estate business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Leads</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalLeads}</p>
              <p className="text-sm text-gray-500">All time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Converted Leads</h3>
              <p className="text-3xl font-bold text-green-600">{stats.leadsByStatus.converted}</p>
              <p className="text-sm text-gray-500">Successfully converted</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Properties</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalProperties}</p>
              <p className="text-sm text-gray-500">Currently listed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Agents</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.totalAgents}</p>
              <p className="text-sm text-gray-500">Active agents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leads by Status Breakdown */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Leads by Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.leadsByStatus.new}</div>
                <div className="text-sm text-gray-600 mt-1">New</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.leadsByStatus.contacted}</div>
                <div className="text-sm text-gray-600 mt-1">Contacted</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.leadsByStatus.in_progress}</div>
                <div className="text-sm text-gray-600 mt-1">In Progress</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.leadsByStatus.converted}</div>
                <div className="text-sm text-gray-600 mt-1">Converted</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.leadsByStatus.closed_lost}</div>
                <div className="text-sm text-gray-600 mt-1">Closed Lost</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      {stats.totalRevenue > 0 && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          ℹ️ Dashboard Info
        </h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Real-time data from backend database</li>
          <li>• Live lead status tracking and conversion metrics</li>
          <li>• Current property and agent counts</li>
          <li>• Performance analytics and revenue overview</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
