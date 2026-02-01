import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { slidesAPI } from '../services/api.jsx';

const Slides = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'img_url', 
      label: 'Image', 
      render: (value, row) => {
        const imageUrl = value || row.img;
        
        if (!imageUrl) {
          return (
            <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
          );
        }
        
        return (
          <img 
            src={imageUrl} 
            alt="Slide" 
            className="w-20 h-16 object-cover rounded" 
            onError={(e) => {
              console.error('Slide image failed to load:', imageUrl);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA4MCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNiAzMkMzOCAyMCA0NiAyMCA0NiAyMkM0NiAyNCAzOCAzNiAyNiAzMloiIGZpbGw9IiM5Q0EzQVYiLz4KPGNpcmNsZSBjeD0iMjYiIGN5PSIyMCIgcj0iMiIgZmlsbD0iIzlDQTNBViIvPgo8L3N2Zz4K';
            }}
            onLoad={() => {
              console.log('Slide image loaded successfully:', imageUrl);
            }}
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'location', label: 'Location' },
    { 
      key: 'points', 
      label: 'Points',
      render: (value) => {
        if (!value) return 'No Points';
        
        try {
          // Handle both string and array formats
          let pointsArray = [];
          if (typeof value === 'string') {
            pointsArray = JSON.parse(value);
          } else if (Array.isArray(value)) {
            pointsArray = value;
          }
          
          return pointsArray.length > 0 
            ? pointsArray.slice(0, 3).join(', ') + (pointsArray.length > 3 ? '...' : '')
            : 'No Points';
        } catch (e) {
          console.error('Error parsing points:', value, e);
          return String(value);
        }
      }
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
