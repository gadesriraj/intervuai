import React, { useMemo } from 'react';
import { NavView } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Video,
  FileText,
  Code,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface DashboardProps {
  setCurrentView: (view: NavView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setCurrentView,
}) => {
  const {
    user,
    evaluationHistory,
  } = useAuth();

  /*
   * -------------------------------------------------------
   * REAL DASHBOARD DATA
   * -------------------------------------------------------
   */

  const reports = Array.isArray(evaluationHistory)
    ? evaluationHistory
    : [];

  const totalInterviews = reports.length;

  const averageScore =
    totalInterviews > 0
      ? Math.round(
          reports.reduce(
            (sum, report) =>
              sum + Number(report.overallScore || 0),
            0
          ) / totalInterviews
        )
      : 0;

  const bestScore =
    totalInterviews > 0
      ? Math.max(
          ...reports.map((report) =>
            Number(report.overallScore || 0)
          )
        )
      : 0;

  const latestReport = reports[0];

  const latestScore = latestReport
    ? Number(latestReport.overallScore || 0)
    : 0;

  /*
   * Resume data
   */

  const resumeScore = Number(
    (user as any)?.resumeScore || 0
  );

  const skills = Array.isArray((user as any)?.skills)
    ? (user as any).skills
    : [];

  /*
   * Score trend
   */

  const scoreTrend = useMemo(() => {
    if (reports.length < 2) return 0;

    const current = Number(
      reports[0]?.overallScore || 0
    );

    const previous = Number(
      reports[1]?.overallScore || 0
    );

    return current - previous;
  }, [reports]);

  /*
   * Recent reports
   */

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-6 pb-12">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name || 'User'}
          </h1>

          <p className="text-sm text-slate-500">
            Targeting{' '}
            <span className="font-semibold text-slate-700">
              {user?.dreamJob || 'your profile'}
            </span>{' '}
            {user?.targetCompany && (
              <>
                at{' '}
                <span className="font-semibold text-indigo-600">
                  {user.targetCompany}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">

          <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-2 rounded-full">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />

            <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
              AI AGENT ONLINE
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentView('interview-setup')
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Start New Interview
          </button>

        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* READINESS */}

        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Average Readiness
          </h3>

        <p className="text-4xl font-black text-slate-900 mt-2">
  {totalInterviews > 0 ? (
    <>
      {averageScore}
      <span className="text-lg text-slate-400 font-medium">
        /100
      </span>
    </>
  ) : (
    <span className="text-2xl text-slate-400">
      Not available
    </span>
  )}
</p>

          <div className="mt-5 flex items-center gap-2">

            {scoreTrend > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-emerald-600" />

                <span className="text-xs font-bold text-emerald-600">
                  +{scoreTrend} points
                </span>
              </>
            ) : scoreTrend < 0 ? (
              <span className="text-xs font-bold text-rose-600">
                {scoreTrend} points
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400">
                No previous comparison
              </span>
            )}

          </div>

          <p className="text-[10px] text-slate-400 mt-1">
  {totalInterviews > 0
    ? 'Based on completed interviews'
    : 'Complete an interview to calculate readiness'}
</p>

        </div>

        {/* RESUME */}

        <div className="md:col-span-5 bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">

          <div className="relative z-10">

            <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
              Resume Intelligence
            </h3>

            <p className="text-lg font-bold mt-2 truncate">
              {(user as any)?.resumeFileName ||
                'No resume analyzed yet'}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">

              <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                  Resume Score
                </p>

                <p className="text-xl font-bold text-emerald-400">
                  {resumeScore > 0
                    ? `${resumeScore}%`
                    : 'Resume not analyzed Yet'}
                </p>
              </div>

              <div className="bg-white/10 p-3 rounded-2xl">
                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">
                  Skills
                </p>

                <p className="text-xl font-bold text-indigo-300">
                  {skills.length > 0 ? skills.length : '—'}
                </p>
              </div>

            </div>
          </div>

          <div className="mt-4 relative z-10 flex items-center justify-between">

            <span className="text-xs text-slate-400">
              {user?.targetCompany
                ? `Target: ${user.targetCompany}`
                : 'No target company set'}
            </span>

            <button
              onClick={() =>
                setCurrentView('resume-analyzer')
              }
              className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1"
            >
              Analyze Resume
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

          </div>

          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        </div>

        {/* INTERVIEW STATS */}

        <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Interview Stats
          </h3>

          <div className="mt-4 space-y-4">

            <div>
              <p className="text-2xl font-black text-slate-900">
                {totalInterviews}
              </p>

              <p className="text-[11px] text-slate-400">
                Interviews completed
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-indigo-600">
  {totalInterviews > 0 ? bestScore : '—'}
</p>

              <p className="text-[11px] text-slate-400">
                Best score
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <button
          onClick={() =>
            setCurrentView('interview-setup')
          }
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5" />
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            MOCK INTERVIEW
          </p>

          <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-between">
            AI Interview Room
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </h3>
        </button>

        <button
          onClick={() =>
            setCurrentView('resume-analyzer')
          }
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            RESUME LAB
          </p>

          <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-between">
            Resume Analyzer
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </h3>
        </button>

        <button
          onClick={() =>
            setCurrentView('coding-round')
          }
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Code className="w-5 h-5" />
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            CODING ROUND
          </p>

          <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-between">
            Coding Sandbox
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
          </h3>
        </button>

        <button
          onClick={() =>
            setCurrentView('challenges')
          }
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-500 shadow-sm transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            PRACTICE HUB
          </p>

          <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-between">
            Flashcards & Practice
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
          </h3>
        </button>

      </div>

      {/* =====================================================
          PERFORMANCE
      ====================================================== */}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Recent Performance
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Your latest completed interview evaluations
            </p>
          </div>

          <button
            onClick={() =>
              setCurrentView('analytics')
            }
            className="text-indigo-600 text-xs font-bold hover:underline"
          >
            View Analytics
          </button>

        </div>

        {recentReports.length === 0 ? (

          <div className="py-12 text-center">

            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />

            <p className="font-bold text-slate-600">
              No interviews completed yet
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Complete your first mock interview to see
              your performance here.
            </p>

            <button
              onClick={() =>
                setCurrentView('interview-setup')
              }
              className="mt-4 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Start Interview
            </button>

          </div>

        ) : (

          <div className="space-y-3">

            {recentReports.map(
              (report: any, idx: number) => {

                const score = Number(
                  report.overallScore || 0
                );

      const company =
  report.config?.company || '';

const role =
  report.config?.role || 'Interview';

const roundType =
  report.config?.roundType || '';
                return (
                  <div
                    key={
                      report.id ||
                      report.createdAt ||
                      idx
                    }
                    onClick={() =>
                      setCurrentView('evaluation')
                    }
                    className="flex items-center p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                  >

                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {company
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="ml-4 flex-1 min-w-0">

                      <p className="text-sm font-bold text-slate-800 truncate">
                        {company ? `${company} - ${role}` : role}
                      </p>

                    {roundType && (
  <p className="text-xs text-slate-400">
    {roundType}
  </p>
)}  

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-black text-slate-800">
                        {score}%
                      </p>

                      <p className="text-[10px] text-indigo-500 font-bold uppercase">
                        {score >= 85
                          ? 'EXCELLENT'
                          : score >= 70
                          ? 'GOOD'
                          : score >= 50
                          ? 'IMPROVING'
                          : 'NEEDS WORK'}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          CURRENT STATUS
      ====================================================== */}

      {latestReport && (
        <div className="text-xs text-slate-400 text-center">
          Latest interview score:{' '}
          <span className="font-bold text-slate-600">
            {latestScore}/100
          </span>
        </div>
      )}

    </div>
  );
};