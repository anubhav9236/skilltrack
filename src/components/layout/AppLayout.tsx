import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { StatusBanner } from '../common/StatusBanner';
import { OpportunityForm } from '../opportunities/OpportunityForm';
import { useOpportunities } from '../../context/OpportunityContext';
import { OpportunityInput } from '../../types/database';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { addOpportunity } = useOpportunities();

  const handleCreateOpportunity = async (data: OpportunityInput) => {
    await addOpportunity(data);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl z-10 animate-fade-in">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <StatusBanner />
        <Navbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0B1120]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Add Opportunity Modal */}
      <OpportunityForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateOpportunity}
      />
    </div>
  );
};
