import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOpportunities } from '../../context/OpportunityContext';
import { isAppwriteConfigured } from '../../lib/appwrite';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  Compass, 
  Calendar, 
  Bookmark, 
  Database, 
  LogOut, 
  Sparkles, 
  UserCircle,
  ExternalLink,
  ChevronRight,
  Target
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout, isDemoMode } = useAuth();
  const { stats } = useOpportunities();
  const configured = isAppwriteConfigured();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/opportunities',
      label: 'Opportunities',
      icon: Compass,
      badge: stats.total > 0 ? stats.total : null,
      badgeColor: 'bg-indigo-600/30 text-indigo-300 border-indigo-500/30',
    },
    {
      to: '/deadlines',
      label: 'Deadlines',
      icon: Calendar,
      badge: stats.upcomingDeadlinesCount > 0 ? `${stats.upcomingDeadlinesCount} urgent` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse',
    },
    {
      to: '/saved',
      label: 'Saved & Bookmarks',
      icon: Bookmark,
      badge: stats.saved > 0 ? stats.saved : null,
      badgeColor: 'bg-slate-700/60 text-slate-300 border-slate-600/50',
    },
    {
      to: '/setup',
      label: 'Appwrite TablesDB',
      icon: Database,
      badge: configured && !isDemoMode ? 'Live' : 'Setup',
      badgeColor: configured && !isDemoMode 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
        : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between h-full select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/" onClick={onCloseMobile} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 group-hover:scale-105 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SkillTrack</span>
              </h1>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400">
                <span>TablesDB 2026</span>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400')} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== null && (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-[11px] font-bold border',
                        isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              {isDemoMode && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Demo
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center">
            SkillTrack Appwrite Edition
          </div>
        )}
      </div>
    </aside>
  );
};
