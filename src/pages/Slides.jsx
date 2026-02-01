import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { slidesAPI } from '../services/api.jsx';

const Slides = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'img_url', 
      label: 'Image', 
      render: (value) => {
        if (!value) {
          return (
            <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
          );
        }
        
        return (
          <img 
            src={value} 
            alt="Slide" 
            className="w-20 h-16 object-cover rounded" 
            style={{ display: 'block' }}
            crossOrigin="anonymous"
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'location', label: 'Location' },
    { 
      key: 'points', 
      label: 'Points',
      render: (value) => Array.isArray(value) ? value.join(', ') : value
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
      placeholder: 'Upload slide image'
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter slide title'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      placeholder: 'Enter location'
    },
    {
      name: 'points',
      label: 'Points',
      type: 'text',
      required: true,
      placeholder: 'Enter points separated by commas (e.g., Point 1, Point 2, Point 3)'
    },
  ];

  return (
    <CRUDManager
      title="Slides"
      api={slidesAPI}
      columns={columns}
      formFields={formFields}
      icon="🎠"
      emptyMessage="No slides found"
    />
  );
};

export default Slides;
