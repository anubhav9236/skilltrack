import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OpportunityProvider } from './context/OpportunityContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { DeadlinesPage } from './pages/DeadlinesPage';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage';
import { SetupGuidePage } from './pages/SetupGuidePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OpportunityProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/opportunities" element={<OpportunitiesPage />} />
                <Route path="/deadlines" element={<DeadlinesPage />} />
                <Route path="/saved" element={<SavedOpportunitiesPage />} />
                <Route path="/setup" element={<SetupGuidePage />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OpportunityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
