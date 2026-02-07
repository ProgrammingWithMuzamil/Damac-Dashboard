// src/pages/admin/Agents.jsx
import React from 'react';
import CRUDManager from '../components/CRUDManager';
import { agentsAPI } from '../services/modules';

const Agents = () => {
  const columns = [
    {
      key: 'full_name',
      label: 'Name',
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900">
            {item.first_name} {item.last_name}
          </div>
          <div className="text-sm text-gray-500">{item.username}</div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'title',
      label: 'Title',
      render: (v) => v || <span className="text-gray-400 italic">-</span>,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (v) => v || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${v === 'active'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
        >
          {v ? v.toUpperCase() : 'UNKNOWN'}
        </span>
      ),
    },
    {
      key: 'profile_visible',
      label: 'Visible',
      render: (v) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${v
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
        >
          {v ? 'YES' : 'NO'}
        </span>
      ),
    },

  ];

  const formFields = [
    // ── Personal Info ──
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'agent_johndoe',
      group: 'Personal Information',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'agent@example.com',
      group: 'Personal Information',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: '•••••••• (min 6 chars)',
      group: 'Personal Information',
      help: 'Leave blank when editing to keep current password',
    },

    // ── Profile Details ──
    {
      name: 'first_name',
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
      group: 'Profile Details',
    },
    {
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
      group: 'Profile Details',
    },
    {
      name: 'title',
      label: 'Professional Title',
      type: 'text',
      placeholder: 'Senior Property Consultant',
      group: 'Profile Details',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      placeholder: '+92 300 1234567',
      group: 'Profile Details',
    },
    {
      name: 'bio',
      label: 'Bio / About',
      type: 'textarea',
      rows: 5,
      placeholder: 'Experienced real estate professional with 10+ years...',
      group: 'Profile Details',
    },

    // ── Visibility & Status ──
    {
      name: 'status',
      label: 'Account Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
      defaultValue: 'active',
      group: 'Visibility & Status',
    },
    {
      name: 'profile_visible',
      label: 'Show on Public Website',
      type: 'toggle',
      defaultValue: true,
      group: 'Visibility & Status',
      help: 'Controls whether this agent appears in public listings',
    },

    // ── Photo ──
    {
      name: 'photo',
      label: 'Profile Photo',
      type: 'file',
      accept: 'image/*',
      group: 'Photo',
      help: 'Recommended: 400×400 px, JPG/PNG, max 5MB',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <CRUDManager
          title="Agents"
          api={agentsAPI}
          columns={columns}
          formFields={formFields}
          icon="👤"
          emptyMessage="No agents found. Add your first agent to get started."
        />
      </div>
    </div>
  );
};

export default Agents;