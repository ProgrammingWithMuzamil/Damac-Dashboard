import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext.jsx';
import LogoutConfirmModal from './LogoutConfirmModal.jsx';

const Layout = () => {
  const { user, logout, showLogoutModal, confirmLogout, cancelLogout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-16 lg:ml-64 min-w-0 transition-all duration-300">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Welcome back, {user?.username || user?.email || 'Admin'}
            </h2>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="bg-gray-50 min-h-screen overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
};

export default Layout;
