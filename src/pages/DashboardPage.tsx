import React, { useState } from 'react';
import { useOpportunities } from '../context/OpportunityContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { UpcomingDeadlineList } from '../components/dashboard/UpcomingDeadlineList';
import { RecentOpportunitiesList } from '../components/dashboard/RecentOpportunitiesList';
import { OpportunityForm } from '../components/opportunities/OpportunityForm';
import { OpportunityDetailsModal } from '../components/opportunities/OpportunityDetailsModal';
import { Opportunity, OpportunityInput } from '../types/database';
import { Button } from '../components/common/Button';
import { 
  Trophy, 
  Bookmark, 
  Hourglass, 
  Calendar, 
  Plus, 
  Sparkles, 
  Database 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    opportunities, 
    stats, 
    error, 
    addOpportunity, 
    editOpportunity, 
    toggleSave, 
    changeStatus 
  } = useOpportunities();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const handleCreate = async (data: OpportunityInput) => {
    await addOpportunity(data);
  };

  const handleUpdate = async (data: OpportunityInput) => {
    if (editingOpportunity) {
      await editOpportunity(editingOpportunity.$id, data);
      setEditingOpportunity(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900 border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Appwrite TablesDB Hackathon 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{user?.name || 'Fellow Hacker'}</span>!
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Track hackathons, internships, scholarships, and open-source programs. Stay ahead of deadlines and manage your career applications in one unified workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              size="lg"
            >
              Add Opportunity
            </Button>
            <Link to="/setup">
              <Button variant="outline" size="lg" icon={<Database className="w-4 h-4" />}>
                TablesDB Setup
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Database Error Alert (if schema is missing or invalid) */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-sm flex items-center justify-between gap-4">
          <div>
            <p className="font-bold">Notice from Database Service:</p>
            <p className="text-xs text-amber-300 mt-0.5">{error}</p>
          </div>
          <Link to="/setup" className="shrink-0 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors">
            Configure TablesDB
          </Link>
        </div>
      )}

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Opportunities"
          value={stats.total}
          subtitle="In your tracking pipeline"
          icon={<Trophy className="w-6 h-6" />}
          colorScheme="indigo"
          trend={{ label: 'Active Pipeline', isPositive: true }}
        />

        <StatCard
          title="Saved & Bookmarked"
          value={stats.saved}
          subtitle="Starred for review"
          icon={<Bookmark className="w-6 h-6" />}
          colorScheme="amber"
          trend={{ label: `${stats.saved} pinned items`, isPositive: true }}
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Applied / Planning / Shortlisted"
          icon={<Hourglass className="w-6 h-6" />}
          colorScheme="blue"
          trend={{ label: `${stats.selectedCount} offers selected!`, isPositive: true }}
        />

        <StatCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlinesCount}
          subtitle="Within the next 7 days"
          icon={<Calendar className="w-6 h-6" />}
          colorScheme={stats.upcomingDeadlinesCount > 0 ? 'rose' : 'emerald'}
          trend={{ 
            label: stats.upcomingDeadlinesCount > 0 ? 'Urgent attention required' : 'All deadlines clear', 
            isPositive: stats.upcomingDeadlinesCount === 0 
          }}
        />
      </div>

      {/* Main Charts & Deadlines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart opportunities={opportunities} />
        </div>

        <div className="lg:col-span-1">
          <UpcomingDeadlineList
            opportunities={opportunities}
            onView={(opp: Opportunity) => setSelectedOpportunity(opp)}
          />
        </div>
      </div>

      {/* Recent Opportunities List */}
      <div>
        <RecentOpportunitiesList
          opportunities={opportunities}
          onView={(opp: Opportunity) => setSelectedOpportunity(opp)}
          onAddNew={() => setIsAddModalOpen(true)}
          onChangeStatus={changeStatus}
        />
      </div>

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
    </div>
  );
};
