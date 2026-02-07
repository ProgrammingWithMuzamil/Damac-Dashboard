import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import { leadsAPI } from '../services/modules';
import { agentsAPI } from '../services/modules';
import { useSelector } from 'react-redux';
import { selectToken, selectIsAuthenticated } from '../store/authSlice';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Leads = () => {
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    count: 0,
    next: null,
    previous: null,
  });

  const [filters, setFilters] = useState({
    status: '',
    agent: '',
    search: '',
    traffic_source: '',
    // utm_campaign: '',
  });

  // SIMPLIFIED STATUS SYSTEM - Admin sees these 4 statuses
  const statusOptions = [
    { value: 'new', label: 'New', color: 'blue' },
    { value: 'contacted', label: 'Contacted', color: 'yellow' },
    { value: 'in_progress', label: 'In Progress', color: 'orange' },
    { value: 'closed', label: 'Closed', color: 'gray' },
  ];

  const trafficSourceOptions = [
    { value: 'organic', label: 'Organic' },
    { value: 'ads', label: 'Advertisement' },
    { value: 'campaign', label: 'Marketing Campaign' },
    { value: 'referral', label: 'Referral' },
    { value: 'social', label: 'Social Media' },
    { value: 'direct', label: 'Direct' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    // CRITICAL: Only fetch data if we have a valid token AND user is authenticated
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchLeads();
    fetchAgents();
  }, [filters, pagination.page, pagination.pageSize, token, isAuthenticated]);

  // Block Enter key globally on this page to prevent any form submission
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        // Check if the event target is an input, textarea, or select
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          // Only block Enter if it's not a textarea with multiple lines
          if (target.tagName !== 'TEXTAREA' || !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchLeads = async () => {
    try {
      // CRITICAL: Double-check token before making any API calls
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
      };
      if (filters.status) params.status = filters.status;
      if (filters.agent) params.agent = filters.agent;
      if (filters.search) params.search = filters.search;

      const data = await leadsAPI.getAll(params);
      setLeads(data.results || data);

      // Update pagination state
      setPagination(prev => ({
        ...prev,
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
      }));
    } catch (error) {
      toast.error('Failed to fetch leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      // CRITICAL: Double-check token before making any API calls
      if (!token) {
        return;
      }

      const data = await agentsAPI.getAll();
      setAgents(data.results || data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleAssignAgent = async (leadId, agentId) => {
    try {
      await leadsAPI.update(leadId, { assigned_agent: agentId });
      toast.success('Lead assigned successfully');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to assign lead');
      console.error('Error assigning lead:', error);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await leadsAPI.update(leadId, { status: newStatus });
      toast.success('Lead status updated successfully');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead status');
      console.error('Error updating lead status:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200',
      // Handle backend statuses but don't expose them in UI
      converted: 'bg-gray-100 text-gray-800 border-gray-200',
      closed_lost: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status) => {
    // Map backend statuses to simplified labels
    const statusMap = {
      'new': 'New',
      'contacted': 'Contacted',
      'in_progress': 'In Progress',
      'closed': 'Closed',
      // Handle backend statuses
      'converted': 'Closed',
      'closed_lost': 'Closed',
    };
    return statusMap[status] || status;
  };

  const getTrafficSourceLabel = (source) => {
    return trafficSourceOptions.find(option => option.value === source)?.label || source;
  };

  const showLeadTimeline = (lead) => {
    setSelectedLead(lead);
    setShowTimelineModal(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  const handleDeleteLead = (lead) => {
    const itemName = lead.name || lead.email || `Lead #${lead.id}`;
    setDeleteModal({
      isOpen: true,
      itemId: lead.id,
      itemName: itemName
    });
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  };

  const handleUpdateLead = async () => {
    if (!editingLead) return;

    try {
      await leadsAPI.update(editingLead.id, editingLead);
      toast.success('Lead updated successfully');
      setShowEditModal(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead');
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.itemId) return;

    try {
      await leadsAPI.delete(deleteModal.itemId);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to delete lead');
      console.error('Error deleting lead:', error);
    } finally {
      setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
  };

  const getPageNumbers = () => {
    const totalPages = Math.ceil(pagination.count / pagination.pageSize);
    const current = pagination.page;
    const delta = 2; // Show 2 pages before and after current

    let start = Math.max(1, current - delta);
    let end = Math.min(totalPages, current + delta);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return { pages, start, end, totalPages };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management</h1>
        <p className="text-gray-600">
          Manage all leads, assignments, and track progress
        </p>
      </div>

      {/* Filters and Search */}
      <div
        className="bg-white rounded-lg shadow-md p-4 mb-6"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              placeholder="Search by name, email, or phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFilter className="inline mr-2" />
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traffic Source
            </label>
            <select
              value={filters.traffic_source}
              onChange={(e) => setFilters({ ...filters, traffic_source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sources</option>
              {trafficSourceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UTM Campaign
            </label>
            <input
              type="text"
              value={filters.utm_campaign}
              onChange={(e) => setFilters({ ...filters, utm_campaign: e.target.value })}
              placeholder="Filter by UTM campaign..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Filter
            </label>
            <select
              value={filters.agent}
              onChange={(e) => setFilters({ ...filters, agent: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Agents</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.username} ({agent.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="button"
              onClick={() => setFilters({ status: '', agent: '', search: '', traffic_source: '' })}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear
            </button>
            <select
              value={pagination.pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {((pagination.page - 1) * pagination.pageSize) + 1}-{Math.min(pagination.page * pagination.pageSize, pagination.count)} of {pagination.count} leads
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Sticky Header */}
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traffic Source
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UTM Campaign
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                    No leads found matching current filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name || lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.assigned_agent_name || 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${lead.traffic_source === 'organic' ? 'bg-green-100 text-green-800 border-green-200' :
                        lead.traffic_source === 'ads' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          lead.traffic_source === 'campaign' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            lead.traffic_source === 'referral' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              lead.traffic_source === 'social' ? 'bg-pink-100 text-pink-800 border-pink-200' :
                                lead.traffic_source === 'direct' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                        {lead.traffic_source || 'organic'}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.utm_campaign || '-'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* View Timeline */}
                        <button
                          onClick={() => showLeadTimeline(lead)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="View Timeline"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Edit Lead"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Delete Lead"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.count > pagination.pageSize && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={!pagination.previous}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                « First
              </button>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.previous}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹ Prev
              </button>
            </div>

            <div className="flex items-center space-x-1">
              {getPageNumbers().pages.map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm border rounded-md ${pageNum === pagination.page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.next}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next ›
              </button>
              <button
                onClick={() => handlePageChange(getPageNumbers().totalPages)}
                disabled={!pagination.next}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Last »
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {showTimelineModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium text-gray-900">
                  Activity Timeline - {selectedLead.name || selectedLead.email}
                </h3>
                <button
                  onClick={() => {
                    setShowTimelineModal(false);
                    setSelectedLead(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Lead Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-600">{selectedLead.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeClass(selectedLead.status)}`}>
                      {getStatusLabel(selectedLead.status)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Agent:</span>
                    <span className="ml-2 text-gray-600">{selectedLead.assigned_agent_name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Activity History</h4>
                {selectedLead.notes_history && selectedLead.notes_history.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    {selectedLead.notes_history.map((note, index) => (
                      <div key={note.id} className="relative flex items-start mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div className="ml-4 bg-white border border-gray-200 rounded-lg p-4 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-gray-900">{note.user_name}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-700">{note.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No activity recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Lead - {editingLead.name || editingLead.email}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLead(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Agent</label>
                  <select
                    value={editingLead.assigned_agent || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, assigned_agent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.username} ({agent.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLead(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateLead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={cancelDelete}
        itemName={deleteModal.itemName}
        itemType="lead"
      />

      {/* Help Section */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-purple-800 mb-2">
          ℹ️ Admin Lead Management
        </h4>
        <ul className="text-sm text-purple-600 space-y-1">
          <li>• Monitor all leads and agent activities in table view</li>
          <li>• Use search and filters to find specific leads</li>
          <li>• View complete activity timeline for each lead</li>
          <li>• Edit lead details and manage assignments</li>
          <li>• Delete leads with confirmation</li>
        </ul>
      </div>
    </div>
  );
};

export default Leads;
