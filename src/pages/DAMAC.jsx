import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { damacAPI } from '../services/api.jsx';

const DAMAC = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'video', 
      label: 'Video Link',
      render: (value) => {
        if (!value) return 'No Video';
        
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {value.length > 50 ? value.substring(0, 50) + '...' : value}
          </a>
        );
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
      name: 'video',
      label: 'Video Link',
      type: 'text',
      required: true,
      placeholder: 'Enter video URL (e.g., https://www.youtube.com/watch?v=...)'
    },
  ];

  return (
    <CRUDManager
      title="DAMAC"
      api={damacAPI}
      columns={columns}
      formFields={formFields}
      icon="🏢"
      emptyMessage="No DAMAC videos found"
    />
  );
};

export default DAMAC;
