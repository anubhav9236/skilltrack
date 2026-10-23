import React from 'react';
import { Opportunity } from '../../types/database';
import { formatDate, getDeadlineStatus, cn } from '../../lib/utils';
import { CategoryBadge } from '../common/Badge';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface UpcomingDeadlineListProps {
  opportunities: Opportunity[];
  onView: (opp: Opportunity) => void;
}

export const UpcomingDeadlineList: React.FC<UpcomingDeadlineListProps> = ({
  opportunities,
  onView,
}) => {
  // Filter for upcoming deadlines (not expired) and sort by closest deadline
  const upcoming = opportunities
    .filter((opp) => {
      const days = getDeadlineStatus(opp.deadline);
      return !days.isExpired;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Upcoming Deadlines</h4>
              <p className="text-xs text-slate-400">Approaching milestones</p>
            </div>
          </div>

          <Link
            to="/deadlines"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs rounded-xl bg-slate-900/40 border border-slate-800/60 my-2">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-500" />
            <span>No upcoming deadlines scheduled</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {upcoming.map((opp) => {
              const status = getDeadlineStatus(opp.deadline);
              return (
                <div
                  key={opp.$id}
                  onClick={() => onView(opp)}
                  className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800/80 hover:border-slate-700/80 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge category={opp.category} showIcon={false} />
                      <span className="text-xs text-slate-400 truncate">{opp.organization}</span>
                    </div>
                    <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {opp.title}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold border block text-center', status.colorClass)}>
                      {status.label}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {formatDate(opp.deadline)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>Approaching within 7 days highlighted</span>
        <span className="font-semibold text-amber-400">Priority Tracker</span>
      </div>
    </div>
  );
};
