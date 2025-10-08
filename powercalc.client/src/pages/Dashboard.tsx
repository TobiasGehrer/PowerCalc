import { useState, useEffect } from 'react';
import { Lifter, Program, AppState, WorkoutSession } from '../types';
import LifterCard from '../components/LifterCard';
import ProgramSelector from '../components/ProgramSelector';
import WorkoutStarter from '../components/WorkoutStarter';
import IconButton from '../components/IconButton';
import { PlusIcon } from '../components/icons';
import { getLifters, deleteLifter, getPrograms, getState, updateState, startWorkoutSession } from '../services/api';
import MessageBox from '../components/MessageBox';

interface DashboardProps {
  onStartWorkout: (session: WorkoutSession) => void;
}

export default function Dashboard({ onStartWorkout }: DashboardProps) {
  const [lifters, setLifters] = useState<Lifter[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [state, setState] = useState<AppState | null>(null);
  const [messageBox, setMessageBox] = useState<{
    type: 'info' | 'error' | 'confirm';
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

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

      // Check if current program still exists
      const currentProgramExists = programsData.some(
        (p) => p.name === stateData.currentProgram
      );

      if (!currentProgramExists && programsData.length > 0) {
        // Current program was deleted, switch to first available program
        const newState = {
          ...stateData,
          currentProgram: programsData[0].name,
          currentWeek: 1,
          currentDay: 1,
        };
        setState(newState);
        await updateState(newState);
      } else {
        setState(stateData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeleteLifter = async (name: string) => {
    setMessageBox({
      type: 'confirm',
      message: `Delete ${name}?`,
      onConfirm: async () => {
        setMessageBox(null);
        try {
          await deleteLifter(name);
          await loadData();
        } catch (error) {
          console.error('Error deleting lifter:', error);
        }
      },
      onCancel: () => setMessageBox(null),
    });
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
      setMessageBox({
        type: 'error',
        message: 'Failed to start workout',
        onConfirm: () => setMessageBox(null),
      });
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
          onProgramsUpdated={loadData}
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

      {messageBox && (
        <MessageBox
          type={messageBox.type}
          message={messageBox.message}
          onConfirm={messageBox.onConfirm}
          onCancel={messageBox.onCancel}
        />
      )}
    </div>
  );
}
