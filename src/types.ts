export type NavView =
  | 'landing'
  | 'dashboard'
  | 'profile'
  | 'resume-analyzer'
  | 'interview-setup'
  | 'interview-room'
  | 'coding-round'
  | 'evaluation'
  | 'analytics'
  | 'admin'
  | 'challenges'
  | 'flashcards'
  | 'career-roadmap';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  college: string;
  degree: string;
  branch: string;
  graduationYear: string;
  skills: string[];
  targetCompany: string;
  dreamJob: string;
  yearsExperience: string;
  github: string;
  linkedin: string;
  portfolio: string;
  resumeFileName?: string;
  resumeText?: string;
  resumeScore?: number;
  createdAt: string;
}

export interface ResumeAnalysisResult {
  resumeScore: number;
  extractedSkills: string[];
  detectedWeakAreas: string[];
  suggestedImprovements: string[];
  summary: string;
  suggestedRoles: string[];
}

export type RoundType = 'HR' | 'Technical' | 'Behavioral' | 'Managerial' | 'Coding' | 'System Design';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
export type InterviewDuration = 10 | 20 | 30 | 45 | 60;

export interface InterviewConfig {
  id: string;
  roundType: RoundType;
  difficulty: DifficultyLevel;
  duration: InterviewDuration; // minutes
  company: string;
  role: string;
  useVoice: boolean;
  useCamera: boolean;
  focusAreas: string[];
}

export interface QuestionItem {
  id: string;
  text: string;
  category: string;
  expectedKeywords: string[];
  difficulty: string;
}

export interface TranscriptItem {
  questionId: string;
  question: string;
  answer: string;
  timestamp: string;
  audioDurationSec?: number;
  feedbackOnAnswer?: string;
  isFollowUp?: boolean;
}

export interface MetricBreakdown {
  technicalKnowledge: number;
  communication: number;
  confidence: number;
  grammar: number;
  vocabulary: number;
  problemSolving: number;
  logicalThinking: number;
  leadership: number;
  behavior: number;
  speakingSpeed: number;
  fillerWords: number;
  professionalism: number;
}

export interface QuestionReview {
  question: string;
  candidateAnswer: string;
  idealAnswer: string;
  score: number;
  feedback: string;
}

export interface ImprovementTask {
  day: string;
  task: string;
}

export interface EvaluationReport {
  id: string;
  config: InterviewConfig;
  completedAt: string;
  overallScore: number;
  metrics: MetricBreakdown;
  strengths: string[];
  weaknesses: string[];
  missedConcepts: string[];
  questionReviews: QuestionReview[];
  improvementPlan: ImprovementTask[];
  summary: string;
  transcript: TranscriptItem[];
}

export interface CodingQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterCode: Record<string, string>; // e.g. { python: "...", javascript: "..." }
  testCases: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }>;
}

export interface CodeAnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  codeQualityScore: number;
  suggestions: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  company: string;
  role: string;
  roundType: RoundType;
  question: string;
  xpPoints: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  score: number;
  streakDays: number;
  badge: string;
  avatar: string;
}
