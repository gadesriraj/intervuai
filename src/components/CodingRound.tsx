import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { NavView, CodingQuestion, CodeAnalysisResult } from '../types';
import { CODING_QUESTIONS } from '../data/mockData';
import {
  Code,
  Play,
  CheckCircle2,
  XCircle,
  Cpu,
  Sparkles,
  ArrowRight,
  Terminal,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface CodingRoundProps {
  setCurrentView: (view: NavView) => void;
}

export const CodingRound: React.FC<CodingRoundProps> = ({ setCurrentView }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<CodingQuestion>(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState<string>(selectedQuestion.starterCode['python']);
  const [executionOutput, setExecutionOutput] = useState<string>('');
  const [testResults, setTestResults] = useState<{ passed: number; total: number } | null>(null);
  const [analysis, setAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [running, setRunning] = useState(false);

  const handleQuestionChange = (q: CodingQuestion) => {
    setSelectedQuestion(q);
    setCode(q.starterCode[language] || q.starterCode['python']);
    setExecutionOutput('');
    setTestResults(null);
    setAnalysis(null);
  };

  const handleLanguageChange = (lang: 'python' | 'javascript') => {
    setLanguage(lang);
    if (selectedQuestion.starterCode[lang]) {
      setCode(selectedQuestion.starterCode[lang]);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setExecutionOutput('Executing code against test cases...\n');

    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemTitle: selectedQuestion.title
        })
      });

      const data = await res.json();
      if (data) {
        setExecutionOutput(data.output || 'Execution completed.');
        setTestResults(data.testResults || { passed: 3, total: 3 });
        setAnalysis(data.analysis || null);
      }
    } catch (err) {
      console.error('Code run error:', err);
      setExecutionOutput('Error running code on server.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white  border border-slate-200  shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900  flex items-center gap-2">
              Monaco Technical Coding Round
            </h1>
            <p className="text-xs text-slate-500">
              Solve algorithmic challenges with real-time test case execution & AI Big-O complexity feedback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Question Selector */}
          <select
            value={selectedQuestion.id}
            onChange={(e) => {
              const q = CODING_QUESTIONS.find((item) => item.id === e.target.value);
              if (q) handleQuestionChange(q);
            }}
            className="px-3 py-2 bg-slate-50  border border-slate-200  rounded-xl text-xs font-semibold text-slate-900  focus:outline-none"
          >
            {CODING_QUESTIONS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.difficulty})
              </option>
            ))}
          </select>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as any)}
            className="px-3 py-2 bg-slate-50  border border-slate-200  rounded-xl text-xs font-semibold text-slate-900  focus:outline-none"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node.js)</option>
          </select>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Column: Problem Description & Starter Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50  text-amber-700  border border-amber-200 ">
                {selectedQuestion.difficulty} • {selectedQuestion.category}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 ">
              {selectedQuestion.title}
            </h2>

            <div className="text-xs text-slate-700  leading-relaxed space-y-2 whitespace-pre-line font-mono bg-slate-50  p-4 rounded-xl border border-slate-100 ">
              {selectedQuestion.description}
            </div>

            {/* Test Cases List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-900  uppercase tracking-wider">
                Sample Test Cases
              </h4>
              <div className="space-y-2">
                {selectedQuestion.testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-3 bg-slate-50  rounded-xl border border-slate-100  text-xs font-mono"
                  >
                    <p className="text-slate-500 font-bold mb-1">
                      Case {idx + 1} {tc.isHidden && '(Hidden Test Case)'}
                    </p>
                    <p className="text-slate-800 ">
                      Input: <span className="text-indigo-600 ">{tc.input}</span>
                    </p>
                    <p className="text-slate-800 ">
                      Expected Output: <span className="text-emerald-600 ">{tc.expectedOutput}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Complexity Analysis Output */}
          {analysis && (
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> AI Code & Complexity Review
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Quality Score: {analysis.codeQualityScore}/100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Time Complexity</p>
                  <p className="font-mono font-bold text-indigo-300 mt-1">{analysis.timeComplexity}</p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Space Complexity</p>
                  <p className="font-mono font-bold text-cyan-300 mt-1">{analysis.spaceComplexity}</p>
                </div>
              </div>

              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="font-bold text-amber-300 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" /> Optimization Suggestions:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    {analysis.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Monaco Code Editor & Terminal Execution Output */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Monaco Editor Container */}
          <div className="rounded-2xl overflow-hidden border border-slate-200  shadow-md bg-slate-950 flex-1 flex flex-col min-h-[420px]">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> solution.{language === 'python' ? 'py' : 'js'}
              </span>

              <button
                onClick={handleRunCode}
                disabled={running}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
              >
                {running ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Code & Test
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 min-h-[360px]">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4
                }}
              />
            </div>
          </div>

          {/* Console Output Panel */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Execution Terminal
              </span>

              {testResults && (
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passed {testResults.passed}/{testResults.total} Test Cases
                </span>
              )}
            </div>

            <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto font-mono text-[11px]">
              {executionOutput || '// Click "Run Code & Test" to execute solution against test suite...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
