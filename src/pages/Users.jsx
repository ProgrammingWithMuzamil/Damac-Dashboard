import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { usersAPI } from '../services/api.jsx';

const Users = () => {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
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
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password'
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'user', label: 'User' },
        { value: 'admin', label: 'Admin' }
      ]
    },
  ];

  return (
    <CRUDManager
      title="Users"
      api={usersAPI}
      columns={columns}
      formFields={formFields}
      icon="👥"
      emptyMessage="No users found"
    />
  );
};

export default Users;
