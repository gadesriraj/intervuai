import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavView } from '../types';
import {
  User,
  GraduationCap,
  Briefcase,
  Target,
  FileText,
  Github,
  Linkedin,
  Globe,
  Save,
  CheckCircle2,
  Sparkles,
  Upload,
  Plus,
  X
} from 'lucide-react';

interface ProfileViewProps {
  setCurrentView: (view: NavView) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ setCurrentView }) => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.degree || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '');
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany || 'Google');
  const [dreamJob, setDreamJob] = useState(user?.dreamJob || 'Software Engineer');
  const [yearsExperience, setYearsExperience] = useState(user?.yearsExperience || '1-2 Years');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      degree,
      branch,
      graduationYear,
      targetCompany,
      dreamJob,
      yearsExperience,
      github,
      linkedin,
      portfolio,
      skills
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900  flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-500" /> Candidate Profile & Target Settings
          </h1>
          <p className="text-xs text-slate-500  mt-1">
            IntervuAI tailors all mock questions and AI evaluations to your college background, skill tags, and dream job company.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('resume-analyzer')}
          className="px-4 py-2 bg-indigo-50  border border-indigo-200  text-indigo-600  font-semibold rounded-xl text-xs flex items-center gap-2 hover:bg-indigo-100 transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Analyze Resume with AI
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50  border border-emerald-200  text-emerald-700  rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> Profile saved successfully! Your interview sessions will now adapt to these parameters.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Personal Details */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2 bg-slate-100  border border-slate-200  rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" /> Academic & College Background
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Degree & Major
              </label>
              <input
                type="text"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                placeholder="e.g. B.S. Computer Science"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="e.g. Artificial Intelligence & Systems"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={graduationYear}
                onChange={e => setGraduationYear(e.target.value)}
                placeholder="e.g. 2025"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Target Career & Company */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" /> Target Career & Dream Company
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Target Company
              </label>
              <select
                value={targetCompany}
                onChange={e => setTargetCompany(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                <option value="Custom Tech Firm">Custom Startup/Firm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Dream Role
              </label>
              <select
                value={dreamJob}
                onChange={e => setDreamJob(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="ML Engineer">ML Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Cyber Security Analyst">Cyber Security Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1">
                Years of Experience
              </label>
              <select
                value={yearsExperience}
                onChange={e => setYearsExperience(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Fresher / College Graduate">Fresher / College Student</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years Senior">5+ Years Senior</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills Tag Manager */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" /> Technical Skills & Frameworks
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50  text-indigo-700  border border-indigo-200  text-xs font-semibold"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-rose-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add skill tag (e.g. Kubernetes, System Design, GraphQL)"
              className="flex-1 px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" /> Social & Portfolio Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Github className="w-3.5 h-3.5" /> GitHub Profile
              </label>
              <input
                type="url"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700  mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Portfolio URL
              </label>
              <input
                type="url"
                value={portfolio}
                onChange={e => setPortfolio(e.target.value)}
                placeholder="https://yourname.dev"
                className="w-full px-3.5 py-2 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Form Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
