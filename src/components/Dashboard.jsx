import React, { useState, useEffect } from 'react';
import { usersAPI, propertiesAPI, collaborationsAPI, slidesAPI } from '../services/api.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    collaborations: 0,
    slides: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, propertiesRes, collaborationsRes, slidesRes] = await Promise.all([
          usersAPI.getAll(),
          propertiesAPI.getAll(),
          collaborationsAPI.getAll(),
          slidesAPI.getAll(),
        ]);

        setStats({
          users: usersRes.length || 0,
          properties: propertiesRes.length || 0,
          collaborations: collaborationsRes.length || 0,
          slides: slidesRes.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to DAMAC Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">🏠</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
              <p className="text-3xl font-bold text-green-600">{stats.properties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Collaborations</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.collaborations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <span className="text-2xl">🎠</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.slides}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-blue-600 mr-2">+</span> Add New User
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-green-600 mr-2">+</span> Add New Property
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-purple-600 mr-2">+</span> Add New Collaboration
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-orange-600 mr-2">+</span> Add New Slide
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backend API</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Sync</span>
              <span className="text-gray-500 text-sm">Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
