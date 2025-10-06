import { useState } from 'react';
import Dashboard from './components/Dashboard';
import WorkoutView from './components/WorkoutView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentSession, setCurrentSession] = useState<any>(null);

  const handleStartWorkout = (session: any) => {
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
