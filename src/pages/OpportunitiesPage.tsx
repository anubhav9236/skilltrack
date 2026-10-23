import React, { useState } from 'react';
import { useOpportunities } from '../context/OpportunityContext';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityForm } from '../components/opportunities/OpportunityForm';
import { OpportunityDetailsModal } from '../components/opportunities/OpportunityDetailsModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { 
  Opportunity, 
  OpportunityInput, 
  OpportunityCategory, 
  ApplicationStatus,
  OpportunityFilters
} from '../types/database';
import { 
  Search, 
  Plus, 
  RotateCcw,
  Compass
} from 'lucide-react';
import { cn } from '../lib/utils';

const CATEGORIES: (OpportunityCategory | 'All')[] = [
  'All',
  'Hackathon',
  'Internship',
  'Scholarship',
  'Certification',
  'Open Source',
];

const STATUSES: (ApplicationStatus | 'All')[] = [
  'All',
  'Interested',
  'Planning',
  'Applied',
  'Shortlisted',
  'Selected',
  'Rejected',
];

export const OpportunitiesPage: React.FC = () => {
  const { 
    filteredOpportunities, 
    opportunities, 
    filters, 
    setFilters, 
    resetFilters,
    addOpportunity, 
    editOpportunity, 
    removeOpportunity, 
    toggleSave, 
    changeStatus,
  } = useOpportunities();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = async (data: OpportunityInput) => {
    await addOpportunity(data);
  };

  const handleUpdate = async (data: OpportunityInput) => {
    if (editingOpportunity) {
      await editOpportunity(editingOpportunity.$id, data);
      setEditingOpportunity(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await removeOpportunity(deletingId);
      setDeletingId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-400" />
            <span>Opportunities Hub</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage, filter, and track all your student applications in one place.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Opportunity
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, organization, or notes..."
              value={filters.search}
              onChange={(e) => setFilters((prev: OpportunityFilters) => ({ ...prev, search: e.target.value }))}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev: OpportunityFilters) => ({ ...prev, status: e.target.value as any }))}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
                setFilters((prev: OpportunityFilters) => ({ ...prev, sortBy, sortOrder }));
              }}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="deadline-asc">Deadline: Closest First</option>
              <option value="deadline-desc">Deadline: Furthest First</option>
              <option value="createdAt-desc">Recently Added</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="priority-desc">Priority: High to Low</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="md:col-span-1 flex items-center justify-end">
            <button
              type="button"
              onClick={resetFilters}
              title="Reset all filters"
              className="w-full md:w-auto p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilters((prev: OpportunityFilters) => ({ ...prev, category: cat }))}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all border',
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong>{filteredOpportunities.length}</strong> of {opportunities.length} opportunities
        </span>
        {filters.search || filters.category !== 'All' || filters.status !== 'All' ? (
          <span className="text-indigo-400 font-semibold">Active filters applied</span>
        ) : null}
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description={
            opportunities.length === 0
              ? 'You have not added any opportunities yet. Click the button below to add your first hackathon or internship.'
              : 'No opportunities matched your search and filter criteria. Try resetting the filters.'
          }
          actionLabel={opportunities.length === 0 ? 'Add Opportunity' : 'Reset Filters'}
          onAction={opportunities.length === 0 ? () => setIsAddModalOpen(true) : resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opportunity: Opportunity) => (
            <OpportunityCard
              key={opportunity.$id}
              opportunity={opportunity}
              onView={(opp: Opportunity) => setSelectedOpportunity(opp)}
              onEdit={(opp: Opportunity) => setEditingOpportunity(opp)}
              onDelete={(id: string) => setDeletingId(id)}
              onToggleSave={toggleSave}
              onChangeStatus={changeStatus}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <OpportunityForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
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

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Opportunity"
        message="Are you sure you want to permanently delete this opportunity from your Appwrite TablesDB? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};
