import React from 'react';
import { Opportunity, ApplicationStatus } from '../../types/database';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CategoryBadge, StatusBadge, PriorityBadge } from '../common/Badge';
import { QuickStatusMenu } from './QuickStatusMenu';
import { formatDate, getDeadlineStatus, cn } from '../../lib/utils';
import { 
  Building2, 
  Calendar, 
  ExternalLink, 
  Bookmark, 
  Pencil, 
  Clock, 
  FileText, 
  Database,
  CheckCircle2
} from 'lucide-react';

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (opp: Opportunity) => void;
  onToggleSave: (id: string) => void;
  onChangeStatus: (id: string, status: ApplicationStatus) => void;
}

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onEdit,
  onToggleSave,
  onChangeStatus,
}) => {
  if (!opportunity) return null;

  const deadlineInfo = getDeadlineStatus(opportunity.deadline);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity.title}
      subtitle={`Opportunity with ${opportunity.organization}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Top Badges & Bookmark */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={opportunity.category} />
            <PriorityBadge priority={opportunity.priority} />
            <QuickStatusMenu
              currentStatus={opportunity.status}
              onChange={(status) => onChangeStatus(opportunity.$id, status)}
            />
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(opportunity.$id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
              opportunity.isSaved
                ? 'text-amber-400 bg-amber-950/40 border-amber-800/60'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60 border-slate-700/60'
            )}
          >
            <Bookmark className={cn('w-4 h-4', opportunity.isSaved && 'fill-amber-400')} />
            <span>{opportunity.isSaved ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>

        {/* Organization & Deadline Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Organization</span>
            </div>
            <p className="text-base font-bold text-white">{opportunity.organization}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Application Deadline</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <p className="text-base font-bold text-white">{formatDate(opportunity.deadline)}</p>
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold border', deadlineInfo.colorClass)}>
                {deadlineInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Description</span>
          </h4>
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {opportunity.description || 'No detailed description provided.'}
          </div>
        </div>

        {/* Notes & Application Checklist */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Personal Notes & Checklist</span>
          </h4>
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {opportunity.notes ? (
              opportunity.notes
            ) : (
              <span className="text-slate-500 italic">No notes added yet. Click edit to add your application notes or interview dates.</span>
            )}
          </div>
        </div>

        {/* Appwrite Metadata Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>TablesDB ID: <code className="text-slate-400">{opportunity.$id}</code></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Created {formatDate(opportunity.$createdAt)}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {opportunity.applicationUrl ? (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(opportunity);
              }}
              icon={<Pencil className="w-4 h-4" />}
            >
              Edit
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
