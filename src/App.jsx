import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './store/authSlice';
import { AuthProvider } from './contexts/AuthContext';
import { CMSProvider } from './contexts/CMSContext';
import CMSInitializer from './components/CMSInitializer';
import { ProtectedRoute, PublicRoute, AdminRoute, AgentRoute, AdminOrAgentRoute } from './components/ProtectedRoutes';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Agents from './pages/Agents';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import Analytics from './pages/Analytics';
import Hero from './pages/Hero';
import Collaborations from './pages/Collaborations';
import Slides from './pages/Slides';
import YourPerfect from './pages/YourPerfect';
import SidebarCard from './pages/SidebarCard';
import DAMAC from './pages/DAMAC';
import EmpoweringCommunities from './pages/EmpoweringCommunities';
import CMSSettings from './pages/CMSSettings';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import AgentDashboard from './pages/AgentDashboard';
import AgentLeads from './pages/AgentLeads';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Auth Event Handler Component
const AuthEventHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthUnauthorized = (event) => {
      const currentPath = window.location.pathname;
      const isAgentRoute = currentPath.startsWith('/agent');
      const publicRoutes = ['/login', '/', '/forgot-password', '/reset-password'];

      // CRITICAL: Clear Redux auth state immediately
      dispatch(logout());

      // Clear localStorage
      localStorage.removeItem('token');

      // Only redirect to login for non-agent routes and non-public routes
      if (!isAgentRoute && !publicRoutes.includes(currentPath)) {
        navigate('/login', { replace: true });
      }
      // For agent routes, do nothing - let the component handle 401 errors gracefully
    };

    // Listen for custom auth event
    window.addEventListener('auth:unauthorized', handleAuthUnauthorized);

    // Cleanup
    return () => {
      window.removeEventListener('auth:unauthorized', handleAuthUnauthorized);
    };
  }, [navigate, dispatch]);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <CMSInitializer />
        <Router>
          <AuthEventHandler />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />

              {/* Admin-only routes */}
              {/* <Route
                path="dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              /> */}
              <Route
                path="users"
                element={
                  <AdminRoute>
                    <Users />
                  </AdminRoute>
                }
              />
              <Route
                path="agents"
                element={
                  <AdminRoute>
                    <Agents />
                  </AdminRoute>
                }
              />
              <Route
                path="hero"
                element={
                  <AdminRoute>
                    <Hero />
                  </AdminRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <AdminRoute>
                    <Analytics />
                  </AdminRoute>
                }
              />
              <Route
                path="leads"
                element={
                  <AdminRoute>
                    <Leads />
                  </AdminRoute>
                }
              />
              <Route
                path="properties"
                element={
                  <AdminRoute>
                    <Properties />
                  </AdminRoute>
                }
              />
              <Route
                path="collaborations"
                element={
                  <AdminRoute>
                    <Collaborations />
                  </AdminRoute>
                }
              />
              <Route
                path="slides"
                element={
                  <AdminRoute>
                    <Slides />
                  </AdminRoute>
                }
              />
              <Route
                path="yourperfect"
                element={
                  <AdminRoute>
                    <YourPerfect />
                  </AdminRoute>
                }
              />
              <Route
                path="sidebarcard"
                element={
                  <AdminRoute>
                    <SidebarCard />
                  </AdminRoute>
                }
              />
              <Route
                path="damac"
                element={
                  <AdminRoute>
                    <DAMAC />
                  </AdminRoute>
                }
              />
              <Route
                path="empoweringcommunities"
                element={
                  <AdminRoute>
                    <EmpoweringCommunities />
                  </AdminRoute>
                }
              />
              <Route
                path="cms-settings"
                element={
                  <AdminRoute>
                    <CMSSettings />
                  </AdminRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <AdminOrAgentRoute>
                    <Profile />
                  </AdminOrAgentRoute>
                }
              />

              {/* Agent-only routes */}
              <Route path="agent" element={<AgentRoute />}>
                <Route index element={<AgentDashboard />} />
                <Route path="leads" element={<AgentLeads />} />
                <Route path="profile" element={<Profile />} />
                <Route path="properties" element={
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
                    <p className="text-gray-600">Manage your property listings</p>
                  </div>
                } />
                <Route path="appointments" element={
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
                    <p className="text-gray-600">Manage your appointments and schedule</p>
                  </div>
                } />
                <Route path="documents" element={
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
                    <p className="text-gray-600">Manage your documents and files</p>
                  </div>
                } />
                <Route path="reports" element={
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
                    <p className="text-gray-600">View your performance analytics and reports</p>
                  </div>
                } />
              </Route>
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CMSProvider>
    </AuthProvider>
  );
}

export default App;
