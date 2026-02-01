import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { sidebarcardAPI } from '../services/api.jsx';

const SidebarCard = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'img_url', 
      label: 'Image', 
      render: (value) => {
        if (!value) {
          return (
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
          );
        }
        
        return (
          <img 
            src={value} 
            alt="SidebarCard" 
            className="w-16 h-16 object-cover rounded" 
            style={{ display: 'block' }}
            crossOrigin="anonymous"
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { 
      key: 'desc', 
      label: 'Description', 
      render: (value) => value ? value.substring(0, 100) + '...' : 'No Description'
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'updatedAt', 
      label: 'Updated At',
      render: (value) => new Date(value).toLocaleDateString()
    },
  ];

  const formFields = [
    {
      name: 'img',
      label: 'Image',
      type: 'file',
      required: true,
      placeholder: 'Upload sidebar card image'
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter sidebar card title'
    },
    {
      name: 'desc',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Enter sidebar card description'
    },
  ];

  return (
    <CRUDManager
      title="SidebarCard"
      api={sidebarcardAPI}
      columns={columns}
      formFields={formFields}
      icon="🎴"
      emptyMessage="No sidebar cards found"
    />
  );
};

export default SidebarCard;
