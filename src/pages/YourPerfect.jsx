import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { yourperfectAPI } from '../services/api.jsx';

const YourPerfect = () => {
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
            alt="YourPerfect" 
            className="w-16 h-16 object-cover rounded" 
            style={{ display: 'block' }}
            crossOrigin="anonymous"
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'price', label: 'Price' },
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
      placeholder: 'Upload YourPerfect image'
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter YourPerfect title'
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
      required: true,
      placeholder: 'Enter price'
    },
  ];

  return (
    <CRUDManager
      title="YourPerfect"
      api={yourperfectAPI}
      columns={columns}
      formFields={formFields}
      icon="⭐"
      emptyMessage="No YourPerfect items found"
    />
  );
};

export default YourPerfect;
