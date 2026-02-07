import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { propertiesAPI } from '../services/modules';

const Properties = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'img_url',
      label: 'Image',
      render: (value, row) => {
        // Try img_url first, then fallback to img field
        const imageUrl = value || row.img;

        if (!imageUrl) {
          return (
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
          );
        }

        return (
          <img
            src={imageUrl}
            alt="Property"
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSAzMkMzMiAyMSA0MSAyMSA0MSAyM0M0MSAyNSAzMiAzNiAyMSAzMloiIGZpbGw9IiM5Q0EzQVYiLz4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMiIgZmlsbD0iIzlDQTNBViIvPgo8L3N2Zz4K';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
            }}
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'location', label: 'Location' },
    { key: 'price', label: 'Price' },
    // { 
    //   key: 'createdAt', 
    //   label: 'Created At',
    //   render: (value) => new Date(value).toLocaleDateString()
    // },
    // { 
    //   key: 'updatedAt', 
    //   label: 'Updated At',
    //   render: (value) => new Date(value).toLocaleDateString()
    // },
  ];

  const formFields = [
    {
      name: 'img',
      label: 'Image',
      type: 'file',
      required: true,
      placeholder: 'Upload property image'
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter property title'
    },
    {
      name: 'location',
      label: 'Location',
      type: 'text',
      required: true,
      placeholder: 'Enter location'
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
      title="Properties"
      api={propertiesAPI}
      columns={columns}
      formFields={formFields}
      icon="🏠"
      emptyMessage="No properties found"
    />
  );
};

export default Properties;
