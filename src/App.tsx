import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavView } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ProfileView } from './components/ProfileView';
import { ResumeAnalyzer } from './components/ResumeAnalyzer';
import { InterviewSetup } from './components/InterviewSetup';
import { AIInterviewerRoom } from './components/AIInterviewerRoom';
import { CodingRound } from './components/CodingRound';
import { EvaluationReport } from './components/EvaluationReport';
import { AnalyticsView } from './components/AnalyticsView';
import { DailyChallenges } from './components/DailyChallenges';
import { AdminPanel } from './components/AdminPanel';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<NavView>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const renderView = () => {
    // If not authenticated, force landing page unless user explicitly clicks auth modal
    if (!isAuthenticated && currentView !== 'landing') {
      return (
        <LandingPage
          setCurrentView={setCurrentView}
          openAuthModal={openAuthModal}
        />
      );
    }

    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            setCurrentView={setCurrentView}
            openAuthModal={openAuthModal}
          />
        );
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'profile':
        return <ProfileView setCurrentView={setCurrentView} />;
      case 'resume-analyzer':
        return <ResumeAnalyzer setCurrentView={setCurrentView} />;
      case 'interview-setup':
        return <InterviewSetup setCurrentView={setCurrentView} />;
      case 'interview-room':
        return <AIInterviewerRoom setCurrentView={setCurrentView} />;
      case 'coding-round':
        return <CodingRound setCurrentView={setCurrentView} />;
      case 'evaluation':
        return <EvaluationReport setCurrentView={setCurrentView} />;
      case 'analytics':
        return <AnalyticsView setCurrentView={setCurrentView} />;
      case 'challenges':
        return <DailyChallenges setCurrentView={setCurrentView} />;
      case 'admin':
        return <AdminPanel setCurrentView={setCurrentView} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]  text-slate-900  font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openAuthModal={openAuthModal}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentView('dashboard');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
