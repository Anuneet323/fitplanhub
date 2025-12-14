import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FeedPage from './pages/FeedPage';
import TrainersPage from './pages/TrainersPage';
import PlanDetailsPage from './pages/PlanDetailsPage';

import './styles/index.css';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Start page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Trainer */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="trainer">
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* User */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute requiredRole="user">
            <FeedPage />
          </ProtectedRoute>
        }
      />

      {/* Any logged-in */}
      <Route
        path="/trainers"
        element={
          <ProtectedRoute>
            <TrainersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plan/:id"
        element={
          <ProtectedRoute>
            <PlanDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
