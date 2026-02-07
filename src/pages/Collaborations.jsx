import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { collaborationsAPI } from '../services/modules';

const Collaborations = () => {
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
            alt="Collaboration"
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              console.error('Collaboration image failed to load:', imageUrl);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSAzMkMzMiAyMSA0MSAyMSA0MSAyM0M0MSAyNSAzMiAzNiAyMSAzMloiIGZpbGw9IiM5Q0EzQVYiLz4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMiIgZmlsbD0iIzlDQTNBViIvPgo8L3N2Zz4K';
            }}
            onLoad={() => {
              console.log('Collaboration image loaded successfully:', imageUrl);
            }}
          />
        );
      }
    },
    {
      key: 'logo_url',
      label: 'Logo',
      render: (value, row) => {
        const logoUrl = value || row.logo;

        if (!logoUrl) {
          return (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
              No Logo
            </div>
          );
        }

        return (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-12 h-12 object-cover rounded"
            onError={(e) => {
              console.error('Logo failed to load:', logoUrl);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyNEMyNCAxNiAzMiAxNiAzMiAxOEMzMiAyMCAyNCAyOCAxNiAyNFoiIGZpbGw9IiM5Q0EzQVYiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMS41IiBmaWxsPSIjOUNBM0FWIi8+Cjwvc3ZnPgo=';
            }}
            onLoad={() => {
              console.log('Logo loaded successfully:', logoUrl);
            }}
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
    { key: 'desc', label: 'Description', render: (value) => value ? value.substring(0, 100) + '...' : 'No Description' },
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
