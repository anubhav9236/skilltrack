import { Models } from 'appwrite';

export type OpportunityCategory = 
  | 'Hackathon'
  | 'Internship'
  | 'Scholarship'
  | 'Certification'
  | 'Open Source';

export type ApplicationStatus = 
  | 'Interested'
  | 'Planning'
  | 'Applied'
  | 'Shortlisted'
  | 'Selected'
  | 'Rejected';

export type OpportunityPriority = 'Low' | 'Medium' | 'High';

export interface Opportunity {
  $id: string;
  $createdAt: string;
  $updatedAt?: string;
  $permissions?: string[];
  userId: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  applicationUrl: string;
  deadline: string; // ISO Date YYYY-MM-DD
  status: ApplicationStatus;
  priority: OpportunityPriority;
  notes?: string;
  isSaved: boolean;
}

export type OpportunityInput = Omit<Opportunity, '$id' | '$createdAt' | '$updatedAt' | '$permissions'>;

export interface OpportunityFilters {
  search: string;
  category: OpportunityCategory | 'All';
  status: ApplicationStatus | 'All';
  priority: OpportunityPriority | 'All';
  sortBy: 'deadline' | 'createdAt' | 'title' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export interface UserProfile {
  $id: string;
  name: string;
  email: string;
  emailVerification?: boolean;
}

export interface AppwriteConfigStatus {
  isConfigured: boolean;
  endpoint: string;
  projectId: string;
  databaseId: string;
  tableId: string;
  hasErrors?: boolean;
  errorMessage?: string;
}
