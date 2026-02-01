import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usersAPI, propertiesAPI, collaborationsAPI } from '../services/api.jsx';

const CRUDManager = ({ 
  title, 
  api, 
  columns, 
  formFields, 
  icon,
  emptyMessage = 'No data found'
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let submitData = formData;
      
      // Check if any field is a file upload and create FormData if needed
      const hasFileUpload = formFields.some(field => field.type === 'file' && formData[field.name]);
      
      if (hasFileUpload) {
        submitData = new FormData();
        
        // Add all form fields to FormData
        formFields.forEach((field) => {
          if (field.type === 'file') {
            if (formData[field.name] instanceof File) {
              submitData.append(field.name, formData[field.name]);
            }
          } else if (formData[field.name] !== undefined && formData[field.name] !== null) {
            submitData.append(field.name, formData[field.name]);
          }
        });
      }
      
      if (editingItem) {
        await api.update(editingItem.id, submitData);
        toast.success(`${title.slice(0, -1)} updated successfully!`);
      } else {
        await api.create(submitData);
        toast.success(`${title.slice(0, -1)} created successfully!`);
      }
      await fetchItems();
      setShowForm(false);
      setEditingItem(null);
      setFormData({});
    } catch (err) {
      const errorMessage = `Failed to save ${title.slice(0, -1).toLowerCase()}`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error saving item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Cannot delete: No ID found');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(id);
        toast.success(`${title.slice(0, -1)} deleted successfully!`);
        await fetchItems();
      } catch (err) {
        const errorMessage = `Failed to delete ${title.slice(0, -1).toLowerCase()}`;
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error deleting item:', err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">{icon}</span>
            {title}
          </h1>
          <p className="text-gray-600 mt-1">Manage {title.toLowerCase()}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          + Add New
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={field.placeholder}
                      required={field.required}
                      rows="3"
                    />
                  ) : field.type === 'file' ? (
                    <div>
                      <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.files[0] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        accept="image/*"
                        required={field.required && !editingItem}
                      />
                      {formData[field.name] && typeof formData[field.name] === 'object' && (
                        <p className="mt-2 text-sm text-gray-600">
                          Selected: {formData[field.name].name}
                        </p>
                      )}
                      {editingItem && formData[field.name] && typeof formData[field.name] === 'string' && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Current image:</p>
                          <img 
                            src={`http://localhost:3000${formData[field.name]}`} 
                            alt="Current" 
                            className="w-20 h-20 object-cover rounded mt-1"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-300px)]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-5">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs sm:max-w-none">
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </div>
                      </td>
                    ))}
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRUDManager;
