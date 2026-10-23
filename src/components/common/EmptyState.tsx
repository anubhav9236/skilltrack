import React from 'react';
import { Button } from './Button';
import { Search, FolderPlus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
      <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
        {icon || <Search className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} icon={<FolderPlus className="w-4 h-4" />}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
