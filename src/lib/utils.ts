import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApplicationStatus, OpportunityCategory, OpportunityPriority } from '../types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'No deadline';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getDaysLeft(dateString: string): number {
  if (!dateString) return 999;
  const deadline = new Date(dateString);
  const now = new Date();
  
  // Reset time portions to compare calendar days
  deadline.setHours(23, 59, 59, 999);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDeadlineStatus(dateString: string): {
  label: string;
  isUrgent: boolean;
  isExpired: boolean;
  colorClass: string;
} {
  const days = getDaysLeft(dateString);
  
  if (days < 0) {
    return {
      label: `Expired ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`,
      isUrgent: false,
      isExpired: true,
      colorClass: 'text-red-400 bg-red-950/40 border-red-800/60',
    };
  }
  
  if (days === 0) {
    return {
      label: 'Due today!',
      isUrgent: true,
      isExpired: false,
      colorClass: 'text-amber-300 bg-amber-950/40 border-amber-800/60 animate-pulse',
    };
  }
  
  if (days <= 7) {
    return {
      label: `${days} ${days === 1 ? 'day' : 'days'} left`,
      isUrgent: true,
      isExpired: false,
      colorClass: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    };
  }
  
  return {
    label: `${days} days left`,
    isUrgent: false,
    isExpired: false,
    colorClass: 'text-slate-300 bg-slate-800/60 border-slate-700/60',
  };
}

export function getCategoryBadge(category: OpportunityCategory): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (category) {
    case 'Hackathon':
      return {
        bg: 'bg-purple-950/50',
        text: 'text-purple-300',
        border: 'border-purple-800/60',
        glow: 'shadow-purple-500/10',
      };
    case 'Internship':
      return {
        bg: 'bg-blue-950/50',
        text: 'text-blue-300',
        border: 'border-blue-800/60',
        glow: 'shadow-blue-500/10',
      };
    case 'Scholarship':
      return {
        bg: 'bg-emerald-950/50',
        text: 'text-emerald-300',
        border: 'border-emerald-800/60',
        glow: 'shadow-emerald-500/10',
      };
    case 'Certification':
      return {
        bg: 'bg-indigo-950/50',
        text: 'text-indigo-300',
        border: 'border-indigo-800/60',
        glow: 'shadow-indigo-500/10',
      };
    case 'Open Source':
      return {
        bg: 'bg-pink-950/50',
        text: 'text-pink-300',
        border: 'border-pink-800/60',
        glow: 'shadow-pink-500/10',
      };
    default:
      return {
        bg: 'bg-slate-800/50',
        text: 'text-slate-300',
        border: 'border-slate-700/60',
        glow: '',
      };
  }
}

export function getStatusBadge(status: ApplicationStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'Interested':
      return {
        bg: 'bg-slate-800/80',
        text: 'text-slate-300',
        border: 'border-slate-700',
        dot: 'bg-slate-400',
      };
    case 'Planning':
      return {
        bg: 'bg-cyan-950/60',
        text: 'text-cyan-300',
        border: 'border-cyan-800/70',
        dot: 'bg-cyan-400',
      };
    case 'Applied':
      return {
        bg: 'bg-blue-950/60',
        text: 'text-blue-300',
        border: 'border-blue-800/70',
        dot: 'bg-blue-400',
      };
    case 'Shortlisted':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-300',
        border: 'border-amber-800/70',
        dot: 'bg-amber-400',
      };
    case 'Selected':
      return {
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-300',
        border: 'border-emerald-700/80',
        dot: 'bg-emerald-400',
      };
    case 'Rejected':
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-300',
        border: 'border-red-800/70',
        dot: 'bg-red-400',
      };
    default:
      return {
        bg: 'bg-slate-800',
        text: 'text-slate-300',
        border: 'border-slate-700',
        dot: 'bg-slate-400',
      };
  }
}

export function getPriorityBadge(priority: OpportunityPriority): {
  bg: string;
  text: string;
  border: string;
} {
  switch (priority) {
    case 'High':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-300',
        border: 'border-rose-800/50',
      };
    case 'Medium':
      return {
        bg: 'bg-yellow-950/40',
        text: 'text-yellow-300',
        border: 'border-yellow-800/50',
      };
    case 'Low':
      return {
        bg: 'bg-slate-800/40',
        text: 'text-slate-400',
        border: 'border-slate-700/50',
      };
  }
}
