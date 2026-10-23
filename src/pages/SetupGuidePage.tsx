import React, { useState } from 'react';
import { 
  testAppwriteConnection, 
  APPWRITE_ENDPOINT, 
  APPWRITE_PROJECT_ID, 
  APPWRITE_DATABASE_ID, 
  APPWRITE_TABLE_ID 
} from '../lib/appwrite';
import { Button } from '../components/common/Button';
import { 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

export const SetupGuidePage: React.FC = () => {
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    details?: any;
  }>({
    tested: false,
    success: false,
    message: '',
  });
  const [isTesting, setIsTesting] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSample = `# Appwrite Cloud / Self-hosted endpoint
VITE_APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT}

# Your Appwrite Project ID (from Appwrite Console Overview)
VITE_APPWRITE_PROJECT_ID=${APPWRITE_PROJECT_ID || 'your_appwrite_project_id'}

# Database ID (e.g. skilltrack_db)
VITE_APPWRITE_DATABASE_ID=${APPWRITE_DATABASE_ID}

# Table / Collection ID (e.g. opportunities)
VITE_APPWRITE_TABLE_ID=${APPWRITE_TABLE_ID}
`;

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await testAppwriteConnection();
      setTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        details: res.details,
      });
    } catch (err: any) {
      setTestResult({
        tested: true,
        success: false,
        message: err?.message || 'Connection test encountered an error',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const schemaAttributes = [
    { key: 'userId', type: 'String', size: 255, required: true, desc: 'Owner user ID for row security' },
    { key: 'title', type: 'String', size: 255, required: true, desc: 'Opportunity or hackathon title' },
    { key: 'organization', type: 'String', size: 255, required: true, desc: 'Host entity (e.g. Google, MLH)' },
    { key: 'category', type: 'String', size: 50, required: true, desc: 'Hackathon, Internship, Scholarship, etc.' },
    { key: 'description', type: 'String', size: 5000, required: false, desc: 'Detailed program description' },
    { key: 'applicationUrl', type: 'String', size: 2048, required: false, desc: 'Direct link to apply' },
    { key: 'deadline', type: 'String', size: 50, required: true, desc: 'Deadline ISO date YYYY-MM-DD' },
    { key: 'status', type: 'String', size: 50, required: true, desc: 'Interested, Planning, Applied, Selected, etc.' },
    { key: 'priority', type: 'String', size: 50, required: true, desc: 'Low, Medium, or High' },
    { key: 'notes', type: 'String', size: 5000, required: false, desc: 'Personal checklist & interview notes' },
    { key: 'isSaved', type: 'Boolean', size: '-', required: true, desc: 'Bookmark flag (default: false)' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Appwrite Databases Hackathon 2026 Documentation</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-indigo-400" />
          <span>Appwrite TablesDB Integration Guide</span>
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          SkillTrack uses <strong>Appwrite TablesDB</strong> as its primary database. Every user has isolated private records protected by document-level permissions. Follow the instructions below to configure your Appwrite project in under 3 minutes.
        </p>
      </div>

      {/* Live Connection Diagnostics Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Live Connection Diagnostics</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Probe your current Appwrite endpoint and project configuration
            </p>
          </div>

          <Button
            onClick={handleTestConnection}
            isLoading={isTesting}
            icon={<RefreshCw className={cn('w-4 h-4', isTesting && 'animate-spin')} />}
          >
            Test Appwrite Connection
          </Button>
        </div>

        {/* Current status display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Endpoint</span>
            <code className="text-slate-300 font-mono break-all">{APPWRITE_ENDPOINT}</code>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Project ID</span>
            <code className="text-indigo-300 font-mono break-all">
              {APPWRITE_PROJECT_ID || 'Not set in .env'}
            </code>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Database ID</span>
            <code className="text-slate-300 font-mono break-all">{APPWRITE_DATABASE_ID}</code>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-semibold">Table / Collection ID</span>
            <code className="text-slate-300 font-mono break-all">{APPWRITE_TABLE_ID}</code>
          </div>
        </div>

        {/* Test Result Banner */}
        {testResult.tested && (
          <div
            className={cn(
              'mt-4 p-4 rounded-xl border flex items-start gap-3 text-sm animate-fade-in',
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
            )}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{testResult.success ? 'Appwrite Connection Verified!' : 'Connection Check Warning'}</p>
              <p className="text-xs mt-1 leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Step 1: Environment Variables */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
            <span>Configure Environment Variables (<code>.env</code>)</span>
          </h3>

          <button
            type="button"
            onClick={handleCopyEnv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEnv ? 'Copied!' : 'Copy .env snippet'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Create a file named <code>.env</code> in the project root directory (copied from <code>.env.example</code>) and insert your project credentials:
        </p>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto">
          {envSample}
        </pre>
      </div>

      {/* Step 2: Database and Table Setup in Appwrite Console */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
          <span>Create Database & Table in Appwrite Console</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
            <span className="font-bold text-indigo-400">A.</span>
            <div>
              <p className="font-semibold text-white">Create Database:</p>
              <p className="text-slate-400 mt-0.5">
                Go to <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Appwrite Cloud Console</a> &gt; <strong>Databases</strong> &gt; Click <strong>Create database</strong>. Set Database ID to <code>skilltrack_db</code> (or the ID set in your <code>.env</code>).
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
            <span className="font-bold text-indigo-400">B.</span>
            <div>
              <p className="font-semibold text-white">Create Table / Collection:</p>
              <p className="text-slate-400 mt-0.5">
                Inside the database, click <strong>Create Table</strong> (or Create Collection). Name it <code>Opportunities</code> and set Table ID to <code>opportunities</code>.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start gap-3">
            <span className="font-bold text-indigo-400">C.</span>
            <div>
              <p className="font-semibold text-white">Enable Document Security & Permissions:</p>
              <p className="text-slate-400 mt-0.5">
                Go to Table Settings &gt; <strong>Permissions</strong>:
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-400">
                <li>Toggle <strong>Document Security</strong> to <strong className="text-emerald-400">Enabled</strong> (ensures each user only accesses their own documents).</li>
                <li>Under Collection/Table Roles, add <strong>Users</strong> (any logged in user) and grant <strong>Create</strong> permission.</li>
                <li>When documents are inserted, SkillTrack automatically attaches <code>Permission.read(Role.user(userId))</code>, <code>Permission.update(Role.user(userId))</code>, and <code>Permission.delete(Role.user(userId))</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Required Schema Columns */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
          <span>Table Schema & Attributes Specification</span>
        </h3>

        <p className="text-xs text-slate-400">
          In your Appwrite Console under Table <code>opportunities</code> &gt; <strong>Attributes</strong>, create the following 11 attributes:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Attribute Key</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Type</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Size</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Required</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {schemaAttributes.map((attr) => (
                <tr key={attr.key} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-indigo-300 font-bold">{attr.key}</td>
                  <td className="py-2.5 px-3 text-slate-400">{attr.type}</td>
                  <td className="py-2.5 px-3 text-slate-500">{attr.size}</td>
                  <td className="py-2.5 px-3">
                    {attr.required ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">{attr.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 4: Web Platform CORS Setup */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">4</span>
          <span>Add Web Platform in Appwrite Overview</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
          <p>
            In Appwrite Console &gt; Project Overview &gt; <strong>Integrate with your server or client</strong> &gt; Click <strong>Web App</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300">
            <li><strong>Name:</strong> <code>SkillTrack Web</code></li>
            <li><strong>Hostname for Local Dev:</strong> <code>localhost</code> (allows port 5173 / Vite development)</li>
            <li><strong>Hostname for Production:</strong> Add your Vercel deployment domain (e.g. <code>skilltrack.vercel.app</code>)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
