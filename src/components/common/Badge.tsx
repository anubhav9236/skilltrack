import React from 'react';
import { OpportunityCategory, ApplicationStatus, OpportunityPriority } from '../../types/database';
import { getCategoryBadge, getStatusBadge, getPriorityBadge, cn } from '../../lib/utils';
import { 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  Award, 
  GitBranch, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface CategoryBadgeProps {
  category: OpportunityCategory;
  className?: string;
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  className,
  showIcon = true 
}) => {
  const style = getCategoryBadge(category);

  const getIcon = () => {
    switch (category) {
      case 'Hackathon':
        return <Trophy className="w-3.5 h-3.5" />;
      case 'Internship':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Scholarship':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Certification':
        return <Award className="w-3.5 h-3.5" />;
      case 'Open Source':
        return <GitBranch className="w-3.5 h-3.5" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all',
        style.bg,
        style.text,
        style.border,
        style.glow,
        className
      )}
    >
      {showIcon && getIcon()}
      <span>{category}</span>
    </span>
  );
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className,
  showDot = true 
}) => {
  const style = getStatusBadge(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {showDot && (
        <span className={cn('w-2 h-2 rounded-full animate-pulse', style.dot)} />
      )}
      <span>{status}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: OpportunityPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const style = getPriorityBadge(priority);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border',
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {priority}
    </span>
  );
};
