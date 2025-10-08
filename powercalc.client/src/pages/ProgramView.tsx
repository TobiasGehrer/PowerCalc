import { useState, useEffect } from 'react';
import { FullProgram, WorkoutDay } from '../types';
import { getProgram } from '../services/api';
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons';

interface ProgramViewProps {
  programName: string;
  onClose: () => void;
}

export default function ProgramView({ programName, onClose }: ProgramViewProps) {
  const [program, setProgram] = useState<FullProgram | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgram();
  }, [programName]);

  const loadProgram = async () => {
    try {
      setLoading(true);
      const data = await getProgram(programName);
      setProgram(data);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekWorkouts = (): WorkoutDay[] => {
    if (!program) return [];
    return program.workouts
      .filter((w) => w.week === selectedWeek)
      .sort((a, b) => a.day - b.day);
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content program-view">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="modal-overlay">
        <div className="modal-content program-view">
          <div>Program not found</div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const weekWorkouts = getWeekWorkouts();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content program-view" onClick={(e) => e.stopPropagation()}>
        <div className="program-view-header">
          <h2>{program.name}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="program-view-body">
          <div className="week-selector">
            <button
              className="week-nav-button"
              onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
              disabled={selectedWeek === 1}
            >
              <ArrowLeftIcon />
            </button>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            >
              {Array.from({ length: program.weeks }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Week {i + 1}
                </option>
              ))}
            </select>
            <button
              className="week-nav-button"
              onClick={() => setSelectedWeek(Math.min(program.weeks, selectedWeek + 1))}
              disabled={selectedWeek === program.weeks}
            >
              <ArrowRightIcon />
            </button>
          </div>

          {weekWorkouts.length > 0 ? (
            <div className="week-workouts">
              {weekWorkouts.map((workout) => (
                <div key={workout.day} className="day-section">
                  <h3>Day {workout.day}</h3>
                  <div className="exercises-list">
                    {workout.exercises.map((exercise, index) => (
                      <div key={index} className="exercise-card">
                        <div className="exercise-header">
                          <h4>{exercise.name}</h4>
                          <span className="exercise-type">{exercise.liftType}</span>
                        </div>
                        <div className="exercise-details">
                          <div className="exercise-detail">
                            <span className="label">Sets:</span>
                            <span className="value">{exercise.sets}</span>
                          </div>
                          <div className="exercise-detail">
                            <span className="label">Reps:</span>
                            <span className="value">{exercise.reps}</span>
                          </div>
                          <div className="exercise-detail">
                            <span className="label">Intensity:</span>
                            <span className="value">{exercise.intensity}%</span>
                          </div>
                          <div className="exercise-detail">
                            <span className="label">Rest:</span>
                            <span className="value">{exercise.restSeconds}s</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-workout">No workouts found for this week</div>
          )}
        </div>
      </div>
    </div>
  );
}
