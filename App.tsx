import React, { useState } from 'react';
import { AppState } from './types';
import { PROJECTS } from './constants';
import { Header } from './components/Header';
import { Home } from './views/Home';
import { VotingView } from './views/VotingView';
import { AdminDashboard } from './views/AdminDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'HOME',
    selectedProjectId: null,
    isAdmin: false
  });

  const handleNavigateHome = () => {
    setState(prev => ({ ...prev, currentView: 'HOME', selectedProjectId: null }));
  };

  const handleProjectSelect = (projectId: string) => {
    setState(prev => ({ ...prev, currentView: 'VOTE', selectedProjectId: projectId }));
  };

  const handleAdminClick = () => {
    if (state.isAdmin) {
      setState(prev => ({ ...prev, currentView: 'ADMIN_DASHBOARD' }));
    } else {
      setState(prev => ({ ...prev, currentView: 'ADMIN_LOGIN' }));
    }
  };

  const handleAdminLoginSuccess = () => {
    setState(prev => ({ ...prev, isAdmin: true, currentView: 'ADMIN_DASHBOARD' }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, isAdmin: false, currentView: 'HOME' }));
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans relative">
      <Header 
        title="Expotecmi" 
        onHomeClick={handleNavigateHome} 
        onAdminClick={handleAdminClick} 
      />
      
      <main className="flex-grow">
        {state.currentView === 'HOME' && (
          <Home onSelectProject={handleProjectSelect} />
        )}

        {state.currentView === 'VOTE' && state.selectedProjectId && (
          <VotingView 
            project={PROJECTS.find(p => p.id === state.selectedProjectId)!} 
            onBack={handleNavigateHome}
          />
        )}

        {(state.currentView === 'ADMIN_LOGIN' || state.currentView === 'ADMIN_DASHBOARD') && (
          <AdminDashboard 
            isAuthenticated={state.isAdmin} 
            onLoginSuccess={handleAdminLoginSuccess}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-slate-200/50 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Expotecmi Evaluator.</p>
          <p className="mt-1 text-xs opacity-75">Los datos se guardan localmente en este dispositivo y se sincronizan cuando hay conexión.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;