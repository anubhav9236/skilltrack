import React, { useState, useMemo } from 'react';
import { useOpportunities } from '../context/OpportunityContext';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityForm } from '../components/opportunities/OpportunityForm';
import { OpportunityDetailsModal } from '../components/opportunities/OpportunityDetailsModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Opportunity, OpportunityInput, OpportunityCategory } from '../types/database';
import { Bookmark, Search, Plus } from 'lucide-react';

const CATEGORIES: (OpportunityCategory | 'All')[] = [
  'All',
  'Hackathon',
  'Internship',
  'Scholarship',
  'Certification',
  'Open Source',
];

export const SavedOpportunitiesPage: React.FC = () => {
  const { 
    opportunities, 
    toggleSave, 
    changeStatus, 
    removeOpportunity, 
    editOpportunity, 
    addOpportunity 
  } = useOpportunities();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | 'All'>('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter only saved opportunities
  const savedOpportunities = useMemo(() => {
    return opportunities.filter((opp: Opportunity) => {
      if (!opp.isSaved) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesOrg = opp.organization.toLowerCase().includes(q);
        const matchesDesc = (opp.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesOrg && !matchesDesc) return false;
      }

      if (selectedCategory !== 'All' && opp.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [opportunities, search, selectedCategory]);

  const handleUpdate = async (data: OpportunityInput) => {
    if (editingOpportunity) {
      await editOpportunity(editingOpportunity.$id, data);
      setEditingOpportunity(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await removeOpportunity(deletingId);
      setDeletingId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            <span>Saved Opportunities</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Your personal bookmarks and shortlisted programs saved for easy reference.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
          Add Opportunity
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search saved opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List / Grid */}
      {savedOpportunities.length === 0 ? (
        <EmptyState
          title="No saved opportunities found"
          description={
            search || selectedCategory !== 'All'
              ? 'No saved opportunities match your current filters. Try adjusting your search query.'
              : 'You have not bookmarked any opportunities yet. Click the bookmark icon on any opportunity card to pin it here!'
          }
          icon={<Bookmark className="w-7 h-7 text-amber-400" />}
          actionLabel="Explore All Opportunities"
          onAction={() => {
            window.location.href = '/opportunities';
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedOpportunities.map((opportunity: Opportunity) => (
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

      <ConfirmModal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Opportunity"
        message="Are you sure you want to delete this saved opportunity?"
        confirmText="Delete"
      />
    </div>
  );
};
