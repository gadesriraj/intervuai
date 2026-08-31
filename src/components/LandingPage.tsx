import React, { useState } from 'react';
import { NavView } from '../types';
import {
  Sparkles,
  Bot,
  Video,
  FileText,
  Code,
  Brain,
  ShieldCheck,
  Check,
  ChevronDown,
  Star,
  Zap,
  Award,
  TrendingUp,
  BarChart,
  Users,
  Building,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  setCurrentView: (view: NavView) => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentView,
  openAuthModal
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Soft brand background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-100/70 via-indigo-100/50 to-purple-100/70 blur-3xl" />
        <div className="absolute right-[-180px] top-80 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-20 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                AI-powered interview practice
              </div>

              <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:mx-0 lg:text-7xl lg:leading-[1.02]">
                Master interviews
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  with AI.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">
                Practice realistic interviews, receive personalized feedback,
                identify your weak areas, and improve with every session.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <button
                  id="hero-start-btn"
                  onClick={() => openAuthModal('register')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Free Mock Interview
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  id="hero-demo-btn"
                  onClick={() => openAuthModal('login')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
                >
                  <Bot className="h-4 w-4 text-indigo-600" />
                  Try Live Demo
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 lg:justify-start">
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Adaptive questions</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Personalized feedback</span>
                <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Voice & text practice</span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-200/50 via-indigo-200/40 to-purple-200/50 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">AI Interviewer</p>
                      <p className="text-xs text-slate-500">Technical Interview • Software Engineer</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>

                <div className="bg-slate-50/80 p-5 sm:p-7">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold text-indigo-600">IntervuAI</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        Tell me about a challenging project you worked on and how you solved the main technical problem.
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm leading-6 text-white shadow-md">
                    I built a real-time delivery system where route optimization was the main challenge...
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-medium text-slate-500">Technical</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">86</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-medium text-slate-500">Clarity</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">91</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-medium text-slate-500">Confidence</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">84</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Video className="h-4 w-4" />
                    Voice & camera optional
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                    Question 4 / 10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / stats */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">
          {[
            ['94.2%', 'Candidate pass rate'],
            ['150K+', 'Practice interviews'],
            ['12', 'Evaluation metrics'],
            ['50+', 'Company question banks'],
          ].map(([value, label]) => (
            <div key={label} className="px-4 py-6 text-center sm:px-6">
              <p className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Prepare for your target companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-bold text-slate-500 sm:text-base">
            {['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Deloitte', 'Infosys'].map(company => (
              <span key={company}>{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Why IntervuAI</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Practice like the real interview.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Go beyond static question banks with an adaptive AI coach that understands your answers and helps you improve.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Bot, title: 'Adaptive AI Interviewer', text: 'Questions and follow-ups adapt to the depth and quality of your previous answers.', tone: 'bg-indigo-50 text-indigo-600' },
              { icon: Video, title: 'Voice & Mic Support', text: 'Practice speaking naturally with voice input, transcripts, and optional camera support.', tone: 'bg-blue-50 text-blue-600' },
              { icon: Code, title: 'Coding Interviews', text: 'Practice technical coding rounds in an embedded editor with test-case feedback.', tone: 'bg-purple-50 text-purple-600' },
              { icon: FileText, title: 'Resume AI Analyzer', text: 'Turn your resume into interview preparation with skills, projects, and gap analysis.', tone: 'bg-sky-50 text-sky-600' },
              { icon: Brain, title: 'Deep Evaluation', text: 'Understand technical knowledge, communication, confidence, problem solving, and more.', tone: 'bg-violet-50 text-violet-600' },
              { icon: TrendingUp, title: 'Actionable Improvement', text: 'Get focused recommendations so every interview helps you perform better next time.', tone: 'bg-emerald-50 text-emerald-600' },
            ].map(({ icon: Icon, title, text, tone }) => (
              <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">How it works</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From preparation to progress.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {[
              ['01', 'Set your target', 'Choose your role, company, difficulty, and interview type.'],
              ['02', 'Start your session', 'Speak or type your answers in a realistic AI interview.'],
              ['03', 'Get evaluated', 'Review detailed scores, strengths, weaknesses, and missed concepts.'],
              ['04', 'Improve continuously', 'Follow personalized recommendations and practice again.'],
            ].map(([number, title, text]) => (
              <div key={number} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-sm font-extrabold text-indigo-600">{number}</span>
                <h3 className="mt-5 text-base font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Pricing</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Start free. Upgrade when you are ready.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">Practice without pressure and unlock more preparation when you need it.</p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Starter', price: '$0', suffix: '/ forever', desc: 'For students starting interview preparation.',
                items: ['3 mock interviews / month', 'Resume score & skill extraction', 'Voice & text support', 'Basic evaluation'],
                featured: false,
              },
              {
                name: 'Pro Candidates', price: '$19', suffix: '/ month', desc: 'For professionals targeting competitive roles.',
                items: ['Unlimited AI mock interviews', 'Company-specific preparation', 'Coding interview rounds', 'Deep evaluation & reports', 'Personalized improvement plan'],
                featured: true,
              },
              {
                name: 'University / Enterprise', price: 'Custom', suffix: '', desc: 'For placement cells, bootcamps, and teams.',
                items: ['Cohort dashboards', 'Custom interview rubrics', 'Account management', 'Placement integration'],
                featured: false,
              },
            ].map(plan => (
              <div key={plan.name} className={`relative flex flex-col rounded-2xl p-7 ${plan.featured ? 'border-2 border-indigo-500 bg-gradient-to-b from-indigo-50 to-white shadow-xl shadow-indigo-100' : 'border border-slate-200 bg-white shadow-sm'}`}>
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold text-slate-950">{plan.name}</h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{plan.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-950">{plan.price}</span>
                  {plan.suffix && <span className="text-xs text-slate-500">{plan.suffix}</span>}
                </div>
                <ul className="mt-7 flex-1 space-y-3">
                  {plan.items.map(item => (
                    <li key={item} className="flex gap-2 text-xs text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openAuthModal('register')}
                  className={`mt-8 w-full rounded-xl px-4 py-3 text-xs font-bold transition ${plan.featured ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-700'}`}
                >
                  {plan.featured ? 'Start 7-Day Free Trial' : plan.name === 'University / Enterprise' ? 'Contact Sales' : 'Get Started Free'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">FAQ</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">Questions, answered.</h2>
            <p className="mt-3 text-sm text-slate-600">Everything you need to know about IntervuAI.</p>
          </div>

          <div className="mt-10 space-y-3">
            {[
              {
                q: 'How does IntervuAI simulate a real interviewer?',
                a: 'IntervuAI uses AI to generate interview questions and follow-ups based on the selected role and the candidate responses.'
              },
              {
                q: 'Can I practice coding questions in the browser?',
                a: 'Yes. The application includes a coding interview experience with an embedded editor and test-case feedback where supported.'
              },
              {
                q: 'Is my microphone or video data recorded?',
                a: 'The exact storage and processing behavior depends on the current implementation and configured services. Review the application privacy settings before using live media features.'
              },
              {
                q: 'How does the Resume AI Analyzer tailor questions?',
                a: 'Your resume can be used to identify skills, projects, and experience so interview preparation can be more relevant to your profile.'
              },
            ].map((faq, idx) => (
              <div key={faq.q} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-6 text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-14 text-center shadow-xl shadow-indigo-200 sm:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to become interview-ready?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-indigo-100">
              Practice with IntervuAI, understand where you stand, and turn every interview into a learning opportunity.
            </p>
            <button
              onClick={() => openAuthModal('register')}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Start Free AI Mock Interview
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );

};