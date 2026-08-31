import React from 'react';
import { NavView } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BarChart2,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Filter,
  PieChart as PieIcon,
  Calendar
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface AnalyticsViewProps {
  setCurrentView: (view: NavView) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ setCurrentView }) => {
  const { evaluationHistory } = useAuth();

  const trendData = evaluationHistory.map((rep, idx) => ({
    session: `Session ${evaluationHistory.length - idx}`,
    score: rep.overallScore,
    technical: rep.metrics.technicalKnowledge,
    communication: rep.metrics.communication,
    confidence: rep.metrics.confidence,
    date: new Date(rep.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
  })).reverse();

  const skillBarData = [
    { skill: 'Technical', score: 86 },
    { skill: 'Communication', score: 92 },
    { skill: 'Confidence', score: 85 },
    { skill: 'Problem Solving', score: 89 },
    { skill: 'STAR Method', score: 82 },
    { skill: 'System Design', score: 88 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900  flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-indigo-500" /> Performance Analytics & Progress Trends
        </h1>
        <p className="text-xs text-slate-500  mt-1">
          Historical breakdown of interview readiness scores, skill competencies, and session trends.
        </p>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Mock Rounds</p>
          <p className="text-2xl font-extrabold text-slate-900  mt-1">{evaluationHistory.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Interview Score</p>
          <p className="text-2xl font-extrabold text-indigo-600  mt-1">
            {Math.round(evaluationHistory.reduce((acc, r) => acc + r.overallScore, 0) / (evaluationHistory.length || 1))}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Score Achieved</p>
          <p className="text-2xl font-extrabold text-emerald-600  mt-1">
            {Math.max(...evaluationHistory.map(r => r.overallScore), 0)}%
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Improvement Rate</p>
          <p className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-5 h-5" /> +14%
          </p>
        </div>
      </div>

      {/* Recharts Performance Line Chart */}
      <div className="p-6 rounded-3xl bg-white  border border-slate-200  shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Score Improvement Progression
        </h3>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} name="Overall Score" />
              <Line type="monotone" dataKey="technical" stroke="#3b82f6" strokeWidth={2} name="Technical" />
              <Line type="monotone" dataKey="communication" stroke="#10b981" strokeWidth={2} name="Communication" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Skill Competencies */}
      <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-indigo-500" /> Core Skill Competency Distribution
        </h3>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillBarData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="skill" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} name="Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session History Table */}
      <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" /> Complete Mock Session Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 ">
            <thead className="bg-slate-50  uppercase tracking-wider text-[10px] text-slate-500 font-bold border-b border-slate-200 ">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Company & Role</th>
                <th className="p-3">Round Type</th>
                <th className="p-3">Difficulty</th>
                <th className="p-3">Overall Score</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100  font-medium">
              {evaluationHistory.map((rep, idx) => (
                <tr key={rep.id || idx} className="hover:bg-slate-50  transition-colors">
                  <td className="p-3 text-slate-500">
                    {new Date(rep.completedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-bold text-slate-900 ">
                    {rep.config.company} — {rep.config.role}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50  text-indigo-700  border border-indigo-200  font-semibold text-[11px]">
                      {rep.config.roundType}
                    </span>
                  </td>
                  <td className="p-3">{rep.config.difficulty}</td>
                  <td className="p-3 font-extrabold text-indigo-600 ">
                    {rep.overallScore}%
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setCurrentView('evaluation')}
                      className="text-xs font-bold text-indigo-600  hover:underline flex items-center gap-1"
                    >
                      View Report <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
