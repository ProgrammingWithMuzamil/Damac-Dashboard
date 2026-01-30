import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { collaborationsAPI } from '../services/api.jsx';

const Collaborations = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'img', 
      label: 'Image', 
      render: (value) => {
        if (!value) {
          return (
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
          );
        }
        
        // The backend now returns full URLs, so we don't need to construct them
        const imageUrl = value;
        
        return (
          <img 
            src={imageUrl} 
            alt="Collaboration" 
            className="w-16 h-16 object-cover rounded" 
            style={{ display: 'block' }}
            crossOrigin="anonymous"
          />
        );
      }
    },
    { 
      key: 'logo', 
      label: 'Logo', 
      render: (value) => {
        if (!value) {
          return (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Logo
            </div>
          );
        }
        
        // The backend now returns full URLs, so we don't need to construct them
        const imageUrl = value;
        
        return (
          <img 
            src={imageUrl} 
            alt="Logo" 
            className="w-12 h-12 object-cover rounded" 
            style={{ display: 'block' }}
            crossOrigin="anonymous"
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'desc', label: 'Description', render: (value) => value ? value.substring(0, 100) + '...' : 'No Description' },
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
      placeholder: 'Upload collaboration image'
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'file',
      required: true,
      placeholder: 'Upload collaboration logo'
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter collaboration title'
    },
    {
      name: 'desc',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Enter collaboration description'
    },
  ];

  return (
    <CRUDManager
      title="Collaborations"
      api={collaborationsAPI}
      columns={columns}
      formFields={formFields}
      icon="🤝"
      emptyMessage="No collaborations found"
    />
  );
};

export default Collaborations;
