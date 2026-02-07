import React, { useState, useEffect, memo } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEdit, FiTrash2, FiSearch, FiFilter, FiDollarSign } from 'react-icons/fi';
import { agentLeadsAPI } from '../services/modules';
import RevenueModal from '../components/RevenueModal';

const AgentLeads = () => {
  // DEBUG: Log to confirm single mount
  useEffect(() => {
    console.log("AGENT LEADS MOUNTED");
    return () => {
      console.log("AGENT LEADS UNMOUNTED");
    };
  }, []);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedRevenueLead, setSelectedRevenueLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [editingStatus, setEditingStatus] = useState('');

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    count: 0,
    next: null,
    previous: null,
  });

  // Refactored: Separate primitive states instead of object-based filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Debounced search state - also using separate primitives
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedStatus, setDebouncedStatus] = useState('');

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay for search

    return () => clearTimeout(timer);
  }, [search]);

  // Immediate update for status (no debounce needed)
  useEffect(() => {
    setDebouncedStatus(status);
  }, [status]);

  // SIMPLIFIED STATUS SYSTEM - Agent only sees these 3 statuses
  const statusOptions = [
    { value: 'new', label: 'New', color: 'blue' },
    { value: 'contacted', label: 'Contacted', color: 'yellow' },
    { value: 'in_progress', label: 'In Progress', color: 'orange' },
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
    fetchLeads();
  }, [debouncedSearch, debouncedStatus, pagination.page, pagination.pageSize]);

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
      setLoading(true);
      const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
      };
      if (debouncedStatus) params.status = debouncedStatus;
      if (debouncedSearch) params.search = debouncedSearch;

      const data = await agentLeadsAPI.getAll(params);
      setLeads(data.results || data);

      // Update pagination state
      setPagination(prev => ({
        ...prev,
        count: data.count || 0,
        next: data.next || null,
        previous: data.previous || null,
      }));
    } catch (error) {
      toast.error('Failed to fetch your leads');
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!editingLead) return;

    try {
      const updateData = {};

      // Only include status if it changed
      if (editingStatus !== editingLead.status) {
        updateData.status = editingStatus;
      }

      // Only include note if provided
      if (newNote.trim()) {
        updateData.activity_note = newNote.trim();
      }

      // Only make API call if there's something to update
      if (Object.keys(updateData).length > 0) {
        await agentLeadsAPI.update(editingLead.id, updateData);

        const updatedFields = [];
        if (updateData.status) updatedFields.push('status');
        if (updateData.activity_note) updatedFields.push('comment');

        toast.success(`Lead ${updatedFields.join(' and ')} updated successfully`);
      } else {
        toast.info('No changes to save');
      }

      setShowEditModal(false);
      setNewNote('');
      setEditingLead(null);
      setEditingStatus('');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead');
      console.error('Error updating lead:', error);
    }
  };

  const showLeadTimeline = (lead) => {
    setSelectedLead(lead);
    setShowTimelineModal(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setEditingStatus(lead.status);
    setNewNote('');
    setShowEditModal(true);
  };

  const handleRevenueModal = (lead) => {
    setSelectedRevenueLead(lead);
    setShowRevenueModal(true);
  };

  const handleRevenueSuccess = (deal) => {
    toast.success('Revenue recorded successfully!');
    fetchLeads(); // Refresh leads to show updated deal information
  };

  const isAdmin = () => {
    // Check if current user is admin (you might want to get this from context/auth state)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
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

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-orange-100 text-orange-800 border-orange-200',
      // Handle backend statuses but don't expose them in UI
      converted: 'bg-green-100 text-green-800 border-green-200',
      closed_lost: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status) => {
    // Only return labels for statuses agents should see
    const agentStatusMap = {
      'new': 'New',
      'contacted': 'Contacted',
      'in_progress': 'In Progress',
    };
    return agentStatusMap[status] || status;
  };

  const isLeadClosed = (status) => {
    return ['converted', 'closed_lost'].includes(status);
  };

  const getTrafficSourceLabel = (source) => {
    return trafficSourceOptions.find(option => option.value === source)?.label || source;
  };

  const getLastNote = (lead) => {
    if (lead.notes_history && lead.notes_history.length > 0) {
      return lead.notes_history[0]; // Most recent note first
    }
    return null;
  };

  const getAvailableStatuses = (currentStatus) => {
    // Agent status flow: new → contacted → in_progress
    const allowedTransitions = {
      'new': ['new', 'contacted'],
      'contacted': ['contacted', 'in_progress'],
      'in_progress': ['in_progress'], // Can't downgrade
      // Handle backend statuses but don't allow agents to change them
      'converted': ['converted'],
      'closed_lost': ['closed_lost'],
    };
    return statusOptions.filter(option =>
      allowedTransitions[currentStatus]?.includes(option.value)
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading your leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Leads</h1>
        <p className="text-gray-600">
          Manage your assigned leads and track their progress
        </p>
      </div>

      {/* Search and Filters */}
      <div
        className="bg-white rounded-lg shadow-md p-4 mb-6"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiSearch className="inline mr-2" />
              Search Leads
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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

          <div className="flex items-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatus('');
              }}
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
                  Last Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                {isAdmin() && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? "10" : "9"} className="px-6 py-4 text-center text-gray-500">
                    No leads found matching current filters.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const lastNote = getLastNote(lead);
                  const closed = isLeadClosed(lead.status);

                  return (
                    <tr key={lead.id} className={`hover:bg-gray-50 ${closed ? 'opacity-75' : ''}`}>
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
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {lastNote ? lastNote.note : 'No notes yet'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      {isAdmin() && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {lead.deal ? (
                              <div className="text-green-600 font-medium">
                                {lead.deal.revenue_amount} {lead.deal.currency}
                              </div>
                            ) : lead.status === 'converted' ? (
                              <button
                                onClick={() => handleRevenueModal(lead)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 text-xs font-medium"
                                title="Add Revenue"
                              >
                                <FiDollarSign className="w-4 h-4 inline mr-1" />
                                Add Revenue
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">Not converted</span>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* View Details */}
                          <button
                            onClick={() => showLeadTimeline(lead)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="View Details & Notes"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>

                          {/* Edit - Add Comment Only */}
                          {!closed && (
                            <button
                              onClick={() => handleEditLead(lead)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Add Comment"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Timeline Modal - Same as Admin */}
      {showTimelineModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
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
                  <div className="relative max-h-60 overflow-y-auto">
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

      {/* Edit Modal - Status + Comment for Agents */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Lead - {editingLead.name || editingLead.email}
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLead(null);
                    setNewNote('');
                    setEditingStatus('');
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getAvailableStatuses(editingLead.status).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {getStatusLabel(editingLead.status)}
                  </p>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your comment here (optional)..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingLead(null);
                    setNewNote('');
                    setEditingStatus('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      <RevenueModal
        visible={showRevenueModal}
        onCancel={() => {
          setShowRevenueModal(false);
          setSelectedRevenueLead(null);
        }}
        lead={selectedRevenueLead}
        onSuccess={handleRevenueSuccess}
      />
    </div>
  );
};

export default memo(AgentLeads);
