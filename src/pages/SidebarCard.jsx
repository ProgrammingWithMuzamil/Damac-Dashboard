import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { sidebarcardAPI } from '../services/modules';

const SidebarCard = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'img_url',
      label: 'Image',
      render: (value, row) => {
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
            alt="SidebarCard"
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              console.error('SidebarCard image failed to load:', imageUrl);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSAzMkMzMiAyMSA0MSAyMSA0MSAyM0M0MSAyNSAzMiAzNiAyMSAzMloiIGZpbGw9IiM5Q0EzQVYiLz4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMiIgZmlsbD0iIzlDQTNBViIvPgo8L3N2Zz4K';
            }}
            onLoad={() => {
              console.log('SidebarCard image loaded successfully:', imageUrl);
            }}
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
