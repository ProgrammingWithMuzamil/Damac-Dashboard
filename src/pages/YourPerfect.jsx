import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { yourperfectAPI } from '../services/modules';

const YourPerfect = () => {
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
            alt="YourPerfect"
            className="w-16 h-16 object-cover rounded"
            onError={(e) => {
              console.error('YourPerfect image failed to load:', imageUrl);
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMSAzMkMzMiAyMSA0MSAyMSA0MSAyM0M0MSAyNSAzMiAzNiAyMSAzMloiIGZpbGw9IiM5Q0EzQVYiLz4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMiIgZmlsbD0iIzlDQTNBViIvPgo8L3N2Zz4K';
            }}
            onLoad={() => {
              console.log('YourPerfect image loaded successfully:', imageUrl);
            }}
          />
        );
      }
    },
    { key: 'title', label: 'Title' },
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
  ]; Recommended

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
