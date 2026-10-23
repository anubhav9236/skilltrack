import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isAppwriteConfigured } from '../lib/appwrite';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { 
  Target, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, enterDemoMode, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const configured = isAppwriteConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      setFormError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    enterDemoMode();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background aesthetic gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 mb-4 animate-bounce-slow">
            <Target className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            SkillTrack
          </h1>
          <p className="mt-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Appwrite TablesDB Hackathon 2026
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Student Opportunity & Deadline Tracking Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 glass-panel py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl relative">
          {/* Status badge */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
            <span className="text-slate-400">Database Engine:</span>
            {configured ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Appwrite Cloud Live</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-950/50 border border-amber-800/60 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Demo Ready</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(formError || error) && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{formError || error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isSubmitting}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Sign In with Appwrite
            </Button>
          </form>

          {/* Quick Demo Mode Login */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <div className="text-center">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Instant Reviewer Access
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full bg-slate-800/80 hover:bg-slate-750 border-indigo-900/50 text-indigo-300"
              onClick={handleDemoLogin}
              icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
            >
              Explore in Sandbox / Demo Mode
            </Button>
          </div>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
