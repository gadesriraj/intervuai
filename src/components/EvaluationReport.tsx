import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { NavView, EvaluationReport as IEvaluationReport } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface EvaluationReportProps {
  setCurrentView: (view: NavView) => void;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({
  setCurrentView
}) => {
  const { evaluationHistory } = useAuth();

  const report: IEvaluationReport | undefined = evaluationHistory[0];

  useEffect(() => {
    if (report && report.overallScore >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [report]);

  if (!report) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />

        <h3 className="text-xl font-bold text-slate-900 ">
          No Evaluation Report Found
        </h3>

        <p className="text-xs text-slate-500">
          Please complete a mock interview session first.
        </p>

        <button
          onClick={() => setCurrentView('interview-setup')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Start Mock Interview
        </button>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    window.print();
  };

  const overallScore = Number(report.overallScore ?? 0);
  const passed = overallScore >= 70;

  const metrics = [
    {
      label: 'Technical Knowledge',
      score: report.metrics?.technicalKnowledge ?? 0
    },
    {
      label: 'Communication Tone',
      score: report.metrics?.communication ?? 0
    },
    {
      label: 'Confidence Level',
      score: report.metrics?.confidence ?? 0
    },
    {
      label: 'Grammar & Clarity',
      score: report.metrics?.grammar ?? 0
    },
    {
      label: 'Vocabulary Usage',
      score: report.metrics?.vocabulary ?? 0
    },
    {
      label: 'Problem Solving',
      score: report.metrics?.problemSolving ?? 0
    },
    {
      label: 'Logical Thinking',
      score: report.metrics?.logicalThinking ?? 0
    },
    {
      label: 'Leadership & STAR',
      score: report.metrics?.leadership ?? 0
    },
    {
      label: 'Behavioral Culture',
      score: report.metrics?.behavior ?? 0
    },
    {
      label: 'Speaking Speed (WPM)',
      score: report.metrics?.speakingSpeed ?? 0
    },
    {
      label: 'Filler Words Control',
      score: report.metrics?.fillerWords ?? 0
    },
    {
      label: 'Professionalism',
      score: report.metrics?.professionalism ?? 0
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 print:p-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-500" />
            AI Interview Evaluation Report
          </h1>

          <p className="text-xs text-slate-500  mt-1">
            Session:{' '}
            <span className="font-semibold text-slate-700 ">
              {report.config.company}
            </span>{' '}
            ({report.config.role} — {report.config.roundType} Round)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('interview-setup')}
            className="px-4 py-2 bg-slate-100  hover:bg-slate-200  text-slate-700  font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            Export PDF Report
          </button>
        </div>
      </div>

      {/* Hero Score Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="space-y-2 text-center md:text-left">

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                passed
                  ? 'bg-emerald-950/80 border border-emerald-700/50 text-emerald-300'
                  : 'bg-red-950/80 border border-red-700/50 text-red-300'
              }`}
            >
              {passed ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Interview Passed
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  Interview Needs Improvement
                </>
              )}
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              Overall Score: {overallScore}%
            </h2>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {report.summary}
            </p>
          </div>

          <div className="w-24 h-24 rounded-3xl bg-indigo-900/80 border-2 border-indigo-500/60 flex flex-col items-center justify-center text-white shadow-inner shrink-0">
            <span className="text-3xl font-black">
              {overallScore}
            </span>

            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
              Score
            </span>
          </div>

        </div>
      </div>

      {/* 12 Granular Performance Metrics */}
      <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          12-Dimension Metric Evaluation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

          {metrics.map((m, idx) => {
            const score = Math.max(
              0,
              Math.min(100, Number(m.score) || 0)
            );

            return (
              <div
                key={idx}
                className="p-3 bg-slate-50  rounded-xl border border-slate-100  space-y-1.5"
              >

                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 ">
                    {m.label}
                  </span>

                  <span className="text-indigo-600  font-bold">
                    {score}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-200  rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${score}%`
                    }}
                  />
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* Strengths & Weaknesses Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">

          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600  flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Demonstrated Strengths
          </h3>

          <ul className="space-y-2 text-xs text-slate-700 ">
            {(report.strengths ?? []).map((s, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-xl bg-emerald-50/50  border border-emerald-100  flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>

        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">

          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600  flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Missed Technical Concepts & Gaps
          </h3>

          <ul className="space-y-2 text-xs text-slate-700 ">
            {(report.missedConcepts ?? []).map((m, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-xl bg-amber-50/50  border border-amber-100  flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{m}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* Question-by-Question Detailed Review */}
      <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-6">

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          Question-by-Question Benchmark Review
        </h3>

        <div className="space-y-6">

          {(report.questionReviews ?? []).map((qr, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-50  border border-slate-200  space-y-3 text-xs"
            >

              <div className="flex items-center justify-between border-b border-slate-200  pb-2">

                <span className="font-bold text-slate-900 ">
                  Q{idx + 1}: {qr.question}
                </span>

                <span className="font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100  text-indigo-700  text-[11px]">
                  Score: {qr.score}%
                </span>

              </div>

              <div>
                <p className="font-bold text-slate-500  mb-1">
                  Your Response:
                </p>

                <p className="p-3 bg-white  rounded-lg border border-slate-200  text-slate-800  italic">
                  "{qr.candidateAnswer}"
                </p>
              </div>

              <div>
                <p className="font-bold text-indigo-600  mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ideal Industry Benchmark Answer:
                </p>

                <p className="p-3 bg-indigo-50/50  rounded-lg border border-indigo-100  text-slate-800 ">
                  {qr.idealAnswer}
                </p>
              </div>

              <div className="text-[11px] text-slate-600 ">
                <strong>Feedback:</strong> {qr.feedback}
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* 7-Day Personalized Improvement Plan */}
      <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          Personalized 7-Day Action Plan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

          {(report.improvementPlan ?? []).map((plan, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50  border border-slate-200  space-y-1"
            >

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 ">
                {plan.day}
              </span>

              <p className="text-xs font-semibold text-slate-800  leading-snug">
                {plan.task}
              </p>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};