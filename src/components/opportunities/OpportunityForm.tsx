import React, { useState, useEffect } from 'react';
import { 
  Opportunity, 
  OpportunityInput, 
  OpportunityCategory, 
  ApplicationStatus, 
  OpportunityPriority 
} from '../../types/database';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  Trophy, 
  Building2, 
  Calendar, 
  Link as LinkIcon, 
  FileText, 
  Bookmark, 
  Flag, 
  Tag 
} from 'lucide-react';

interface OpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityInput) => Promise<void>;
  initialData?: Opportunity | null;
  title?: string;
}

const CATEGORIES: OpportunityCategory[] = [
  'Hackathon',
  'Internship',
  'Scholarship',
  'Certification',
  'Open Source',
];

const STATUSES: ApplicationStatus[] = [
  'Interested',
  'Planning',
  'Applied',
  'Shortlisted',
  'Selected',
  'Rejected',
];

const PRIORITIES: OpportunityPriority[] = ['Low', 'Medium', 'High'];

export const OpportunityForm: React.FC<OpportunityFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [formData, setFormData] = useState<OpportunityInput>({
    userId: '',
    title: '',
    organization: '',
    category: 'Hackathon',
    description: '',
    applicationUrl: '',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0],
    status: 'Interested',
    priority: 'Medium',
    notes: '',
    isSaved: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        userId: initialData.userId,
        title: initialData.title,
        organization: initialData.organization,
        category: initialData.category,
        description: initialData.description || '',
        applicationUrl: initialData.applicationUrl || '',
        deadline: initialData.deadline ? initialData.deadline.split('T')[0] : '',
        status: initialData.status,
        priority: initialData.priority,
        notes: initialData.notes || '',
        isSaved: Boolean(initialData.isSaved),
      });
    } else {
      setFormData({
        userId: '',
        title: '',
        organization: '',
        category: 'Hackathon',
        description: '',
        applicationUrl: '',
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0],
        status: 'Interested',
        priority: 'Medium',
        notes: '',
        isSaved: false,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization name is required';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline date is required';
    }
    if (formData.applicationUrl.trim()) {
      try {
        new URL(formData.applicationUrl.trim());
      } catch {
        newErrors.applicationUrl = 'Please enter a valid URL (e.g. https://example.com)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to save opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || (initialData ? 'Edit Opportunity' : 'Add New Opportunity')}
      subtitle={initialData ? 'Update your opportunity details and notes' : 'Track a new hackathon, internship, scholarship, or open source program'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
            {errors.form}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Opportunity Title *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Google Summer of Code 2026, MLH Local Hack Day"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
        </div>

        {/* Organization & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Organization *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Google, Appwrite, Stripe, NASA"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.organization && <p className="text-xs text-rose-400 mt-1">{errors.organization}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as OpportunityCategory })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deadline & Application URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Application Deadline *
            </label>
            <input
              type="date"
              required
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.deadline && <p className="text-xs text-rose-400 mt-1">{errors.deadline}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Application URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.applicationUrl}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {errors.applicationUrl && <p className="text-xs text-rose-400 mt-1">{errors.applicationUrl}</p>}
          </div>
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Current Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as OpportunityPriority })}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Key highlights, eligibility requirements, stipend, tracks..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Personal Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Personal Notes & Checklist
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Ask prof for recommendation letter, polish resume, study graph algorithms..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Bookmark checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isSaved"
            checked={formData.isSaved}
            onChange={(e) => setFormData({ ...formData, isSaved: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
          />
          <label htmlFor="isSaved" className="text-xs sm:text-sm text-slate-300 cursor-pointer select-none">
            Save / Bookmark this opportunity for quick access
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Opportunity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
