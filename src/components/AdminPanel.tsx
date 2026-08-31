import React, { useState } from 'react';
import { NavView } from '../types';
import {
  ShieldCheck,
  Users,
  Building,
  Plus,
  Trash2,
  Edit,
  Download,
  BarChart,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

interface AdminPanelProps {
  setCurrentView: (view: NavView) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<'cohorts' | 'questions'>('cohorts');

  const [questionBank, setQuestionBank] = useState([
    { id: 'q1', text: 'Explain how garbage collection works in Java vs V8 JavaScript engine.', company: 'Google', round: 'Technical' },
    { id: 'q2', text: 'Describe how Amazon DynamoDB handles eventual consistency and vector clocks.', company: 'Amazon', round: 'System Design' },
    { id: 'q3', text: 'Tell me about a time when you had to balance conflicting stakeholder priorities.', company: 'Deloitte', round: 'Behavioral' }
  ]);

  const [newQText, setNewQText] = useState('');
  const [newQCompany, setNewQCompany] = useState('Google');
  const [newQRound, setNewQRound] = useState('Technical');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;
    setQuestionBank([
      ...questionBank,
      {
        id: 'q_' + Date.now(),
        text: newQText,
        company: newQCompany,
        round: newQRound
      }
    ]);
    setNewQText('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestionBank(questionBank.filter(q => q.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" /> University & Enterprise Admin Portal
          </h1>
          <p className="text-xs text-slate-500  mt-1">
            Manage student cohorts, placement cell rubrics, and custom company interview question banks.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export Cohort Report
        </button>
      </div>

      {/* Admin Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Candidates</p>
          <p className="text-2xl font-extrabold text-slate-900  mt-1">128</p>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Cohort Placement Pass %</p>
          <p className="text-2xl font-extrabold text-emerald-500 mt-1">88.4%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Custom Bank Prompts</p>
          <p className="text-2xl font-extrabold text-indigo-500 mt-1">{questionBank.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white  border border-slate-200  shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Mock Session Hours</p>
          <p className="text-2xl font-extrabold text-blue-500 mt-1">450h</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200  pb-2">
        <button
          onClick={() => setActiveTab('cohorts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cohorts'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600  hover:bg-slate-100 '
          }`}
        >
          <Users className="w-4 h-4" /> Student Cohort Roster
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600  hover:bg-slate-100 '
          }`}
        >
          <Building className="w-4 h-4" /> Question Bank Manager
        </button>
      </div>

      {/* Cohorts Tab */}
      {activeTab === 'cohorts' && (
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> CS Batch 2025 Placement Cohort
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 ">
              <thead className="bg-slate-50  uppercase tracking-wider text-[10px] text-slate-500 font-bold border-b border-slate-200 ">
                <tr>
                  <th className="p-3">Candidate Name</th>
                  <th className="p-3">College & Degree</th>
                  <th className="p-3">Target Company</th>
                  <th className="p-3">Mocks Completed</th>
                  <th className="p-3">Readiness Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100  font-medium">
                {[
                  { name: 'Alex Rivera', college: 'Stanford B.S. CS', company: 'Google', mocks: 12, score: 92, status: 'Interview Ready' },
                  { name: 'Sarah Chen', college: 'MIT M.S. CS', company: 'Amazon', mocks: 9, score: 88, status: 'Interview Ready' },
                  { name: 'Michael Vance', college: 'Berkeley B.S. EECS', company: 'Microsoft', mocks: 5, score: 76, status: 'In Practice' },
                  { name: 'Elena Rostova', college: 'CMU B.S. CS', company: 'Meta', mocks: 8, score: 85, status: 'Interview Ready' }
                ].map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 ">
                    <td className="p-3 font-bold text-slate-900 ">{s.name}</td>
                    <td className="p-3 text-slate-500">{s.college}</td>
                    <td className="p-3 font-semibold text-indigo-600 ">{s.company}</td>
                    <td className="p-3">{s.mocks} Rounds</td>
                    <td className="p-3 font-extrabold text-emerald-600 ">{s.score}%</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50  text-emerald-700  border border-emerald-200  text-[10px] font-bold">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Question Bank Manager Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Add Question Form */}
          <form onSubmit={handleAddQuestion} className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" /> Add Custom Interview Question Prompt
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  value={newQText}
                  onChange={e => setNewQText(e.target.value)}
                  placeholder="Enter custom technical/system design prompt..."
                  className="w-full px-3.5 py-2.5 bg-slate-50  border border-slate-200  rounded-xl text-xs text-slate-900 "
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={newQCompany}
                  onChange={e => setNewQCompany(e.target.value)}
                  className="w-1/2 px-3 py-2 bg-slate-50  border border-slate-200  rounded-xl text-xs text-slate-900 "
                >
                  <option value="Google">Google</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Deloitte">Deloitte</option>
                </select>

                <button
                  type="submit"
                  className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Add Question
                </button>
              </div>
            </div>
          </form>

          {/* List of Custom Questions */}
          <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 ">
              Active Enterprise Question Bank ({questionBank.length})
            </h3>

            <div className="space-y-2">
              {questionBank.map(q => (
                <div key={q.id} className="p-3.5 rounded-xl bg-slate-50  border border-slate-200  flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-indigo-600  mr-2">[{q.company}]</span>
                    <span className="text-slate-800 ">{q.text}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
