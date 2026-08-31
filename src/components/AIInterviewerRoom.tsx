import React, { useState, useEffect, useRef } from 'react';
import { NavView, InterviewConfig, QuestionItem, TranscriptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Send,
  Pause,
  Play,
  Square,
  Sparkles,
  Bot,
  User,
  Clock,
  HelpCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Award
} from 'lucide-react';

interface AIInterviewerRoomProps {
  setCurrentView: (view: NavView) => void;
}

export const AIInterviewerRoom: React.FC<AIInterviewerRoomProps> = ({ setCurrentView }) => {
  const { currentConfig, user, addEvaluationReport } = useAuth();

  const config = currentConfig || {
    id: 'cfg_default',
    roundType: 'Technical',
    difficulty: 'Medium',
    duration: 20,
    company: 'Google',
    role: 'Software Engineer',
    useVoice: true,
    useCamera: true,
    focusAreas: ['Algorithms', 'System Design']
  };

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [aiState, setAiState] = useState<'speaking' | 'listening' | 'thinking' | 'idle'>('thinking');

  // Timer state
  const [timeLeftSec, setTimeLeftSec] = useState(config.duration * 60);
  const [isPaused, setIsPaused] = useState(false);

  // Audio / Speech / Cam states
  const [isMicOn, setIsMicOn] = useState(config.useVoice);
  const [isCamOn, setIsCamOn] = useState(config.useCamera);
  const [isMutedAI, setIsMutedAI] = useState(false);
  const [feedbackOnLastAnswer, setFeedbackOnLastAnswer] = useState<string | null>(null);

  // Video element ref for camera preview
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  // Web Speech API recognition ref
  const recognitionRef = useRef<any>(null);

  // Initialize questions
  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        
        

const res = await fetch('/api/interview/generate-questions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },

  body: JSON.stringify({
  roundType: config.roundType,
  company: config.company,
  role: config.role,
  difficulty: config.difficulty,
  duration: config.duration,
  focusAreas: config.focusAreas,
  resumeText: user?.resumeText || '',
  skills: user?.skills || [],
}),
  
});

const data = await res.json();

        if (isMounted && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setLoadingQuestions(false);
          setAiState('speaking');
          speakText(data.questions[0].text);
          return;
        }
      } catch (err) {
        console.error('Failed to fetch AI questions:', err);
      }

      // Fallback questions if offline
      if (isMounted) {
        const fallbackQs: QuestionItem[] = [
          {
            id: 'q1',
            text: `Welcome to your ${config.company} ${config.roundType} interview. To begin, tell me about yourself and why you're interested in the ${config.role} position?`,
            category: 'Introduction',
            expectedKeywords: ['experience', 'passion', 'skills'],
            difficulty: 'Easy'
          },
          {
            id: 'q2',
            text: `How do you handle technical debt and trade-offs between speed and system reliability in your projects?`,
            category: 'Technical Strategy',
            expectedKeywords: ['testing', 'refactoring', 'metrics'],
            difficulty: 'Medium'
          },
          {
            id: 'q3',
            text: `Describe a challenging bug or architecture problem you encountered and how you solved it step-by-step.`,
            category: 'Problem Solving',
            expectedKeywords: ['debugging', 'profiling', 'root cause'],
            difficulty: 'Hard'
          }
        ];
        setQuestions(fallbackQs);
        setLoadingQuestions(false);
        setAiState('speaking');
        speakText(fallbackQs[0].text);
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speech synthesis for AI speaking
  const speakText = (text: string) => {
    if (isMutedAI || !('speechSynthesis' in window)) {
      setAiState('listening');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setAiState('speaking');
    utterance.onend = () => setAiState('listening');
    utterance.onerror = () => setAiState('listening');

    window.speechSynthesis.speak(utterance);
  };

  // Camera stream initialization
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCamOn && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera permission not granted:', err);
          setIsCamOn(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCamOn]);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && isMicOn) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      

        recognition.onresult = (event: any) => {
  let finalText = '';

  for (let i = 0; i < event.results.length; i++) {
    finalText += event.results[i][0].transcript + ' ';
  }

  setCandidateAnswer(finalText.trim());
};
        

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        // Ignore duplicate start errors
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isMicOn, currentIdx]);

  // Countdown timer effect
  useEffect(() => {
    if (isPaused || timeLeftSec <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, timeLeftSec]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  
const handleNextQuestion = () => {
  if (!candidateAnswer.trim()) {
    return;
  }

  const currentQ = questions[currentIdx];

  if (!currentQ) {
    return;
  }

  const newTranscriptItem: TranscriptItem = {
    questionId: currentQ.id,
    question: currentQ.text,
    answer: candidateAnswer.trim(),
    timestamp: new Date().toISOString(),
  };

  const updatedTranscript = [
    ...transcript,
    newTranscriptItem,
  ];

  setTranscript(updatedTranscript);
  setCandidateAnswer('');
  setFeedbackOnLastAnswer(null);

  // Question 8 completed
  if (currentIdx >= 7) {
    handleFinishInterview(updatedTranscript);
    return;
  }

  // Move to the next question already generated by Gemini.
  // NO Gemini API call here.
  const nextIndex = currentIdx + 1;

  setCurrentIdx(nextIndex);
  setAiState('speaking');

  const nextQuestion = questions[nextIndex];

  if (nextQuestion) {
    speakText(nextQuestion.text);
  }
};


const handleFinishInterview = async (finalTranscript = transcript) => {
  setEvaluating(true);
  setAiState('thinking');

  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  try {
    console.log('========== STARTING EVALUATION ==========');
    console.log('Transcript:', finalTranscript);
    console.log('Transcript length:', finalTranscript.length);

    const res = await fetch('/api/interview/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript: finalTranscript,
        roundType: config.roundType,
        company: config.company,
        role: config.role,
        difficulty: config.difficulty,
        resumeText: user?.resumeText || '',
        skills: user?.skills || [],
        resumeScore: user?.resumeScore || null
      })
    });



const evalData = await res.json();

console.log("========== EVALUATION DEBUG ==========");
console.log("HTTP status:", res.status);
console.log("Evaluation response:", evalData);
console.log("Overall score:", evalData?.overallScore);
console.log("Transcript:", finalTranscript);
console.log("Transcript length:", finalTranscript.length);

if (!res.ok) {
  throw new Error(
    evalData?.error || `Evaluation failed with status ${res.status}`
  );
}

if (typeof evalData?.overallScore !== "number") {
  throw new Error(
    "Gemini returned an invalid evaluation: overallScore is missing."
  );
}

const fullReport = {
  id: 'eval_' + Date.now(),
  config,
  completedAt: new Date().toISOString(),
  ...evalData,
  transcript: finalTranscript
};

console.log("FINAL REPORT BEING SAVED:", fullReport);

addEvaluationReport(fullReport);
setCurrentView('evaluation');

  } catch (error) {

    console.error('========== EVALUATION ERROR ==========');
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : 'Interview evaluation failed.'
    );

    // IMPORTANT:
    // Do NOT navigate to evaluation if evaluation failed.
  } finally {
    setEvaluating(false);
  }
};

  const handleHint = () => {
    const hintText = `Here's a tip: Focus on structured steps using the STAR framework (Situation, Task, Action, Result) and mention concrete trade-offs or performance metrics.`;
    setFeedbackOnLastAnswer(hintText);
  };

  if (loadingQuestions) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 ">
          Initializing AI Interviewer for {config.company}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Gemini AI is parsing your target role ({config.role}) and customizing adaptive questions...
        </p>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 ">
          Evaluating 12 Performance Parameters...
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Analyzing technical knowledge, communication tone, confidence level, filler words, and generating your 7-day improvement plan...
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIdx] || {
    text: 'Please elaborate on your technical background and key projects.'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Session Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center">
            {config.company.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold">{config.company} — {config.role}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800">
                {config.roundType} Round
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Difficulty: <span className="text-slate-200 font-semibold">{config.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Live Controls & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(timeLeftSec)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isPaused ? 'Resume Interview' : 'Pause Interview'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleFinishInterview()}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> End & Analyze
          </button>
        </div>
      </div>

      {/* Main Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Interviewer Avatar & Video Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* AI Interviewer State Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950 border border-slate-800 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Outer pulsing ring for AI status */}
              {aiState === 'speaking' && (
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/60 animate-ping pointer-events-none" />
              )}
              {aiState === 'thinking' && (
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/60 animate-spin border-t-transparent pointer-events-none" />
              )}

              <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center shadow-inner">
                <Bot className="w-12 h-12 text-indigo-400" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-extrabold">AI Interviewer</h3>
              <p className="text-xs text-indigo-300 capitalize font-medium flex items-center justify-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    aiState === 'speaking'
                      ? 'bg-emerald-400 animate-pulse'
                      : aiState === 'thinking'
                      ? 'bg-amber-400'
                      : 'bg-indigo-400'
                  }`}
                />
                Status: {aiState}
              </p>
            </div>

            {/* Mute AI speech toggle */}
            <button
              onClick={() => setIsMutedAI(!isMutedAI)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/60 inline-flex items-center gap-1.5"
            >
              {isMutedAI ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isMutedAI ? 'Unmute AI Voice' : 'Mute AI Voice'}
            </button>
          </div>

          {/* User Camera Preview Feed */}
          {isCamOn && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-md">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold flex items-center gap-1.5 border border-slate-700">
                <User className="w-3 h-3 text-indigo-400" /> Camera Framing Active
              </div>
            </div>
          )}
        </div>

        {/* Question & Answer Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Question Display Card */}
          <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="uppercase tracking-wider text-indigo-600  flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Question {currentIdx + 1} of 8
              </span>
              <span className="bg-slate-100  px-2.5 py-1 rounded-lg text-slate-700 ">
                {currentQ.category || 'Core Prompt'}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900  leading-relaxed">
              "{currentQ.text}"
            </h3>

            {feedbackOnLastAnswer && (
              <div className="p-3 bg-indigo-50  border border-indigo-200  text-indigo-800  rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span><strong>Interviewer Note:</strong> {feedbackOnLastAnswer}</span>
              </div>
            )}
          </div>

          {/* Candidate Answer Box */}
          <div className="p-6 rounded-2xl bg-white  border border-slate-200  shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900  uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-500" /> Your Response (Voice / Text)
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                    isMicOn
                      ? 'bg-emerald-50  border-emerald-300  text-emerald-700 '
                      : 'bg-slate-100  border-slate-300  text-slate-600 '
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-emerald-500 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                  {isMicOn ? 'Listening Mic' : 'Mic Off'}
                </button>

                <button
                  onClick={handleHint}
                  className="px-3 py-1.5 rounded-xl bg-slate-100  hover:bg-slate-200  text-xs font-semibold text-slate-700  flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Request Hint
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak aloud into your microphone or type your response here... (e.g., In my previous project, we encountered latency bottlenecks...)"
              className="w-full p-4 bg-slate-50  border border-slate-200  rounded-xl text-sm text-slate-900  focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-500 ">
                Tip: Speak clearly or write structured points covering trade-offs.
              </p>

              <button
                onClick={handleNextQuestion}
                disabled={aiState === 'thinking'}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {aiState === 'thinking' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Processing Response...
                  </>
                ) : (
                  <>
                    Submit Answer & Next <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
