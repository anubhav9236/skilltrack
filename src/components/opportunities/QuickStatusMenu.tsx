import React, { useState, useRef, useEffect } from 'react';
import { ApplicationStatus } from '../../types/database';
import { StatusBadge } from '../common/Badge';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuickStatusMenuProps {
  currentStatus: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Interested',
  'Planning',
  'Applied',
  'Shortlisted',
  'Selected',
  'Rejected',
];

export const QuickStatusMenu: React.FC<QuickStatusMenuProps> = ({
  currentStatus,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <StatusBadge status={currentStatus} />
        <span className="p-0.5 rounded-full text-slate-400 group-hover:text-slate-200 transition-colors bg-slate-800/80 border border-slate-700/60">
          <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-44 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-1.5 z-30 animate-fade-in focus:outline-none">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 mb-1">
            Change Status
          </div>
          {ALL_STATUSES.map((status) => {
            const isSelected = status === currentStatus;
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  onChange(status);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors',
                  isSelected 
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                )}
              >
                <span>{status}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
