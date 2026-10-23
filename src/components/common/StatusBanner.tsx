import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isAppwriteConfigured, APPWRITE_PROJECT_ID } from '../../lib/appwrite';
import { Link } from 'react-router-dom';
import { Sparkles, Database, ExternalLink, ShieldCheck } from 'lucide-react';

export const StatusBanner: React.FC = () => {
  const { isDemoMode } = useAuth();
  const configured = isAppwriteConfigured();

  if (configured && !isDemoMode) {
    return null; // Silent when fully configured and live on Appwrite
  }

  return (
    <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border-b border-indigo-800/40 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-slate-200 text-center sm:text-left">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <p>
            <strong className="text-amber-300 font-semibold">Demo Sandbox Active:</strong>{' '}
            <span className="text-slate-300">
              Exploring with sample opportunities. Connect your Appwrite TablesDB to persist cloud data across devices.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/setup"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Appwrite Setup Guide</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
