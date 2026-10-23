import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Target } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4 animate-pulse">
          <Target className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          <span>Synchronizing with Appwrite...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
