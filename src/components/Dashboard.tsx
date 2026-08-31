import React from 'react';
import { NavView } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Video,
  FileText,
  Code,
  Flame,
  Award,
  TrendingUp,
  BarChart2,
  Calendar,
  Clock,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Target,
  Zap,
  ChevronRight,
  Play
} from 'lucide-react';

interface DashboardProps {
  setCurrentView: (view: NavView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentView }) => {
  const { user, evaluationHistory } = useAuth();

  const latestReport = evaluationHistory[0];
  const readinessScore = latestReport ? latestReport.overallScore : 88;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white  rounded-3xl border border-slate-200  p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 ">
            Welcome back, {user?.name || 'Alex Mercer'}
          </h1>
          <p className="text-sm text-slate-500 ">
            Targeting <span className="font-semibold text-slate-700 ">{user?.dreamJob || 'Software Engineer'}</span> at{' '}
            <span className="font-semibold text-indigo-600 ">{user?.targetCompany || 'Google'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 bg-slate-100  px-4 py-2 rounded-full">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-600  tracking-wider uppercase">
              AI AGENT ONLINE
            </span>
          </div>

          <button
            onClick={() => setCurrentView('interview-setup')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200  transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" /> Start New Interview
          </button>
        </div>
      </div>

      {/* Top Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento Card 1: Score Summary */}
        <div className="md:col-span-4 bg-white  rounded-3xl border border-slate-200  p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Average Readiness
            </h3>
            <p className="text-4xl font-black text-slate-900  mt-2">
              {readinessScore}<span className="text-lg text-slate-400 font-medium">/100</span>
            </p>
          </div>

          <div className="mt-6 flex gap-2 items-end">
            <div className="w-2.5 bg-indigo-200  h-8 rounded-t-sm" />
            <div className="w-2.5 bg-indigo-300  h-12 rounded-t-sm" />
            <div className="w-2.5 bg-indigo-400  h-10 rounded-t-sm" />
            <div className="w-2.5 bg-indigo-500  h-16 rounded-t-sm" />
            <div className="w-2.5 bg-indigo-600  h-20 rounded-t-sm" />
            <div className="ml-3">
              <p className="text-emerald-600  text-xs font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12%
              </p>
              <p className="text-slate-400 text-[10px]">from last week</p>
            </div>
          </div>
        </div>

        {/* Bento Card 2: Resume Intelligence */}
        <div className="md:col-span-5 bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
              Resume Intelligence
            </h3>
            <p className="text-lg font-bold mt-2">
              {user?.resumeFileName || 'Alex_Mercer_Software_Engineer_Resume.pdf'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Skills Match</p>
                <p className="text-xl font-bold text-emerald-400">92%</p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Keyword Density</p>
                <p className="text-xl font-bold text-indigo-300">High</p>
              </div>
            </div>
          </div>

          <div className="mt-4 relative z-10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Target: {user?.targetCompany || 'Google'}</span>
            <button
              onClick={() => setCurrentView('resume-analyzer')}
              className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
            >
              Analyze Resume <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Bento Card 3: Next Session */}
        <div className="md:col-span-3 bg-white  rounded-3xl border border-slate-200  p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Next Session
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50  text-amber-600  rounded-2xl flex flex-col items-center justify-center font-bold text-xs shrink-0">
                <span className="leading-tight">MAY</span>
                <span className="text-base font-black leading-none">24</span>
              </div>
              <div>
                <p className="font-bold text-slate-800  text-sm">Google Technical Mock</p>
                <p className="text-[11px] text-slate-500">2:00 PM • Data Structures</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 bg-slate-100  rounded-full text-[10px] font-bold text-slate-600  uppercase tracking-wider">
              RECURSION
            </span>
            <span className="px-2.5 py-1 bg-slate-100  rounded-full text-[10px] font-bold text-slate-600  uppercase tracking-wider">
              DYNAMIC PROG.
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView('interview-setup')}
          className="p-5 rounded-2xl bg-white  border border-slate-200  hover:border-indigo-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50  text-indigo-600  flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">MOCK INTERVIEW</p>
          <h3 className="text-sm font-bold text-slate-800  mt-1 flex items-center justify-between">
            AI Interview Room
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </h3>
        </button>

        <button
          onClick={() => setCurrentView('resume-analyzer')}
          className="p-5 rounded-2xl bg-white  border border-slate-200  hover:border-blue-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50  text-blue-600  flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">RESUME LAB</p>
          <h3 className="text-sm font-bold text-slate-800  mt-1 flex items-center justify-between">
            ATS Match Engine
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </h3>
        </button>

        <button
          onClick={() => setCurrentView('coding-round')}
          className="p-5 rounded-2xl bg-white  border border-slate-200  hover:border-amber-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50  text-amber-600  flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Code className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">CODING ROUND</p>
          <h3 className="text-sm font-bold text-slate-800  mt-1 flex items-center justify-between">
            Monaco Sandbox
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
          </h3>
        </button>

        <button
          onClick={() => setCurrentView('challenges')}
          className="p-5 rounded-2xl bg-white  border border-slate-200  hover:border-rose-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50  text-rose-600  flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">PRACTICE HUB</p>
          <h3 className="text-sm font-bold text-slate-800  mt-1 flex items-center justify-between">
            Flashcards & XP
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
          </h3>
        </button>
      </div>

      {/* Main Bento Grid: Skill Radar & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Expertise Radar Bento Card */}
        <div className="md:col-span-4 bg-white  rounded-3xl border border-slate-200  p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest w-full mb-6">
            Expertise Radar
          </h3>

          <div className="relative w-44 h-44 my-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="#e2e8f0" strokeWidth="0.5" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="#e2e8f0" strokeWidth="0.5" />
              <polygon
                points="50,15 80,40 70,75 30,80 20,45"
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#6366f1"
                strokeWidth="2"
              />
            </svg>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">
              Logic
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 uppercase">
              Behavior
            </span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
              Coding
            </span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
              Speech
            </span>
          </div>

          <div className="mt-auto w-full grid grid-cols-2 gap-2 pt-4">
            <div className="p-3 bg-slate-50  rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Top Strength</p>
              <p className="text-xs font-bold text-indigo-600  truncate">
                Logical Flow
              </p>
            </div>
            <div className="p-3 bg-slate-50  rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Focus Area</p>
              <p className="text-xs font-bold text-amber-600  truncate">
                Filler Words
              </p>
            </div>
          </div>
        </div>

        {/* Interview History Bento Card */}
        <div className="md:col-span-8 bg-white  rounded-3xl border border-slate-200  p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Recent Performance
            </h3>
            <button
              onClick={() => setCurrentView('analytics')}
              className="text-indigo-600  text-xs font-bold hover:underline"
            >
              View Detailed Analytics
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                company: 'Google',
                title: 'Google - Senior Frontend Mock',
                type: 'Technical • 45 mins • Yesterday',
                score: '88%',
                tag: 'EXCELLENT',
                color: 'bg-blue-100 text-blue-600  '
              },
              {
                company: 'Amazon',
                title: 'Amazon - Leadership Principles',
                type: 'Behavioral • 30 mins • 3 days ago',
                score: '72%',
                tag: 'AVERAGE',
                color: 'bg-amber-100 text-amber-600  '
              },
              {
                company: 'Meta',
                title: 'Meta - Product Strategy Round',
                type: 'Management • 60 mins • Last Week',
                score: '91%',
                tag: 'SUPERIOR',
                color: 'bg-indigo-100 text-indigo-600  '
              },
              {
                company: 'Code',
                title: 'Coding Lab - Graph Algorithms',
                type: 'Technical • 20 mins • May 12',
                score: '85%',
                tag: 'IMPROVING',
                color: 'bg-emerald-100 text-emerald-600  '
              }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentView('evaluation')}
                className="flex items-center p-4 hover:bg-slate-50  rounded-2xl transition-colors border border-transparent hover:border-slate-100  cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${item.color}`}
                >
                  {item.company.charAt(0)}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-bold text-slate-800 ">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-800 ">{item.score}</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
