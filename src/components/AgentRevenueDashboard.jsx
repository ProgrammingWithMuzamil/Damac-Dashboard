import React, { useState, useEffect } from 'react';
import { agentLeadsAPI } from '../services/modules/agentLeads';
import dayjs from 'dayjs';

const AgentRevenueDashboard = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const data = await agentLeadsAPI.getRevenueStats();
      setRevenueData(data);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError(err.response?.data?.error || 'Failed to load revenue statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <span className="text-red-500 mr-2">⚠️</span>
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <span className="text-blue-500 mr-2">ℹ️</span>
          <div>
            <h3 className="text-blue-800 font-medium">No Data Available</h3>
            <p className="text-blue-600 text-sm">Revenue statistics are not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const avgDealValue = revenueData.converted_leads_count > 0 
    ? revenueData.total_revenue / revenueData.converted_leads_count 
    : 0;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <span className="text-2xl text-blue-600 mr-3">🏆</span>
        <h2 className="text-2xl font-bold text-gray-900">My Revenue Dashboard</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {revenueData.total_revenue.toFixed(2)} AED
              </p>
            </div>
            <span className="text-3xl text-green-500 opacity-50">💰</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commission</p>
              <p className="text-2xl font-bold text-blue-600">
                {revenueData.total_commission.toFixed(2)} AED
              </p>
            </div>
            <span className="text-3xl text-blue-500 opacity-50">💰</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Converted Leads</p>
              <p className="text-2xl font-bold text-purple-600">
                {revenueData.converted_leads_count}
              </p>
            </div>
            <span className="text-3xl text-purple-500 opacity-50">👤</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Deal Value</p>
              <p className="text-2xl font-bold text-pink-600">
                {avgDealValue.toFixed(2)} AED
              </p>
            </div>
            <span className="text-3xl text-pink-500 opacity-50">📈</span>
          </div>
        </div>
      </div>

      {/* Revenue by Month */}
      {revenueData.revenue_by_month && revenueData.revenue_by_month.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 mr-2">📅</span>
            <h3 className="text-lg font-semibold text-gray-900">Revenue by Month</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deals
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.revenue_by_month.map((month, index) => (
                  <tr key={month.month} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dayjs(month.month).format('MMMM YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {month.revenue ? `${month.revenue} AED` : '0 AED'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {month.commission ? `${month.commission} AED` : '0 AED'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {month.deals_count} deals
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Deals */}
      {revenueData.recent_deals && revenueData.recent_deals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-600 mr-2">🏆</span>
            <h3 className="text-lg font-semibold text-gray-900">Recent Deals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Closed Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.recent_deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{deal.lead_name}</div>
                        <div className="text-sm text-gray-500">{deal.lead_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {deal.revenue_amount} {deal.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {deal.commission_amount ? `${deal.commission_amount} ${deal.currency}` : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dayjs(deal.closed_date).format('MMM DD, YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Deals Message */}
      {(!revenueData.recent_deals || revenueData.recent_deals.length === 0) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <span className="text-4xl text-gray-300 mx-auto mb-4 block">🏆</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Deals Yet</h3>
            <p className="text-gray-600">
              You don't have any converted leads with recorded revenue yet. 
              Keep working on your leads and ask your admin to record revenue when deals are closed!
            </p>
          </div>
        </div>
      )}

      {/* Performance Tips */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Focus on converting leads to 'Converted' status to unlock revenue tracking</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Contact your admin to record revenue amounts for converted deals</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Track your monthly performance to identify trends and opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentRevenueDashboard;
