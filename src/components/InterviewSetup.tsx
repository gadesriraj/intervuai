import React, { useState } from 'react';
import { NavView, InterviewConfig, RoundType, DifficultyLevel, InterviewDuration } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Video,
  Building,
  Briefcase,
  Clock,
  Gauge,
  Mic,
  Camera,
  Sparkles,
  Check,
  ArrowRight,
  ShieldAlert,
  Code
} from 'lucide-react';

interface InterviewSetupProps {
  setCurrentView: (view: NavView) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ setCurrentView }) => {
  const { user, setCurrentConfig } = useAuth();

  const [roundType, setRoundType] = useState<RoundType>('Technical');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [duration, setDuration] = useState<InterviewDuration>(20);
  const [company, setCompany] = useState<string>(user?.targetCompany || 'Google');
  const [customCompany, setCustomCompany] = useState('');
  const [role, setRole] = useState<string>(user?.dreamJob || 'Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [useVoice, setUseVoice] = useState(true);
  const [useCamera, setUseCamera] = useState(true);
  const [focusAreas, setFocusAreas] = useState<string[]>([
    'System Design',
    'Data Structures & Algorithms',
    'Behavioral STAR Method'
  ]);

  const activeCompany = company === 'Custom' ? customCompany || 'Custom Firm' : company;
  const activeRole = role === 'Custom' ? customRole || 'Custom Role' : role;

  const handleStartInterview = () => {
    const config: InterviewConfig = {
      id: 'cfg_' + Date.now(),
      roundType,
      difficulty,
      duration,
      company: activeCompany,
      role: activeRole,
      useVoice,
      useCamera,
      focusAreas
    };

    setCurrentConfig(config);

    if (roundType === 'Coding') {
      setCurrentView('coding-round');
    } else {
      setCurrentView('interview-room');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900  flex items-center gap-2">
          <Video className="w-6 h-6 text-emerald-500" /> Configure AI Mock Interview Round
        </h1>
        <p className="text-xs text-slate-500  mt-1">
          Customize the interview loop to mirror your actual upcoming company interview.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Select Round Type */}
        <div className="p-6 rounded-3xl bg-white  border border-slate-200  shadow-sm space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 ">
            1. Select Interview Round Type
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { type: 'Technical', desc: 'Core CS, Architecture & Language Internals' },
              { type: 'Behavioral', desc: 'STAR method, Conflict Resolution, Leadership' },
              { type: 'HR', desc: 'Background, Salary expectations, Culture Fit' },
              { type: 'System Design', desc: 'Scalability, Distributed Systems, Databases' },
              { type: 'Coding', desc: 'Monaco Editor, Data Structures & Algorithms' },
              { type: 'Managerial', desc: 'Project Leadership, Prioritization & Trade-offs' }
            ].map((r) => (
              <button
                key={r.type}
                type="button"
                onClick={() => setRoundType(r.type as RoundType)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  roundType === r.type
                    ? 'border-indigo-600  bg-indigo-50/50  shadow-sm'
                    : 'border-slate-200  hover:border-slate-300  bg-slate-50/50 '
                }`}
              >
                {roundType === r.type && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <p className="text-xs font-bold text-slate-900 ">{r.type}</p>
                <p className="text-[10px] text-slate-500  mt-1 leading-snug">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Target Company & Role */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 ">
            2. Target Company & Role
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" /> Target Company
              </label>
              <select
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50  border border-slate-200  rounded-xl text-xs font-medium text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Google">Google</option>
                <option value="Amazon">Amazon</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Meta">Meta</option>
                <option value="Apple">Apple</option>
                <option value="Infosys">Infosys</option>
                <option value="TCS">TCS</option>
                <option value="Accenture">Accenture</option>
                <option value="Deloitte">Deloitte</option>
                <option value="Custom">Custom Company Name...</option>
              </select>

              {company === 'Custom' && (
                <input
                  type="text"
                  value={customCompany}
                  onChange={e => setCustomCompany(e.target.value)}
                  placeholder="Enter custom company name..."
                  className="mt-2 w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-xs text-slate-900 "
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Target Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50  border border-slate-200  rounded-xl text-xs font-medium text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                <option value="Cloud Architect">Cloud Architect</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Custom">Custom Role...</option>
              </select>

              {role === 'Custom' && (
                <input
                  type="text"
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  placeholder="Enter custom job role title..."
                  className="mt-2 w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-xs text-slate-900 "
                />
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Difficulty & Duration */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 ">
            3. Difficulty & Round Duration
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-indigo-500" /> Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Easy', 'Medium', 'Hard', 'Adaptive'] as DifficultyLevel[]).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      difficulty === d
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50  text-slate-700  border-slate-200  hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Interview Duration
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {([10, 20, 30, 45, 60] as InterviewDuration[]).map(dur => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      duration === dur
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50  text-slate-700  border-slate-200  hover:bg-slate-100'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Environment Settings (Voice & Camera) */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 ">
            4. Voice, Mic & Camera Environment
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="p-3.5 rounded-xl border border-slate-200  bg-slate-50  flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900 ">Voice Output & Microphone</p>
                  <p className="text-[10px] text-slate-500">AI speaks prompts aloud; enables speech-to-text</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useVoice}
                onChange={e => setUseVoice(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            <label className="p-3.5 rounded-xl border border-slate-200  bg-slate-50  flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900 ">Camera Video Feed</p>
                  <p className="text-[10px] text-slate-500">Eye contact & posture framing overlay</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useCamera}
                onChange={e => setUseCamera(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStartInterview}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-indigo-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5" />
            Enter AI Interview Room ({activeCompany} — {activeRole})
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
