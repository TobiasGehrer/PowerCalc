import { useState } from 'react';
import { Lifter } from '../../types';
import { UserIcon, PlayIcon } from '../Icons/Icons';
import MessageBox from '../MessageBox/MessageBox';
import './WorkoutStarter.css';

interface WorkoutStarterProps {
  lifters: Lifter[];
  selectedLifters: string[];
  onStartWorkout: (selectedLifters: string[]) => void;
  onSelectedLiftersChange: (selectedLifters: string[]) => void;
}

export default function WorkoutStarter({ lifters, selectedLifters, onStartWorkout, onSelectedLiftersChange }: WorkoutStarterProps) {
  const [messageBox, setMessageBox] = useState<{
    type: 'info' | 'error' | 'confirm';
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const toggleLifterSelection = (name: string) => {
    const newSelection = selectedLifters.includes(name)
      ? selectedLifters.filter((n) => n !== name)
      : [...selectedLifters, name];
    onSelectedLiftersChange(newSelection);
  };

  const handleStartWorkout = () => {
    if (selectedLifters.length === 0) {
      setMessageBox({
        type: 'error',
        message: 'Please select at least one lifter',
        onConfirm: () => setMessageBox(null),
      });
      return;
    }
    onStartWorkout(selectedLifters);
  };

  return (
    <>
      <section className="workout-start">
        <h2>Start Workout</h2>
        <button onClick={handleStartWorkout} className="start-workout-icon-button" title="Start Workout">
          <PlayIcon />
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
                <UserIcon />
                <span>{lifter.name}</span>
              </button>
            ))}
          </div>
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
    </>
  );
}
