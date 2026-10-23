import React, { useState, useMemo } from 'react';
import { useOpportunities } from '../context/OpportunityContext';
import { Opportunity, ApplicationStatus, OpportunityInput } from '../types/database';
import { formatDate, getDeadlineStatus, getDaysLeft, cn } from '../lib/utils';
import { CategoryBadge, PriorityBadge } from '../components/common/Badge';
import { QuickStatusMenu } from '../components/opportunities/QuickStatusMenu';
import { OpportunityDetailsModal } from '../components/opportunities/OpportunityDetailsModal';
import { OpportunityForm } from '../components/opportunities/OpportunityForm';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Building2, 
  Eye, 
  Plus
} from 'lucide-react';

export const DeadlinesPage: React.FC = () => {
  const { 
    opportunities, 
    changeStatus, 
    toggleSave, 
    editOpportunity, 
    addOpportunity 
  } = useOpportunities();

  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'upcoming' | 'expired'>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Categorize deadlines
  const categorized = useMemo(() => {
    const urgent: Opportunity[] = [];
    const upcoming: Opportunity[] = [];
    const expired: Opportunity[] = [];

    opportunities.forEach((opp: Opportunity) => {
      const days = getDaysLeft(opp.deadline);
      if (days < 0) {
        expired.push(opp);
      } else if (days <= 7) {
        urgent.push(opp);
      } else {
        upcoming.push(opp);
      }
    });

    // Sort urgent and upcoming by closest deadline
    urgent.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    upcoming.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    // Sort expired by most recently expired first
    expired.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());

    return { urgent, upcoming, expired };
  }, [opportunities]);

  const displayedOpportunities = useMemo(() => {
    switch (activeTab) {
      case 'urgent':
        return categorized.urgent;
      case 'upcoming':
        return categorized.upcoming;
      case 'expired':
        return categorized.expired;
      case 'all':
      default:
        return [...categorized.urgent, ...categorized.upcoming, ...categorized.expired];
    }
  }, [activeTab, categorized]);

  const handleUpdate = async (data: OpportunityInput) => {
    if (editingOpportunity) {
      await editOpportunity(editingOpportunity.$id, data);
      setEditingOpportunity(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Deadlines & Milestones</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Never miss an application deadline. Highlighted alerts for approaching dates.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Add Opportunity
        </Button>
      </div>

      {/* Deadlines Overview KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('urgent')}
          className={cn(
            'glass-panel p-4 rounded-2xl border transition-all cursor-pointer',
            activeTab === 'urgent'
              ? 'border-amber-500/80 bg-amber-950/30 ring-1 ring-amber-500/50'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Urgent (Within 7 Days)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">
            {categorized.urgent.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Requires immediate submission</p>
        </div>

        <div 
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            'glass-panel p-4 rounded-2xl border transition-all cursor-pointer',
            activeTab === 'upcoming'
              ? 'border-indigo-500/80 bg-indigo-950/30 ring-1 ring-indigo-500/50'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Future Deadlines (&gt; 7 Days)
            </span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">
            {categorized.upcoming.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Scheduled in pipeline</p>
        </div>

        <div 
          onClick={() => setActiveTab('expired')}
          className={cn(
            'glass-panel p-4 rounded-2xl border transition-all cursor-pointer',
            activeTab === 'expired'
              ? 'border-red-500/80 bg-red-950/30 ring-1 ring-red-500/50'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Past Deadlines
            </span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2">
            {categorized.expired.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Applications closed</p>
        </div>
      </div>

      {/* Tab Filter Nav */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          )}
        >
          All Deadlines ({opportunities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('urgent')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
            activeTab === 'urgent'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          )}
        >
          <span>Urgent (7 Days)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800">
            {categorized.urgent.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          )}
        >
          Future ({categorized.upcoming.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expired')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'expired'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          )}
        >
          Expired ({categorized.expired.length})
        </button>
      </div>

      {/* Deadlines List */}
      {displayedOpportunities.length === 0 ? (
        <EmptyState
          title={`No ${activeTab !== 'all' ? activeTab : ''} deadlines found`}
          description={
            activeTab === 'urgent'
              ? 'Great job! You have no critical deadlines approaching within the next 7 days.'
              : 'No opportunities currently fall into this deadline filter.'
          }
          actionLabel="Add Opportunity"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {displayedOpportunities.map((opp: Opportunity) => {
            const status = getDeadlineStatus(opp.deadline);
            return (
              <div
                key={opp.$id}
                className={cn(
                  'glass-panel rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group',
                  status.isUrgent
                    ? 'border-amber-700/60 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900'
                    : status.isExpired
                    ? 'border-red-900/40 opacity-80'
                    : 'border-slate-800 hover:border-slate-700'
                )}
              >
                {/* Left info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <CategoryBadge category={opp.category} />
                    <PriorityBadge priority={opp.priority} />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {opp.organization}
                    </span>
                  </div>

                  <h4 
                    onClick={() => setSelectedOpportunity(opp)}
                    className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {opp.title}
                  </h4>

                  {opp.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-2xl">
                      {opp.description}
                    </p>
                  )}
                </div>

                {/* Right deadline info & status selector */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/80">
                  {/* Deadline countdown */}
                  <div className="text-left md:text-right">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-bold border inline-block', status.colorClass)}>
                      {status.label}
                    </span>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Due: {formatDate(opp.deadline)}
                    </p>
                  </div>

                  {/* Quick status update */}
                  <div>
                    <QuickStatusMenu
                      currentStatus={opp.status}
                      onChange={(newStatus: ApplicationStatus) => changeStatus(opp.$id, newStatus)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {opp.applicationUrl && (
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        title="Open application link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedOpportunity(opp)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <OpportunityForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (data: OpportunityInput) => {
          await addOpportunity(data);
        }}
      />

      <OpportunityForm
        isOpen={Boolean(editingOpportunity)}
        onClose={() => setEditingOpportunity(null)}
        onSubmit={handleUpdate}
        initialData={editingOpportunity}
      />

      <OpportunityDetailsModal
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
        opportunity={selectedOpportunity}
        onEdit={(opp: Opportunity) => setEditingOpportunity(opp)}
        onToggleSave={toggleSave}
        onChangeStatus={changeStatus}
      />
    </div>
  );
};
