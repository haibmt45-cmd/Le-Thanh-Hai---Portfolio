import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PublicSite from './PublicSite';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ContentEditor from './admin/ContentEditor';
import Settings from './admin/Settings';
import Analytics from './admin/Analytics';
import { AuthProvider, useAuth } from './admin/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Website */}
            <Route path="/" element={<PublicSite />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Dashboard (Protected) */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}
