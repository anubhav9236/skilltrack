import React from 'react';
import { Opportunity, ApplicationStatus } from '../../types/database';
import { StatusBadge, CategoryBadge } from '../common/Badge';
import { QuickStatusMenu } from '../opportunities/QuickStatusMenu';
import { formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Building2, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface RecentOpportunitiesListProps {
  opportunities: Opportunity[];
  onView: (opp: Opportunity) => void;
  onAddNew: () => void;
  onChangeStatus: (id: string, status: ApplicationStatus) => void;
}

export const RecentOpportunitiesList: React.FC<RecentOpportunitiesListProps> = ({
  opportunities,
  onView,
  onAddNew,
  onChangeStatus,
}) => {
  // Sort by created date descending
  const recent = [...opportunities]
    .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Recent Opportunities</h4>
            <p className="text-xs text-slate-400">Latest additions to your pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onAddNew} icon={<Plus className="w-3.5 h-3.5" />}>
            Add Opportunity
          </Button>
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 py-1.5"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800/60 text-slate-400 text-xs">
          <span>No opportunities added yet. Click above to track your first opportunity.</span>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {recent.map((opp) => (
            <div
              key={opp.$id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div 
                onClick={() => onView(opp)}
                className="cursor-pointer min-w-0 flex-1"
              >
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <CategoryBadge category={opp.category} />
                  <span className="text-xs text-slate-400 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    {opp.organization}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                  {opp.title}
                </h5>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <QuickStatusMenu
                  currentStatus={opp.status}
                  onChange={(status) => onChangeStatus(opp.$id, status)}
                />

                <span className="text-xs text-slate-500 min-w-20 text-right">
                  {formatDate(opp.$createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
