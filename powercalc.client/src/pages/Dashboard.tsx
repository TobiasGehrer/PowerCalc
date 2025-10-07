import { useState, useEffect } from 'react';
import { Lifter, Program, AppState, WorkoutSession } from '../types';
import LifterCard from '../components/LifterCard';
import ProgramSelector from '../components/ProgramSelector';
import WorkoutStarter from '../components/WorkoutStarter';
import IconButton from '../components/IconButton';
import { PlusIcon } from '../components/icons';
import { getLifters, deleteLifter, getPrograms, getState, updateState, startWorkoutSession } from '../services/api';

interface DashboardProps {
  onStartWorkout: (session: WorkoutSession) => void;
}

export default function Dashboard({ onStartWorkout }: DashboardProps) {
  const [lifters, setLifters] = useState<Lifter[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [state, setState] = useState<AppState | null>(null);

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
    if (!state) return;

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

  const handleStartWorkout = async (selectedLifters: string[]) => {
    if (!state) return;

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

  if (!state) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1><span className="title-power">Power</span>Calc</h1>

      <div className="top-sections">
        <ProgramSelector
          programs={programs}
          state={state}
          onStateChange={handleStateChange}
        />
        <WorkoutStarter
          lifters={lifters}
          onStartWorkout={handleStartWorkout}
        />
      </div>

      <section className="lifters-section">
        <h2>Lifters</h2>
        <IconButton
          icon={<PlusIcon />}
          title="Add Lifter"
          variant="primary"
          className="lifters-add-button"
        />
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
