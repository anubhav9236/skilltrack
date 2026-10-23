import React from 'react';
import { Opportunity, ApplicationStatus } from '../../types/database';
import { CategoryBadge, PriorityBadge } from '../common/Badge';
import { QuickStatusMenu } from './QuickStatusMenu';
import { formatDate, getDeadlineStatus, cn } from '../../lib/utils';
import { 
  Bookmark, 
  ExternalLink, 
  Calendar, 
  Building2, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Eye,
  FileText
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onView: (opportunity: Opportunity) => void;
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
  onToggleSave: (id: string) => void;
  onChangeStatus: (id: string, status: ApplicationStatus) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onView,
  onEdit,
  onDelete,
  onToggleSave,
  onChangeStatus,
}) => {
  const deadlineInfo = getDeadlineStatus(opportunity.deadline);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between relative group border border-slate-800 transition-all duration-300">
      {/* Top Bar: Category, Priority, Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={opportunity.category} />
            <PriorityBadge priority={opportunity.priority} />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.$id)}
              className={cn(
                'p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                opportunity.isSaved
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-800/60 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
              title={opportunity.isSaved ? 'Remove bookmark' : 'Bookmark opportunity'}
              aria-label={opportunity.isSaved ? 'Bookmarked' : 'Not bookmarked'}
            >
              <Bookmark className={cn('w-4 h-4', opportunity.isSaved && 'fill-amber-400')} />
            </button>
          </div>
        </div>

        {/* Title & Organization */}
        <div className="mb-3">
          <h4 
            onClick={() => onView(opportunity)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
            title={opportunity.title}
          >
            {opportunity.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium text-slate-300 truncate">{opportunity.organization}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {opportunity.description || 'No description provided.'}
        </p>
      </div>

      {/* Bottom Section: Deadline & Status & Actions */}
      <div className="pt-3.5 border-t border-slate-800/80 space-y-3">
        {/* Deadline & Countdown Pill */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>{formatDate(opportunity.deadline)}</span>
          </div>

          <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold border', deadlineInfo.colorClass)}>
            {deadlineInfo.label}
          </span>
        </div>

        {/* Status Dropdown & Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <QuickStatusMenu
            currentStatus={opportunity.status}
            onChange={(status) => onChangeStatus(opportunity.$id, status)}
          />

          <div className="flex items-center gap-1">
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Open Application Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              type="button"
              onClick={() => onView(opportunity)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="View full details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onEdit(opportunity)}
              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit opportunity"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(opportunity.$id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete opportunity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
