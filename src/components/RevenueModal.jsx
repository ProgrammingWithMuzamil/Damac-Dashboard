import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiDollarSign, FiX, FiCalendar, FiPercent } from 'react-icons/fi';
import { agentLeadsAPI } from '../services/modules/agentLeads';
import dayjs from 'dayjs';

const RevenueModal = ({ visible, onCancel, lead, onSuccess, deal = null }) => {
  const [formData, setFormData] = useState({
    revenue_amount: '',
    currency: 'AED',
    closed_date: dayjs().format('YYYY-MM-DD'),
    commission_rate: '',
  });
  const [loading, setLoading] = useState(false);
  const [commissionAmount, setCommissionAmount] = useState(null);

  const isEdit = Boolean(deal);

  useEffect(() => {
    if (visible && deal) {
      // Edit mode - populate form with existing deal data
      setFormData({
        revenue_amount: deal.revenue_amount,
        currency: deal.currency,
        closed_date: deal.closed_date,
        commission_rate: deal.commission_rate || '',
      });
      calculateCommission(deal.revenue_amount, deal.commission_rate);
    } else if (visible && lead) {
      // Create mode - reset form
      setFormData({
        revenue_amount: '',
        currency: 'AED',
        closed_date: dayjs().format('YYYY-MM-DD'),
        commission_rate: '',
      });
      setCommissionAmount(null);
    }
  }, [visible, deal, lead]);

  const calculateCommission = (revenue, rate) => {
    if (revenue && rate) {
      const commission = (revenue * rate) / 100;
      setCommissionAmount(commission);
    } else {
      setCommissionAmount(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'revenue_amount') {
      const rate = formData.commission_rate;
      calculateCommission(value, rate);
    } else if (name === 'commission_rate') {
      const revenue = formData.revenue_amount;
      calculateCommission(revenue, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.revenue_amount || !formData.closed_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const revenue = parseFloat(formData.revenue_amount);
    if (isNaN(revenue) || revenue <= 0) {
      toast.error('Please enter a valid revenue amount');
      return;
    }

    const commissionRate = formData.commission_rate ? parseFloat(formData.commission_rate) : null;
    if (commissionRate !== null && (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100)) {
      toast.error('Commission rate must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      
      const dealData = {
        lead: lead.id,
        revenue_amount: revenue,
        currency: formData.currency,
        closed_date: formData.closed_date,
        commission_rate: commissionRate,
      };

      let response;
      if (isEdit) {
        response = await agentLeadsAPI.updateDeal(deal.id, dealData);
        toast.success('Deal updated successfully!');
      } else {
        response = await agentLeadsAPI.createDeal(dealData);
        toast.success('Revenue recorded successfully!');
      }

      onSuccess(response);
      onCancel();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error(error.response?.data?.detail || 'Failed to save revenue information');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiDollarSign className="mr-2" />
            {isEdit ? 'Edit Deal' : 'Record Revenue'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="revenue_amount"
                  value={formData.revenue_amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="AED">AED - UAE Dirham</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            {/* Closed Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Closed Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="closed_date"
                  value={formData.closed_date}
                  onChange={handleInputChange}
                  max={dayjs().format('YYYY-MM-DD')}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Commission Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPercent className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="commission_rate"
                  value={formData.commission_rate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Optional: Leave empty if not applicable</p>
            </div>
          </div>

          {/* Commission Calculation */}
          {commissionAmount !== null && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">Commission Calculation</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Commission Amount:</span>
                <span className="text-lg font-semibold text-green-600">
                  {commissionAmount.toFixed(2)} {formData.currency}
                </span>
              </div>
            </div>
          )}

          {/* Lead Information */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Lead Information</h4>
            <p className="text-sm text-gray-600">
              <strong>{lead?.name || lead?.email}</strong> ({lead?.email})
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Status: <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Converted
              </span>
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiDollarSign className="mr-2" />
                  {isEdit ? 'Update Deal' : 'Record Revenue'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevenueModal;
