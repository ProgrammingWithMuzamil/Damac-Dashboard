import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiImage,
  FiStar,
  FiCreditCard,
  FiGlobe,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiCalendar,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiUser
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAdmin, isAgent } = useAuth();

  // Admin menu items
  const adminMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/users', label: 'Users', icon: <FiUsers /> },
    { path: '/agents', label: 'Agents', icon: <FiUsers /> },
    { path: '/leads', label: 'Leads', icon: <FiTrendingUp /> },
    { path: '/hero', label: 'Hero', icon: <FiImage /> },
    // { path: '/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
    { path: '/profile', label: 'Profile', icon: <FiUser /> },
    { path: '/properties', label: 'Properties', icon: <FiHome /> },
    { path: '/collaborations', label: 'Collaborations', icon: <FiUsers /> },
    { path: '/slides', label: 'Slides', icon: <FiImage /> },
    { path: '/yourperfect', label: 'YourPerfect', icon: <FiStar /> },
    { path: '/sidebarcard', label: 'Sidebar Cards', icon: <FiCreditCard /> },
    { path: '/damac', label: 'iLand', icon: <FiHome /> },
    { path: '/empoweringcommunities', label: 'Empowering Communities', icon: <FiGlobe /> },
    { path: '/cms-settings', label: 'CMS Settings', icon: <FiSettings /> },
  ];

  // Agent menu items (placeholder for future features)
  const agentMenuItems = [
    { path: '/agent', label: 'Dashboard', icon: <FiHome /> },
    { path: '/agent/leads', label: 'My Leads', icon: <FiTrendingUp /> },
    { path: '/agent/profile', label: 'Profile', icon: <FiUser /> },
    // { path: '/agent/properties', label: 'My Properties', icon: <FiHome /> },
    // { path: '/agent/appointments', label: 'Appointments', icon: <FiCalendar /> },
    // { path: '/agent/documents', label: 'Documents', icon: <FiFileText /> },
    // { path: '/agent/reports', label: 'Reports', icon: <FiBarChart2 /> },
  ];

  // Choose menu based on user role
  const menuItems = isAdmin ? adminMenuItems : agentMenuItems;
  const panelTitle = isAdmin ? 'Admin Panel' : 'Agent Portal';
  const panelSubtitle = isAdmin ? 'Management System' : 'Lead Management';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-20
        ${isExpanded ? 'w-64' : 'w-16 lg:w-64'}
        flex flex-col
      `}>
        {/* Fixed Header - Always at Top */}
        <div className="p-4 lg:p-6 flex-shrink-0 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className={isExpanded ? 'block' : 'hidden lg:block'}>
              <h1 className="text-xl lg:text-2xl font-bold text-blue-400">iLand</h1>
              <p className="text-gray-400 text-xs lg:text-sm mt-1">{panelTitle}</p>
              <p className="text-gray-500 text-xs lg:text-xs mt-1">{panelSubtitle}</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:block p-1 hover:bg-gray-800 rounded"
            >
              {isExpanded ? <FiChevronLeft className="text-lg" /> : <FiChevronRight className="text-lg" />}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Area - Middle Section Only */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="px-2 lg:px-6 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsExpanded(false);
                  }
                }}
                className={`
                  flex items-center px-2 lg:px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg mb-1
                  ${location.pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500 text-white' : ''}
                `}
                title={!isExpanded && window.innerWidth >= 1024 ? item.label : ''}
              >
                <span className="text-xl lg:mr-3 flex-shrink-0">{item.icon}</span>
                <span className={`${isExpanded ? 'block' : 'hidden lg:block'} whitespace-nowrap overflow-hidden text-ellipsis`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Fixed Footer - Always at Bottom */}
        <div className={`p-4 lg:p-6 border-t border-gray-800 flex-shrink-0 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
          <div className="text-gray-400 text-xs lg:text-sm">
            <p>© 2026 Muzamil Developer</p>
            <p className="text-xs mt-1">Version 1.0.0</p>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs">
                Role: <span className="text-blue-400 font-semibold">{isAdmin ? 'Admin' : isAgent ? 'Agent' : 'Unknown'}</span>
              </p>
              {user?.email && (
                <p className="text-xs mt-1 truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
