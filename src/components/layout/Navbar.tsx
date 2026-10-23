import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isAppwriteConfigured } from '../../lib/appwrite';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Plus, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  onOpenAddModal,
}) => {
  const { user, isDemoMode } = useAuth();
  const configured = isAppwriteConfigured();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Student Opportunity Tracker
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Appwrite Connection Badge */}
        <Link
          to="/setup"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105"
          title="Click to view Appwrite TablesDB connection status"
        >
          {configured && !isDemoMode ? (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border-emerald-800/60 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Appwrite Cloud Live</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-300 bg-amber-950/40 border-amber-800/60 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Demo Mode (Connect TablesDB)</span>
            </span>
          )}
        </Link>

        {/* Add Opportunity Quick Action */}
        <Button
          size="sm"
          onClick={onOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          <span className="hidden sm:inline">Add Opportunity</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>
    </header>
  );
};
