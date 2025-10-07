import { useState, useEffect } from 'react';
import LifterCard from './LifterCard';
import { getLifters, deleteLifter, getPrograms, getState, updateState, startWorkoutSession } from '../services/api';

interface DashboardProps {
  onStartWorkout: (session: any) => void;
}

export default function Dashboard({ onStartWorkout }: DashboardProps) {
  const [lifters, setLifters] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [state, setState] = useState<any>(null);
  const [selectedLifters, setSelectedLifters] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [liftersData, programsData, stateData] = await Promise.all([
        getLifters(),
        getPrograms(),
        getState(),
      ]);
      setLifters(liftersData);
      setPrograms(programsData);
      setState(stateData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeleteLifter = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await deleteLifter(name);
      await loadData();
    } catch (error) {
      console.error('Error deleting lifter:', error);
    }
  };

  const handleStateChange = async (field: string, value: any) => {
    let newState = { ...state, [field]: value };

    // Reset week and day to 1 when program changes
    if (field === 'currentProgram') {
      newState = { ...newState, currentWeek: 1, currentDay: 1 };
    }

    setState(newState);
    try {
      await updateState(newState);
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const handleStartWorkout = async () => {
    if (selectedLifters.length === 0) {
      alert('Please select at least one lifter');
      return;
    }

    try {
      const session = await startWorkoutSession({
        programName: state.currentProgram,
        week: state.currentWeek,
        day: state.currentDay,
        lifterNames: selectedLifters,
      });
      onStartWorkout(session);
    } catch (error) {
      console.error('Error starting workout:', error);
      alert('Failed to start workout');
    }
  };

  const toggleLifterSelection = (name: string) => {
    setSelectedLifters((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const currentProgram = programs.find((p) => p.name === state?.currentProgram);

  if (!state) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>PowerCalc</h1>

      <div className="top-sections">
        <section className="program-selection">
          <h2>Current Program</h2>
          <div className="program-action-buttons">
            <button className="icon-button" title="View Program">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button className="icon-button" title="Edit Program">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </button>
            <button className="icon-button" title="Add Program">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div className="program-controls">
            <div className="form-field">
              <label>Program:</label>
              <select
                value={state.currentProgram}
                onChange={(e) => handleStateChange('currentProgram', e.target.value)}
              >
                {programs.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="week-day-controls">
              <div className="form-field">
                <label>Week:</label>
                <select
                  value={state.currentWeek}
                  onChange={(e) => handleStateChange('currentWeek', parseInt(e.target.value))}
                >
                  {currentProgram &&
                    Array.from({ length: currentProgram.weeks }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Week {i + 1}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-field">
                <label>Day:</label>
                <select
                  value={state.currentDay}
                  onChange={(e) => handleStateChange('currentDay', parseInt(e.target.value))}
                >
                  {currentProgram &&
                    Array.from({ length: currentProgram.days }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Day {i + 1}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="workout-start">
          <h2>Start Workout</h2>
          <button onClick={handleStartWorkout} className="start-workout-icon-button" title="Start Workout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
          <div className="form-field">
            <label>Add participants:</label>
            <div className="lifter-chips">
              {lifters.map((lifter) => (
                <button
                  key={lifter.name}
                  className={`lifter-chip ${selectedLifters.includes(lifter.name) ? 'selected' : ''}`}
                  onClick={() => toggleLifterSelection(lifter.name)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{lifter.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="lifters-section">
        <h2>Lifters</h2>
        <button className="icon-button lifters-add-button" title="Add Lifter">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <div className="lifters-grid">
          {lifters.map((lifter) => (
            <LifterCard
              key={lifter.name}
              lifter={lifter}
              onEdit={() => {}}
              onDelete={handleDeleteLifter}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
