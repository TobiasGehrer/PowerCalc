import { useState } from 'react';
import { WorkoutSession } from './types';
import Dashboard from './pages/Dashboard';
import WorkoutView from './pages/WorkoutView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);

  const handleStartWorkout = (session: WorkoutSession) => {
    setCurrentSession(session);
    setCurrentView('workout');
  };

  const handleBackToDashboard = () => {
    setCurrentSession(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="app">
      {currentView === 'dashboard' && <Dashboard onStartWorkout={handleStartWorkout} />}
      {currentView === 'workout' && currentSession && (
        <WorkoutView session={currentSession} onFinish={handleBackToDashboard} />
      )}
    </div>
  );
}

export default App;
