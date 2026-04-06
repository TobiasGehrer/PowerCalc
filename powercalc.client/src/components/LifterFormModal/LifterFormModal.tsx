import { useState } from 'react';
import { Lifter } from '../../types';
import { SaveIcon } from '../Icons/Icons';
import './LifterFormModal.css';

interface LifterFormModalProps {
  lifter?: Lifter;
  onSave: (lifter: Lifter) => void;
  onCancel: () => void;
}

const EXERCISES = [
  { key: 'squat', label: 'Squat' },
  { key: 'bench', label: 'Bench' },
  { key: 'deadlift', label: 'Deadlift' },
  { key: 'ohp', label: 'OHP' },
  { key: 'rdl', label: 'RDL' },
  { key: 'row', label: 'Row' },
  { key: 'curl', label: 'Curl' },
  { key: 'triceps', label: 'Triceps' },
  { key: 'crunch', label: 'Crunch' },
  { key: 'calf', label: 'Calf' },
];

export default function LifterFormModal({ lifter, onSave, onCancel }: LifterFormModalProps) {
  const [name, setName] = useState(lifter?.name || '');
  const [oneRepMaxes, setOneRepMaxes] = useState<Record<string, string>>(
    EXERCISES.reduce((acc, exercise) => {
      acc[exercise.key] = lifter?.oneRepMaxes[exercise.key]?.toString() || '';
      return acc;
    }, {} as Record<string, string>)
  );
  const [calcWeight, setCalcWeight] = useState('');
  const [calcReps, setCalcReps] = useState('');
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [calcExpanded, setCalcExpanded] = useState(false);

  const isEditMode = !!lifter;

  const handleExerciseChange = (key: string, value: string) => {
    setOneRepMaxes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const calculateAndUpdate1RM = (weight: string, reps: string) => {
    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps);

    if (!weightNum || !repsNum || repsNum < 1) {
      setCalcResult(null);
      return;
    }

    // Epley formula: 1RM = weight × (1 + reps/30)
    const oneRM = weightNum * (1 + repsNum / 30);
    setCalcResult(Math.round(oneRM * 2) / 2); // Round to nearest 0.5
  };

  const applyToExercise = (exerciseKey: string) => {
    if (calcResult !== null) {
      handleExerciseChange(exerciseKey, calcResult.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }

    const parsedMaxes = Object.keys(oneRepMaxes).reduce((acc, key) => {
      acc[key] = parseFloat(oneRepMaxes[key]) || 0;
      return acc;
    }, {} as Record<string, number>);

    const newLifter: Lifter = {
      name: name.trim(),
      oneRepMaxes: {
        squat: parsedMaxes['squat'] || 0,
        bench: parsedMaxes['bench'] || 0,
        deadlift: parsedMaxes['deadlift'] || 0,
        ohp: parsedMaxes['ohp'] || 0,
        ...parsedMaxes,
      },
    };

    onSave(newLifter);
  };

  const handleOverlayClick = () => {
    onCancel();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content lifter-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lifter-form-header">
          <button type="submit" form="lifter-form" className="save-icon-button" title="Save">
            <SaveIcon />
          </button>
          <button className="close-button" onClick={onCancel}>
            ×
          </button>
        </div>
        <form id="lifter-form" onSubmit={handleSubmit}>
          <div className="lifter-form-body">
            <div className="lifter-info-section">
              <div className="form-field lifter-name-field">
                <label htmlFor="name">Lifter Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter lifter name"
                  disabled={isEditMode}
                  autoFocus
                />
              </div>
            </div>

            <div className="calculator-section">
              <button
                type="button"
                className="calculator-toggle"
                onClick={() => setCalcExpanded(!calcExpanded)}
              >
                <span className="toggle-arrow">{calcExpanded ? '▼' : '▶'}</span>
                <span className="calculator-title">1RM Calculator</span>
              </button>

              {calcExpanded && (
                <div className="calculator-content">
                  <div className="calculator-row">
                    <div className="form-field">
                      <label htmlFor="calc-weight">Weight (kg)</label>
                      <input
                        type="number"
                        id="calc-weight"
                        value={calcWeight}
                        onChange={(e) => {
                          setCalcWeight(e.target.value);
                          calculateAndUpdate1RM(e.target.value, calcReps);
                        }}
                        placeholder="0"
                        step="2.5"
                        min="0"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="calc-reps">Reps</label>
                      <input
                        type="number"
                        id="calc-reps"
                        value={calcReps}
                        onChange={(e) => {
                          setCalcReps(e.target.value);
                          calculateAndUpdate1RM(calcWeight, e.target.value);
                        }}
                        placeholder="0"
                        min="1"
                      />
                    </div>
                    <div className="form-field">
                      <label>Result</label>
                      <div className="result-display">
                        <span className="result-value">{calcResult !== null ? `${calcResult} kg` : '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="apply-section">
                    <label className="apply-label">Apply to:</label>
                    <div className="apply-buttons">
                      {EXERCISES.map((exercise) => (
                        <button
                          key={exercise.key}
                          type="button"
                          className="apply-button"
                          onClick={() => applyToExercise(exercise.key)}
                          disabled={calcResult === null}
                        >
                          {exercise.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <h3 className="section-title">One Rep Maxes (kg)</h3>
            <div className="exercises-grid">
              {EXERCISES.map((exercise) => (
                <div key={exercise.key} className="form-field">
                  <label htmlFor={exercise.key}>{exercise.label}</label>
                  <input
                    type="number"
                    id={exercise.key}
                    value={oneRepMaxes[exercise.key]}
                    onChange={(e) => handleExerciseChange(exercise.key, e.target.value)}
                    placeholder="0"
                    step="2.5"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
