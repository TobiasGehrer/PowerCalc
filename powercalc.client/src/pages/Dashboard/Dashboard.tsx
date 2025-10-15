import { useState, useEffect } from 'react';
import { Lifter, Program, AppState, WorkoutSession } from '../../types';
import ProgramSelector from '../../components/ProgramSelector/ProgramSelector';
import WorkoutStarter from '../../components/WorkoutStarter/WorkoutStarter';
import LiftersSection from '../../components/LiftersSection/LiftersSection';
import LifterFormModal from '../../components/LifterFormModal/LifterFormModal';
import { getLifters, deleteLifter, createLifter, updateLifter } from '../../services/liftersService'
import { getPrograms } from '../../services/programsService'
import { getState, updateState } from '../../services/stateService';
import { startWorkoutSession } from '../../services/workoutsService'
import MessageBox from '../../components/MessageBox/MessageBox';
import './Dashboard.css';

interface DashboardProps {
  onStartWorkout: (session: WorkoutSession) => void;
}

export default function Dashboard({ onStartWorkout }: DashboardProps) {
  const [lifters, setLifters] = useState<Lifter[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [state, setState] = useState<AppState | null>(null);
  const [lifterFormModal, setLifterFormModal] = useState<{ lifter?: Lifter } | null>(null);
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

      // Ensure selectedLifters exists (for backward compatibility)
      if (!stateData.selectedLifters) {
        stateData.selectedLifters = [];
      }

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

  const handleAddLifter = () => {
    setLifterFormModal({});
  };

  const handleEditLifter = (name: string) => {
    const lifter = lifters.find((l) => l.name === name);
    if (lifter) {
      setLifterFormModal({ lifter });
    }
  };

  const handleSaveLifter = async (lifter: Lifter) => {
    try {
      const isEditing = lifterFormModal?.lifter;

      if (isEditing) {
        await updateLifter(lifterFormModal.lifter!.name, lifter);
      } else {
        await createLifter(lifter);
      }

      setLifterFormModal(null);
      await loadData();
    } catch (error) {
      console.error('Error saving lifter:', error);
      setMessageBox({
        type: 'error',
        message: 'Failed to save lifter',
        onConfirm: () => setMessageBox(null),
      });
    }
  };

  const handleDeleteLifter = async (name: string) => {
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
          selectedLifters={state.selectedLifters}
          onStartWorkout={handleStartWorkout}
          onSelectedLiftersChange={(selectedLifters) => handleStateChange('selectedLifters', selectedLifters)}
        />
      </div>

      <LiftersSection
        lifters={lifters}
        onAddLifter={handleAddLifter}
        onEditLifter={handleEditLifter}
        onDeleteLifter={handleDeleteLifter}
      />

      {lifterFormModal && (
        <LifterFormModal
          lifter={lifterFormModal.lifter}
          onSave={handleSaveLifter}
          onCancel={() => setLifterFormModal(null)}
        />
      )}

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
