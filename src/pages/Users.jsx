// src/pages/admin/Users.jsx
import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { usersAPI } from '../services/modules';

const Users = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: value => (
        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${value === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
          {value?.toUpperCase() || 'USER'}
        </span>
      )
    }
  ];

  const formFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'user@example.com'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Minimum 6 characters'
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'agent', label: 'Agent' }
      ]
    },
  ];

  return (
    <CRUDManager
      title="Users"
      api={usersAPI}
      columns={columns}
      formFields={formFields}
      icon="👤"
      emptyMessage="No users found. Add your first user to get started."
    />
  );
};

export default Users;