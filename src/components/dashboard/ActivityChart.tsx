import React, { useState, useMemo } from 'react';
import { Opportunity } from '../../types/database';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { BarChart3, PieChart as PieIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ActivityChartProps {
  opportunities: Opportunity[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ opportunities }) => {
  const [chartType, setChartType] = useState<'category' | 'status'>('category');

  // Compute category data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      Hackathon: 0,
      Internship: 0,
      Scholarship: 0,
      Certification: 0,
      'Open Source': 0,
    };

    opportunities.forEach((opp) => {
      if (counts[opp.category] !== undefined) {
        counts[opp.category]++;
      }
    });

    return [
      { name: 'Hackathon', count: counts.Hackathon, color: '#A855F7' },
      { name: 'Internship', count: counts.Internship, color: '#3B82F6' },
      { name: 'Scholarship', count: counts.Scholarship, color: '#10B981' },
      { name: 'Certification', count: counts.Certification, color: '#6366F1' },
      { name: 'Open Source', count: counts['Open Source'], color: '#EC4899' },
    ];
  }, [opportunities]);

  // Compute status data
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      Interested: 0,
      Planning: 0,
      Applied: 0,
      Shortlisted: 0,
      Selected: 0,
      Rejected: 0,
    };

    opportunities.forEach((opp) => {
      if (counts[opp.status] !== undefined) {
        counts[opp.status]++;
      }
    });

    return [
      { name: 'Interested', value: counts.Interested, color: '#94A3B8' },
      { name: 'Planning', value: counts.Planning, color: '#06B6D4' },
      { name: 'Applied', value: counts.Applied, color: '#3B82F6' },
      { name: 'Shortlisted', value: counts.Shortlisted, color: '#F59E0B' },
      { name: 'Selected', value: counts.Selected, color: '#10B981' },
      { name: 'Rejected', value: counts.Rejected, color: '#EF4444' },
    ].filter(item => item.value > 0);
  }, [opportunities]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-white mb-0.5">{label || payload[0].name}</p>
          <p className="text-indigo-400 font-medium">
            {payload[0].value} {payload[0].value === 1 ? 'opportunity' : 'opportunities'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h4 className="text-base font-bold text-white">Application Pipeline & Breakdown</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time distribution across categories and progress statuses
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="inline-flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('category')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              chartType === 'category'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>By Category</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('status')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              chartType === 'status'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>By Status</span>
          </button>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
          <BarChart3 className="w-8 h-8 mb-2 opacity-50" />
          <span>No opportunities added yet to visualize</span>
        </div>
      ) : chartType === 'category' ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                stroke="#64748B" 
                fontSize={11} 
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis 
                stroke="#64748B" 
                fontSize={11} 
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 w-full">
          {statusData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No status data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
};
