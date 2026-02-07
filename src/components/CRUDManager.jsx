// src/components/CRUDManager.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiUpload,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiChevronRight,
  FiDatabase,
  FiAlertCircle,
  FiCheckCircle,
  FiUser,
  FiHome,
  FiUsers,
  FiBriefcase,
  FiImage,
  FiCalendar,
  FiClock
} from 'react-icons/fi';

const CRUDManager = ({
  title,
  api,
  columns,
  formFields,
  icon = <FiDatabase className="w-8 h-8" />,
  emptyMessage = `No ${title.toLowerCase()} found`,
  apiModule,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  // Determine which API to use
  const currentApi = api || (apiModule && {
    users: usersAPI,
    properties: propertiesAPI,
    collaborations: collaborationsAPI,
    agents: agentsAPI,
  }[apiModule]);

  useEffect(() => {
    if (currentApi) fetchItems();
  }, []);

  const fetchItems = async () => {
    if (!currentApi) return;

    try {
      setLoading(true);
      setError(null);
      const response = await currentApi.getAll();
      const data = response.results || response.data || response || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
      toast.error('Could not fetch records');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    formFields.forEach(field => {
      if (field.required && !formData[field.name] && formData[field.name] !== 0) {
        errors[field.name] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
        errors[field.name] = 'Invalid email format';
      }
      if (field.type === 'password' && formData[field.name] && formData[field.name].length < 6) {
        errors[field.name] = 'Password must be at least 6 characters';
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let submitData;

      // Check if we have files → use FormData
      const hasFile = formFields.some(f => f.type === 'file' && formData[f.name] instanceof File);
      const hasFileString = formFields.some(f => f.type === 'file' && formData[f.name] && typeof formData[f.name] === 'string');

      if (hasFile) {
        submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            submitData.append(key, value);
          } else if (Array.isArray(value)) {
            submitData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            submitData.append(key, value);
          }
        });
      } else if (hasFileString) {
        // For editing with existing image files
        submitData = { ...formData };
        // Remove base URL from image paths if they exist
        Object.keys(formData).forEach(key => {
          if (typeof formData[key] === 'string' && formData[key].includes('http://localhost:8000')) {
            submitData[key] = formData[key].replace('http://localhost:8000', '');
          }
        });
      } else {
        submitData = { ...formData };
        // Handle special cases (e.g. points as array)
        if (formData.points && typeof formData.points === 'string') {
          submitData.points = formData.points.split(',').map(p => p.trim()).filter(Boolean);
        }
      }

      if (editingItem?.id) {
        await currentApi.update(editingItem.id, submitData);
        toast.success(`${title.slice(0, -1)} updated successfully`, {
          icon: <FiCheckCircle className="text-green-500" />
        });
      } else {
        await currentApi.create(submitData);
        toast.success(`${title.slice(0, -1)} created successfully`, {
          icon: <FiCheckCircle className="text-green-500" />
        });
      }

      await fetchItems();
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
      setFormErrors({});
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Operation failed';
      toast.error(msg, {
        icon: <FiAlertCircle className="text-red-500" />
      });
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item); // Debug log
    setEditingItem(item);

    // Prepare form data - convert arrays/objects if needed
    const initialData = { ...item };

    // Handle image fields - use the correct field names
    formFields.forEach(field => {
      if (field.type === 'file') {
        // Check for different possible field names
        if (item[`${field.name}_url`]) {
          initialData[field.name] = item[`${field.name}_url`];
        } else if (item[field.name] && typeof item[field.name] === 'string') {
          // If it's already a string URL, use it directly
          initialData[field.name] = item[field.name];
        }
      }

      if (field.type === 'select' && field.multiple && typeof item[field.name] === 'string') {
        initialData[field.name] = item[field.name].split(',');
      }
    });

    console.log('Form data prepared:', initialData); // Debug log
    setFormData(initialData);
    setShowForm(true);
  };

  const handleDelete = (item) => {
    const itemName = item.name || item.title || item.username || `${title.slice(0, -1).toLowerCase()} #${item.id}`;
    setDeleteModal({
      isOpen: true,
      itemId: item.id,
      itemName: itemName
    });
  };

  const confirmDelete = async () => {
    try {
      await currentApi.delete(deleteModal.itemId);
      toast.success(`${title.slice(0, -1)} deleted successfully`);
      fetchItems();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemName: '' });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
    setFormErrors({});
  };

  // Helper function to normalize image URLs
  const normalizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return url;

    // If URL already has protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If it's a relative path, add base URL
    if (url.startsWith('/')) {
      return `http://localhost:8000${url}`;
    }

    return url;
  };

  // Helper function to format date
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';

    console.log('Formatting date:', dateString); // Debug log

    // Try multiple date parsing strategies
    let date;

    // Strategy 1: Direct parse
    date = new Date(dateString);

    // Strategy 2: If that fails, try removing milliseconds
    if (isNaN(date.getTime()) && typeof dateString === 'string') {
      const cleaned = dateString.split('.')[0] + 'Z'; // Remove milliseconds
      date = new Date(cleaned);
    }

    // Strategy 3: If still fails, try as timestamp
    if (isNaN(date.getTime()) && typeof dateString === 'string') {
      const timestamp = Date.parse(dateString);
      if (!isNaN(timestamp)) {
        date = new Date(timestamp);
      }
    }

    if (isNaN(date.getTime())) {
      console.error('Could not parse date:', dateString);
      // Return a formatted version of the raw string
      return dateString ? String(dateString).substring(0, 16) : '—';
    }

    // Format the valid date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderField = (field) => {
    const value = formData[field.name] ?? '';
    const error = formErrors[field.name];

    const baseInputClasses = `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
      }`;

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={e => setFormData(d => ({ ...d, [field.name]: e.target.value }))}
          className={baseInputClasses}
          required={field.required}
        >
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'file') {
      return (
        <div className="space-y-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition">
            <FiUpload className="w-5 h-5" />
            <span>{editingItem ? 'Change' : 'Upload'} {field.label}</span>
            <input
              type="file"
              accept={field.accept || 'image/*'}
              onChange={e => {
                const file = e.target.files[0];
                if (file) setFormData(d => ({ ...d, [field.name]: file }));
              }}
              className="hidden"
            />
          </label>

          {value && (typeof value === 'string' ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={normalizeImageUrl(value)}
                alt="preview"
                className="w-16 h-16 object-cover rounded-lg border"
                onError={(e) => {
                  console.error('Failed to load image:', value);
                  e.target.style.display = 'none';
                  // Show placeholder instead
                  e.target.parentElement.innerHTML = `
                    <div class="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <FiImage class="w-8 h-8 text-gray-400" />
                    </div>
                  `;
                }}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Current {field.label.toLowerCase()}</p>
                <button
                  type="button"
                  onClick={() => setFormData(d => ({ ...d, [field.name]: null }))}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 mt-1"
                >
                  <FiX className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          ) : value instanceof File ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUpload className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-sm text-blue-700 block truncate max-w-[200px]">{value.name}</span>
                  <span className="text-xs text-gray-500">{(value.size / 1024).toFixed(2)} KB</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(d => ({ ...d, [field.name]: null }))}
                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          ) : null)}
          {error && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><FiAlertCircle /> {error}</p>}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={e => setFormData(d => ({ ...d, [field.name]: e.target.value }))}
          className={`${baseInputClasses} min-h-[100px] resize-y`}
          placeholder={field.placeholder}
          required={field.required}
          rows="4"
        />
      );
    }

    return (
      <input
        type={field.type || 'text'}
        value={value}
        onChange={e => setFormData(d => ({ ...d, [field.name]: e.target.value }))}
        className={baseInputClasses}
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  };

  const getIconForModule = () => {
    const iconMap = {
      users: <FiUser className="w-8 h-8 text-blue-600" />,
      properties: <FiHome className="w-8 h-8 text-green-600" />,
      collaborations: <FiUsers className="w-8 h-8 text-purple-600" />,
      agents: <FiBriefcase className="w-8 h-8 text-orange-600" />,
    };
    return iconMap[apiModule] || icon;
  };

  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    return columns.some(col => {
      const value = item[col.key];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              {getIconForModule()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">Manage your {title.toLowerCase()} efficiently</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <button
              onClick={fetchItems}
              disabled={loading}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({});
                setFormErrors({});
                setShowForm(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-sm transition flex items-center justify-center gap-2 font-medium"
            >
              <FiPlus className="w-5 h-5" />
              Add New
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{items.length}</p>
              </div>
              <FiDatabase className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtered</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredItems.length}</p>
              </div>
              <FiFilter className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">Active</p>
              </div>
              <FiCheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? (
                  <div className="flex items-center gap-2">
                    <FiEdit2 className="w-6 h-6 text-blue-600" />
                    Edit {title.slice(0, -1)}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <FiPlus className="w-6 h-6 text-green-600" />
                    Create New {title.slice(0, -1)}
                  </div>
                )}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map(field => (
                  <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                    {formErrors[field.name] && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <FiAlertCircle className="w-4 h-4" /> {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <FiX className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition shadow-sm flex items-center justify-center gap-2 font-medium"
                >
                  {editingItem ? (
                    <>
                      <FiCheckCircle className="w-5 h-5" /> Update
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5" /> Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow border p-12 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading {title.toLowerCase()}...</p>
        </div>
      ) : error ? (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-red-800 mb-3">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchItems}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow border p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mb-6">
            {getIconForModule()}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">{searchTerm ? 'No results found' : emptyMessage}</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm
              ? 'Try adjusting your search terms'
              : `Get started by adding your first ${title.toLowerCase().replace('s', '')}.`
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setShowForm(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm flex items-center gap-2 mx-auto"
          >
            <FiPlus className="w-5 h-5" /> Add New
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-blue-50 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-sm text-gray-900 align-middle">
                        {col.render ? (
                          col.render(item[col.key], item)
                        ) : col.key.includes('_at') || col.key === 'created_at' || col.key === 'updated_at' ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <FiCalendar className="w-3 h-3" />
                            {formatDate(item[col.key])}
                          </div>
                        ) : col.key.includes('img') || col.key.includes('logo') || col.key.includes('image') || col.key.includes('avatar') ? (
                          item[col.key] ? (
                            <div className="flex items-center justify-center">
                              <img
                                src={normalizeImageUrl(item[col.key])}
                                alt={col.label}
                                className="w-10 h-10 object-cover rounded-lg border"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-10 h-10 bg-gray-100 rounded-lg border flex items-center justify-center">
                                      <FiImage class="w-5 h-5 text-gray-400" />
                                    </div>
                                  `;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg border flex items-center justify-center">
                              <FiImage className="w-5 h-5 text-gray-400" />
                            </div>
                          )
                        ) : col.key === 'description' || col.key === 'desc' || col.key === 'bio' ? (
                          <div className="max-w-xs">
                            <p className="truncate" title={item[col.key]}>
                              {item[col.key] || '—'}
                            </p>
                          </div>
                        ) : (
                          <div className="max-w-xs truncate" title={String(item[col.key] || '—')}>
                            {item[col.key] ?? '—'}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-all border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {columns.slice(0, 2).map(col => (
                      <div key={col.key} className="mb-2">
                        <span className="text-xs font-medium text-gray-500">{col.label}</span>
                        <div className="font-medium text-gray-900 mt-1">
                          {col.render ? col.render(item[col.key], item) : (
                            col.key.includes('img') || col.key.includes('logo') || col.key.includes('image') ? (
                              item[col.key] ? (
                                <img
                                  src={normalizeImageUrl(item[col.key])}
                                  alt={col.label}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                      <div class="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                                        <FiImage class="w-6 h-6 text-gray-400" />
                                      </div>
                                    `;
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                                  <FiImage className="w-6 h-6 text-gray-400" />
                                </div>
                              )
                            ) : col.key.includes('_at') || col.key === 'created_at' || col.key === 'updated_at' ? (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FiCalendar className="w-3 h-3" />
                                {formatDate(item[col.key])}
                              </div>
                            ) : (
                              item[col.key] ?? '—'
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rest of fields */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  {columns.slice(2).map(col => (
                    <div key={col.key} className="space-y-1">
                      <div className="text-xs font-medium text-gray-500">{col.label}</div>
                      <div className="text-sm text-gray-900">
                        {col.render ? col.render(item[col.key], item) : (
                          col.key.includes('_at') || col.key === 'created_at' || col.key === 'updated_at' ? (
                            <div className="flex items-center gap-1 text-gray-600">
                              <FiCalendar className="w-3 h-3" />
                              {formatDate(item[col.key])}
                            </div>
                          ) : (
                            <div className="truncate" title={String(item[col.key] || '—')}>
                              {item[col.key] ?? '—'}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination/Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredItems.length}</span> of{' '}
              <span className="font-semibold">{items.length}</span> records
            </div>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Previous
              </button>
              <span className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg">1</span>
              <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName={deleteModal.itemName}
        itemType={title.slice(0, -1).toLowerCase()}
      />
    </div>
  );
};

export default CRUDManager;