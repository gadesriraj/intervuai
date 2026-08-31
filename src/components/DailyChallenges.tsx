import React, { useState } from 'react';
import { NavView } from '../types';
import { SAMPLE_FLASHCARDS as FLASHCARDS } from '../data/mockData';
import {
  Zap,
  Award,
  Flame,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ChevronRight,
  Trophy,
  Brain,
  Star
} from 'lucide-react';

interface DailyChallengesProps {
  setCurrentView: (view: NavView) => void;
}

export const DailyChallenges: React.FC<DailyChallengesProps> = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'flashcards' | 'leaderboard'>('challenges');
  const [cardIdx, setCardIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userXp, setUserXp] = useState(1250);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const currentCard = FLASHCARDS[cardIdx] || FLASHCARDS[0];

  const handleCompleteChallenge = (id: string, xpGain: number) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges([...completedChallenges, id]);
      setUserXp(userXp + xpGain);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" /> 7 Day Active Streak
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Daily Challenges, Flashcards & XP Leaderboard
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Build interview muscle memory with bite-sized daily problems, system design cards, and competitive XP rankings.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total XP Earned</p>
            <p className="text-2xl font-black text-amber-400 flex items-center gap-1 justify-end">
              <Zap className="w-5 h-5 fill-current" /> {userXp}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-slate-200  pb-2">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'challenges'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600  hover:bg-slate-100 '
          }`}
        >
          <Zap className="w-4 h-4" /> Daily Challenges
        </button>

        <button
          onClick={() => setActiveTab('flashcards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'flashcards'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600  hover:bg-slate-100 '
          }`}
        >
          <Brain className="w-4 h-4" /> Tech Flashcards
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600  hover:bg-slate-100 '
          }`}
        >
          <Trophy className="w-4 h-4" /> Candidate Leaderboard
        </button>
      </div>

      {/* TAB 1: Daily Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {[
            {
              id: 'c1',
              title: 'Google Distributed Rate Limiter Design',
              category: 'System Design',
              xp: 150,
              desc: 'Design a rate limiter handling 100k requests/sec using Token Bucket algorithm in Redis.'
            },
            {
              id: 'c2',
              title: 'Amazon STAR Method Conflict Resolution',
              category: 'Behavioral',
              xp: 100,
              desc: 'Practice answering: "Tell me about a time you disagreed with a senior engineer on architecture."'
            },
            {
              id: 'c3',
              title: 'LRU Cache O(1) Implementation',
              category: 'Coding',
              xp: 200,
              desc: 'Implement LRU Cache using Doubly Linked List and Hash Map in Python.'
            }
          ].map((c) => {
            const isDone = completedChallenges.includes(c.id);
            return (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50  text-indigo-700  border border-indigo-200  text-[10px] font-bold">
                      {c.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Zap className="w-3.5 h-3.5 fill-current" /> +{c.xp} XP
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 ">{c.title}</h3>
                  <p className="text-xs text-slate-500 ">{c.desc}</p>
                </div>

                <button
                  onClick={() => {
                    handleCompleteChallenge(c.id, c.xp);
                    if (c.category === 'Coding') setCurrentView('coding-round');
                    else setCurrentView('interview-setup');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 shrink-0 transition-all ${
                    isDone
                      ? 'bg-emerald-50  text-emerald-600  border border-emerald-300 '
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Challenge Completed
                    </>
                  ) : (
                    <>
                      Solve Challenge <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="p-8 rounded-3xl bg-white  border border-slate-200  shadow-xl min-h-[260px] flex flex-col items-center justify-center space-y-4 transition-all">
            <span className="px-3 py-1 rounded-full bg-indigo-50  text-indigo-700  text-xs font-bold border border-indigo-200 ">
              {currentCard.category} ({cardIdx + 1}/{FLASHCARDS.length})
            </span>

            <h3 className="text-lg font-bold text-slate-900  leading-relaxed">
              "{currentCard.question}"
            </h3>

            {showAnswer ? (
              <div className="p-4 rounded-xl bg-slate-50  border border-slate-200  text-xs text-slate-800  leading-relaxed font-mono animate-in fade-in">
                {currentCard.answer}
              </div>
            ) : (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-4 py-2 rounded-xl bg-slate-100  hover:bg-slate-200  text-xs font-semibold text-slate-700  transition-colors"
              >
                Reveal Answer
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setShowAnswer(false);
                setCardIdx((cardIdx - 1 + FLASHCARDS.length) % FLASHCARDS.length);
              }}
              className="px-4 py-2 bg-slate-100  text-xs font-semibold rounded-xl text-slate-700 "
            >
              Previous Card
            </button>

            <button
              onClick={() => {
                setShowAnswer(false);
                setCardIdx((cardIdx + 1) % FLASHCARDS.length);
              }}
              className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900  flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Weekly Candidate Rankings
          </h3>

          <div className="space-y-2">
            {[
              { rank: 1, name: 'Alex Rivera', company: 'Google Target', xp: 2850, badge: 'FAANG Ready' },
              { rank: 2, name: 'Sarah Chen', company: 'Amazon Target', xp: 2400, badge: 'System Architect' },
              { rank: 3, name: 'You (Candidate)', company: 'Google Target', xp: userXp, badge: 'Mock Streak 7d' },
              { rank: 4, name: 'David Miller', company: 'Microsoft Target', xp: 1100, badge: 'Algo Specialist' }
            ].map((u) => (
              <div
                key={u.rank}
                className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                  u.rank === 3
                    ? 'border-indigo-500 bg-indigo-50/40 '
                    : 'border-slate-200  bg-slate-50/50 '
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      u.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : u.rank === 2
                        ? 'bg-slate-300 text-slate-900'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    #{u.rank}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 ">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{u.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200  text-slate-700  text-[10px]">
                    {u.badge}
                  </span>
                  <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                    <Zap className="w-3.5 h-3.5 fill-current" /> {u.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
