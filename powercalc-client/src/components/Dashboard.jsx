import React, { useState, useEffect } from 'react';
import LifterCard from './LifterCard';
import { getLifters, deleteLifter, getPrograms, getState, updateState, startWorkoutSession } from '../services/api';

export default function Dashboard({ onStartWorkout }) {
  const [lifters, setLifters] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [state, setState] = useState(null);
  const [selectedLifters, setSelectedLifters] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const handleDeleteLifter = async (name) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await deleteLifter(name);
      await loadData();
    } catch (error) {
      console.error('Error deleting lifter:', error);
    }
  };

  const handleStateChange = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveState = async () => {
    try {
      await updateState(state);
      setHasUnsavedChanges(false);
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

  const toggleLifterSelection = (name) => {
    setSelectedLifters((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const currentProgram = programs.find((p) => p.name === state?.currentProgram);

  if (!state) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>PowerCalc</h1>

      <section className="program-selection">
        <h2>Current Program</h2>
        <div className="selection-controls">
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

          {hasUnsavedChanges && (
            <button onClick={handleSaveState} className="save-button">
              Save Changes
            </button>
          )}
        </div>
      </section>

      <section className="lifters-section">
        <h2>Lifters</h2>
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

      <section className="workout-start">
        <h2>Start Workout</h2>
        <div className="lifter-selection">
          {lifters.map((lifter) => (
            <label key={lifter.name} className="lifter-checkbox">
              <input
                type="checkbox"
                checked={selectedLifters.includes(lifter.name)}
                onChange={() => toggleLifterSelection(lifter.name)}
              />
              <span>{lifter.name}</span>
            </label>
          ))}
        </div>
        <button onClick={handleStartWorkout} className="start-button">
          Start Workout
        </button>
      </section>
    </div>
  );
}
