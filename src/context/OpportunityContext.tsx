import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Opportunity, 
  OpportunityInput, 
  OpportunityFilters, 
  ApplicationStatus 
} from '../types/database';
import { appwriteService } from '../services/appwriteService';
import { isAppwriteConfigured } from '../lib/appwrite';
import { useAuth } from './AuthContext';
import { INITIAL_MOCK_OPPORTUNITIES } from '../services/mockData';
import { getDaysLeft } from '../lib/utils';
import confetti from 'canvas-confetti';

interface OpportunityStats {
  total: number;
  saved: number;
  inProgress: number;
  completed: number;
  upcomingDeadlinesCount: number;
  expiredCount: number;
  selectedCount: number;
}

interface OpportunityContextType {
  opportunities: Opportunity[];
  filteredOpportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  filters: OpportunityFilters;
  stats: OpportunityStats;
  setFilters: React.Dispatch<React.SetStateAction<OpportunityFilters>>;
  resetFilters: () => void;
  addOpportunity: (input: OpportunityInput) => Promise<Opportunity>;
  editOpportunity: (id: string, updates: Partial<OpportunityInput>) => Promise<void>;
  removeOpportunity: (id: string) => Promise<void>;
  toggleSave: (id: string) => Promise<void>;
  changeStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  refreshOpportunities: () => Promise<void>;
}

const defaultFilters: OpportunityFilters = {
  search: '',
  category: 'All',
  status: 'All',
  priority: 'All',
  sortBy: 'deadline',
  sortOrder: 'asc',
};

const OpportunityContext = createContext<OpportunityContextType | undefined>(undefined);

export const OpportunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OpportunityFilters>(defaultFilters);

  // Fetch opportunities whenever user changes
  const fetchOpportunities = useCallback(async () => {
    if (!user) {
      setOpportunities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // If using Demo Mode or Appwrite is unconfigured
    if (isDemoMode || !isAppwriteConfigured()) {
      // Load from local storage or fallback to initial mock
      const stored = localStorage.getItem(`skilltrack_opps_${user.$id}`);
      if (stored) {
        try {
          setOpportunities(JSON.parse(stored));
        } catch {
          setOpportunities(INITIAL_MOCK_OPPORTUNITIES);
        }
      } else {
        setOpportunities(INITIAL_MOCK_OPPORTUNITIES);
        localStorage.setItem(`skilltrack_opps_${user.$id}`, JSON.stringify(INITIAL_MOCK_OPPORTUNITIES));
      }
      setLoading(false);
      return;
    }

    // Live Appwrite TablesDB Query
    try {
      const data = await appwriteService.listUserOpportunities(user.$id);
      setOpportunities(data);
    } catch (err: any) {
      console.error('[OpportunityContext] Failed to load opportunities from Appwrite TablesDB:', err);
      // If collection/table doesn't exist yet, guide user gracefully with actionable message
      if (err?.code === 404) {
        setError('Appwrite Database or Table not found. Please verify the IDs in your .env or create the schema.');
      } else {
        setError(err?.message || 'Could not load opportunities from Appwrite TablesDB.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, isDemoMode]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Sync to local storage when in demo mode
  const syncDemoStorage = (updated: Opportunity[]) => {
    if (user && (isDemoMode || !isAppwriteConfigured())) {
      localStorage.setItem(`skilltrack_opps_${user.$id}`, JSON.stringify(updated));
    }
  };

  // Add Opportunity
  const addOpportunity = async (input: OpportunityInput): Promise<Opportunity> => {
    if (!user) throw new Error('User must be logged in to create an opportunity.');

    if (isDemoMode || !isAppwriteConfigured()) {
      const newOpp: Opportunity = {
        ...input,
        $id: 'opp-' + Date.now(),
        $createdAt: new Date().toISOString(),
        userId: user.$id,
      };
      const updated = [newOpp, ...opportunities];
      setOpportunities(updated);
      syncDemoStorage(updated);
      return newOpp;
    }

    const created = await appwriteService.createOpportunity(user.$id, input);
    setOpportunities(prev => [created, ...prev]);
    return created;
  };

  // Edit Opportunity
  const editOpportunity = async (id: string, updates: Partial<OpportunityInput>) => {
    if (isDemoMode || !isAppwriteConfigured()) {
      const updated = opportunities.map(opp => 
        opp.$id === id ? { ...opp, ...updates, $updatedAt: new Date().toISOString() } : opp
      );
      setOpportunities(updated);
      syncDemoStorage(updated);
      return;
    }

    const updated = await appwriteService.updateOpportunity(id, updates);
    setOpportunities(prev => prev.map(opp => opp.$id === id ? updated : opp));
  };

  // Delete Opportunity
  const removeOpportunity = async (id: string) => {
    if (isDemoMode || !isAppwriteConfigured()) {
      const updated = opportunities.filter(opp => opp.$id !== id);
      setOpportunities(updated);
      syncDemoStorage(updated);
      return;
    }

    await appwriteService.deleteOpportunity(id);
    setOpportunities(prev => prev.filter(opp => opp.$id !== id));
  };

  // Toggle Save (Bookmark)
  const toggleSave = async (id: string) => {
    const opp = opportunities.find(o => o.$id === id);
    if (!opp) return;

    const newSaved = !opp.isSaved;

    // Optimistic UI update
    setOpportunities(prev => prev.map(o => o.$id === id ? { ...o, isSaved: newSaved } : o));

    if (isDemoMode || !isAppwriteConfigured()) {
      const updated = opportunities.map(o => o.$id === id ? { ...o, isSaved: newSaved } : o);
      syncDemoStorage(updated);
      return;
    }

    try {
      await appwriteService.toggleSaved(id, opp.isSaved);
    } catch (err) {
      // Revert optimistic update on failure
      setOpportunities(prev => prev.map(o => o.$id === id ? { ...o, isSaved: opp.isSaved } : o));
      throw err;
    }
  };

  // Change Status
  const changeStatus = async (id: string, status: ApplicationStatus) => {
    const opp = opportunities.find(o => o.$id === id);
    if (!opp) return;

    // Trigger celebration confetti if Selected!
    if (status === 'Selected') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'],
        });
      } catch {
        // Confetti fallback
      }
    }

    // Optimistic UI update
    setOpportunities(prev => prev.map(o => o.$id === id ? { ...o, status } : o));

    if (isDemoMode || !isAppwriteConfigured()) {
      const updated = opportunities.map(o => o.$id === id ? { ...o, status } : o);
      syncDemoStorage(updated);
      return;
    }

    try {
      await appwriteService.updateStatus(id, status);
    } catch (err) {
      setOpportunities(prev => prev.map(o => o.$id === id ? { ...o, status: opp.status } : o));
      throw err;
    }
  };

  const resetFilters = () => setFilters(defaultFilters);

  // Derived filtered & sorted opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(item => {
        // Search filter (title, organization, description, notes)
        if (filters.search.trim()) {
          const query = filters.search.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesOrg = item.organization.toLowerCase().includes(query);
          const matchesDesc = (item.description || '').toLowerCase().includes(query);
          const matchesNotes = (item.notes || '').toLowerCase().includes(query);
          if (!matchesTitle && !matchesOrg && !matchesDesc && !matchesNotes) return false;
        }

        // Category filter
        if (filters.category !== 'All' && item.category !== filters.category) {
          return false;
        }

        // Status filter
        if (filters.status !== 'All' && item.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'All' && item.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (filters.sortBy === 'deadline') {
          comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        } else if (filters.sortBy === 'createdAt') {
          comparison = new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
        } else if (filters.sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (filters.sortBy === 'priority') {
          const rank = { High: 3, Medium: 2, Low: 1 };
          comparison = rank[b.priority] - rank[a.priority];
        }

        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [opportunities, filters]);

  // Derived real-time statistics
  const stats = useMemo<OpportunityStats>(() => {
    let saved = 0;
    let inProgress = 0;
    let completed = 0;
    let upcomingDeadlinesCount = 0;
    let expiredCount = 0;
    let selectedCount = 0;

    opportunities.forEach(opp => {
      if (opp.isSaved) saved++;
      if (['Planning', 'Applied', 'Shortlisted'].includes(opp.status)) inProgress++;
      if (['Selected', 'Rejected'].includes(opp.status)) completed++;
      if (opp.status === 'Selected') selectedCount++;

      const days = getDaysLeft(opp.deadline);
      if (days < 0) {
        expiredCount++;
      } else if (days <= 7) {
        upcomingDeadlinesCount++;
      }
    });

    return {
      total: opportunities.length,
      saved,
      inProgress,
      completed,
      upcomingDeadlinesCount,
      expiredCount,
      selectedCount,
    };
  }, [opportunities]);

  return (
    <OpportunityContext.Provider
      value={{
        opportunities,
        filteredOpportunities,
        loading,
        error,
        filters,
        stats,
        setFilters,
        resetFilters,
        addOpportunity,
        editOpportunity,
        removeOpportunity,
        toggleSave,
        changeStatus,
        refreshOpportunities: fetchOpportunities,
      }}
    >
      {children}
    </OpportunityContext.Provider>
  );
};

export function useOpportunities() {
  const context = useContext(OpportunityContext);
  if (!context) {
    throw new Error('useOpportunities must be used within an OpportunityProvider');
  }
  return context;
}
