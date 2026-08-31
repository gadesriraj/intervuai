import React from 'react';
import { Sparkles, Heart, Shield, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200  bg-slate-50  text-slate-600  py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 ">IntervuAI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 ">
              Empowering job seekers worldwide with realistic AI mock interviews, real-time feedback, adaptive questions, and data-driven career coaching.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-400 ">
              <a href="#" className="hover:text-indigo-500 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-indigo-500 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-indigo-500 transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900  mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-500 transition-colors">AI Mock Interview</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Resume AI Analyzer</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Monaco Coding Round</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">12-Point Evaluation</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Daily Practice Challenge</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900  mb-3">Target Users</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-500 transition-colors">College Students & Freshers</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Software Engineers</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Universities & Placement Cells</a></li>
              <li><a href="#" className="hover:text-indigo-500 transition-colors">Corporate Interview Training</a></li>
            </ul>
          </div>

          {/* Security & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900  mb-3">Trust & Security</h4>
            <div className="p-3 bg-white  rounded-lg border border-slate-200  space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 ">
                <Shield className="w-3.5 h-3.5" /> SOC2 Compliant & Encrypted
              </div>
              <p className="text-[11px] text-slate-500 ">
                All voice transcripts, resumes, and code samples are processed via enterprise server proxies with zero public key exposure.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200  flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IntervuAI Inc. Master Interviews with AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
