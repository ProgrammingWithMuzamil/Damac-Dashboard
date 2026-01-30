import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiImage,
  FiStar,
  FiCreditCard,
  FiGlobe,
  FiMenu,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/users', label: 'Users', icon: <FiUsers /> },
    { path: '/properties', label: 'Properties', icon: <FiHome /> },
    { path: '/collaborations', label: 'Collaborations', icon: <FiUsers /> },
    { path: '/slides', label: 'Slides', icon: <FiImage /> },
    { path: '/yourperfect', label: 'YourPerfect', icon: <FiStar /> },
    { path: '/sidebarcard', label: 'Sidebar Cards', icon: <FiCreditCard /> },
    { path: '/damac', label: 'DAMAC', icon: <FiHome /> },
    { path: '/empoweringcommunities', label: 'Empowering Communities', icon: <FiGlobe /> },
  ];

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
      `}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className={isExpanded ? 'block' : 'hidden lg:block'}>
              <h1 className="text-xl lg:text-2xl font-bold text-blue-400">DAMAC</h1>
              <p className="text-gray-400 text-xs lg:text-sm mt-1">Admin Panel</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:block p-1 hover:bg-gray-800 rounded"
            >
              {isExpanded ? <FiChevronLeft className="text-lg" /> : <FiChevronRight className="text-lg" />}
            </button>
          </div>
        </div>

        <nav className="mt-4 lg:mt-8">
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
                flex items-center px-2 lg:px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors
                ${location.pathname === item.path ? 'bg-gray-800 border-l-4 border-blue-500 text-white' : ''}
              `}
              title={!isExpanded && window.innerWidth >= 1024 ? item.label : ''}
            >
              <span className="text-xl lg:mr-3 flex-shrink-0">{item.icon}</span>
              <span className={`${isExpanded ? 'block' : 'hidden lg:block'} whitespace-nowrap`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 lg:p-6 border-t border-gray-800 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
          <div className="text-gray-400 text-xs lg:text-sm">
            <p>© 2026 Muzamil Developer</p>
            <p className="text-xs mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
