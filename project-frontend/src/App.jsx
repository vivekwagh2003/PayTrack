import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './pages/auth/LoginForm';
import RegisterForm from './pages/auth/RegisterationForm';
import Dashboard from './pages/dashboard/Dashboard';
import PlanList from './pages/plans/PlanList';
import ProfileSettings from './pages/profile/ProfileSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './pages/layout/Navbar';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Consider a spinner here for better UX
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// New component to handle redirection based on user role
const RedirectBasedOnRole = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Consider a spinner here for better UX
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect based on user role
  return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto py-6">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requireAdmin>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/plans"
                element={
                  <PrivateRoute>
                    <PlanList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfileSettings />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<RedirectBasedOnRole />} /> {/* Updated to use the new component */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
