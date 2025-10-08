import { useState, useEffect } from 'react';
import { FullProgram, WorkoutDay, Exercise } from '../types';
import { getProgram, createProgram, updateProgram, deleteProgram } from '../services/api';
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, DeleteIcon, CopyIcon, PasteIcon, SaveIcon, InfoIcon } from '../components/icons';
import MessageBox from '../components/MessageBox';

interface ProgramEditorProps {
  programName?: string; // undefined for new program
  onClose: () => void;
  onSave: () => void;
}

export default function ProgramEditor({ programName, onClose, onSave }: ProgramEditorProps) {
  const [program, setProgram] = useState<FullProgram>({
    name: '',
    weeks: 1,
    days: 1,
    workouts: [],
  });
  const [originalName, setOriginalName] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedWeek, setCopiedWeek] = useState<WorkoutDay[] | null>(null);
  const [copiedDay, setCopiedDay] = useState<WorkoutDay | null>(null);
  const [messageBox, setMessageBox] = useState<{
    type: 'info' | 'error' | 'confirm';
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const isEditMode = !!programName;

  useEffect(() => {
    loadData();
  }, [programName]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (programName) {
        const data = await getProgram(programName);
        setProgram(data);
        setOriginalName(data.name);
      } else {
        // Initialize empty program with 1 week and 1 day
        initializeEmptyProgram();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeEmptyProgram = () => {
    setProgram({
      name: '',
      weeks: 1,
      days: 1,
      workouts: [
        {
          week: 1,
          day: 1,
          exercises: [],
        },
      ],
    });
  };

  const handleWeeksChange = (newWeeks: number) => {
    const updatedWorkouts = [...program.workouts];

    // Add new weeks if increased
    for (let week = program.weeks + 1; week <= newWeeks; week++) {
      for (let day = 1; day <= program.days; day++) {
        updatedWorkouts.push({
          week,
          day,
          exercises: [],
        });
      }
    }

    // Remove weeks if decreased
    const filteredWorkouts = updatedWorkouts.filter((w) => w.week <= newWeeks);

    setProgram({
      ...program,
      weeks: newWeeks,
      workouts: filteredWorkouts,
    });
  };

  const handleDaysChange = (newDays: number) => {
    const updatedWorkouts = [...program.workouts];

    // Add new days to all weeks if increased
    for (let week = 1; week <= program.weeks; week++) {
      for (let day = program.days + 1; day <= newDays; day++) {
        updatedWorkouts.push({
          week,
          day,
          exercises: [],
        });
      }
    }

    // Remove days if decreased
    const filteredWorkouts = updatedWorkouts.filter((w) => w.day <= newDays);

    setProgram({
      ...program,
      days: newDays,
      workouts: filteredWorkouts,
    });
  };

  const getWeekWorkouts = (): WorkoutDay[] => {
    return program.workouts
      .filter((w) => w.week === selectedWeek)
      .sort((a, b) => a.day - b.day);
  };

  const getWorkout = (week: number, day: number): WorkoutDay | undefined => {
    return program.workouts.find((w) => w.week === week && w.day === day);
  };

  const updateWorkout = (week: number, day: number, updatedWorkout: WorkoutDay) => {
    const index = program.workouts.findIndex((w) => w.week === week && w.day === day);
    const updatedWorkouts = [...program.workouts];

    if (index !== -1) {
      updatedWorkouts[index] = updatedWorkout;
    } else {
      updatedWorkouts.push(updatedWorkout);
    }

    setProgram({
      ...program,
      workouts: updatedWorkouts,
    });
  };

  const addExercise = (week: number, day: number) => {
    const workout = getWorkout(week, day);
    if (!workout) return;

    const newExercise: Exercise = {
      name: '',
      sets: '3',
      reps: '5',
      intensity: '70',
      restSeconds: 180,
      liftType: '',
    };

    updateWorkout(week, day, {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    });
  };

  const updateExercise = (week: number, day: number, exerciseIndex: number, updatedExercise: Exercise) => {
    const workout = getWorkout(week, day);
    if (!workout) return;

    const updatedExercises = [...workout.exercises];
    updatedExercises[exerciseIndex] = updatedExercise;

    updateWorkout(week, day, {
      ...workout,
      exercises: updatedExercises,
    });
  };

  const deleteExercise = (week: number, day: number, exerciseIndex: number) => {
    const workout = getWorkout(week, day);
    if (!workout) return;

    const updatedExercises = workout.exercises.filter((_, index) => index !== exerciseIndex);

    updateWorkout(week, day, {
      ...workout,
      exercises: updatedExercises,
    });
  };

  const handleCopyWeek = () => {
    const weekWorkouts = getWeekWorkouts();
    setCopiedWeek(JSON.parse(JSON.stringify(weekWorkouts))); // Deep copy
    setCopiedDay(null);
  };

  const handlePasteWeek = () => {
    if (!copiedWeek || copiedWeek.length === 0) return;

    const updatedWorkouts = [...program.workouts];

    // Remove existing workouts for the selected week
    const filteredWorkouts = updatedWorkouts.filter((w) => w.week !== selectedWeek);

    // Add copied workouts with the selected week number
    const pastedWorkouts = copiedWeek.map((workout) => ({
      ...workout,
      week: selectedWeek,
      exercises: JSON.parse(JSON.stringify(workout.exercises)), // Deep copy exercises
    }));

    setProgram({
      ...program,
      workouts: [...filteredWorkouts, ...pastedWorkouts],
    });
  };

  const handleCopyDay = (day: number) => {
    const workout = getWorkout(selectedWeek, day);
    if (!workout) return;

    setCopiedDay(JSON.parse(JSON.stringify(workout))); // Deep copy
    setCopiedWeek(null);
  };

  const handlePasteDay = (day: number) => {
    if (!copiedDay) return;

    updateWorkout(selectedWeek, day, {
      week: selectedWeek,
      day: day,
      exercises: JSON.parse(JSON.stringify(copiedDay.exercises)), // Deep copy
    });
  };

  const handleSave = async () => {
    if (!program.name.trim()) {
      setMessageBox({
        type: 'error',
        message: 'Please enter a program name',
        onConfirm: () => setMessageBox(null),
      });
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await updateProgram(originalName, program);
      } else {
        await createProgram(program);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving program:', error);
      setMessageBox({
        type: 'error',
        message: 'Failed to save program',
        onConfirm: () => setMessageBox(null),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !originalName) return;

    setMessageBox({
      type: 'confirm',
      message: `Are you sure you want to delete the program "${originalName}"? This cannot be undone.`,
      onConfirm: async () => {
        setMessageBox(null);
        try {
          setSaving(true);
          await deleteProgram(originalName);
          onSave(); // Refresh the program list
          onClose();
        } catch (error) {
          console.error('Error deleting program:', error);
          setMessageBox({
            type: 'error',
            message: 'Failed to delete program',
            onConfirm: () => setMessageBox(null),
          });
        } finally {
          setSaving(false);
        }
      },
      onCancel: () => setMessageBox(null),
    });
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content program-editor">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  const weekWorkouts = getWeekWorkouts();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content program-editor" onClick={(e) => e.stopPropagation()}>
        <div className="program-editor-header">
          <button onClick={handleSave} disabled={saving} className="save-icon-button" title={saving ? 'Saving...' : 'Save'}>
            <SaveIcon />
          </button>
          <div className="header-actions">
            {isEditMode && (
              <button onClick={handleDelete} disabled={saving} className="delete-icon-button-header" title="Delete Program">
                <DeleteIcon />
              </button>
            )}
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="program-editor-body">
          {/* Basic Program Info */}
          <div className="program-info-section">
            <div className="program-meta-row">
              <div className="form-field program-name-field">
                <label>Program Name:</label>
                <input
                  type="text"
                  value={program.name}
                  onChange={(e) => setProgram({ ...program, name: e.target.value })}
                  placeholder="Enter program name"
                />
              </div>

              <div className="form-field program-weeks-field">
                <label>Weeks:</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={program.weeks}
                  onChange={(e) => handleWeeksChange(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="form-field program-days-field">
                <label>Days per Week:</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={program.days}
                  onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="week-selector-with-actions">
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
            <div className="week-copy-actions">
              <button className="icon-button" onClick={handleCopyWeek} title="Copy Week">
                <CopyIcon />
              </button>
              <button
                className="icon-button icon-button-primary"
                onClick={handlePasteWeek}
                disabled={!copiedWeek}
                title="Paste Week"
              >
                <PasteIcon />
              </button>
            </div>
          </div>

          {/* Workout Days */}
          <div className="week-workouts">
            {weekWorkouts.map((workout) => (
              <div key={workout.day} className="day-section-editor">
                <div className="day-header">
                  <h3>Day {workout.day}</h3>
                  <div className="day-actions">
                    <button
                      className="icon-button"
                      onClick={() => handleCopyDay(workout.day)}
                      title="Copy Day"
                    >
                      <CopyIcon />
                    </button>
                    <button
                      className="icon-button"
                      onClick={() => handlePasteDay(workout.day)}
                      disabled={!copiedDay}
                      title="Paste Day"
                    >
                      <PasteIcon />
                    </button>
                  </div>
                </div>

                <div className="exercises-list-editor">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-editor">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) =>
                          updateExercise(workout.week, workout.day, index, {
                            ...exercise,
                            name: e.target.value,
                          })
                        }
                        placeholder="Exercise name"
                        className="exercise-name-input"
                      />
                      <div className="input-with-info">
                        <input
                          type="text"
                          value={exercise.liftType}
                          onChange={(e) =>
                            updateExercise(workout.week, workout.day, index, {
                              ...exercise,
                              liftType: e.target.value,
                            })
                          }
                          placeholder="Lift type"
                          className="exercise-type-input"
                        />
                        <span
                          className="info-icon-inline"
                          title="Determines which 1RM is used for weight calculation. Examples: squat, bench, deadlift, ohp. Prefix with 'pause' (e.g., pauseSquat) to use 95% of 1RM."
                        >
                          <InfoIcon />
                        </span>
                      </div>
                      <div className="input-with-info">
                        <input
                          type="text"
                          value={exercise.sets}
                          onChange={(e) =>
                            updateExercise(workout.week, workout.day, index, {
                              ...exercise,
                              sets: e.target.value,
                            })
                          }
                          placeholder="Sets"
                          className="exercise-detail-input"
                        />
                        <span
                          className="info-icon-inline"
                          title="Use '/' to separate values for different set groups. Example: 1/2 means 1 set, then 2 sets"
                        >
                          <InfoIcon />
                        </span>
                      </div>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(workout.week, workout.day, index, {
                            ...exercise,
                            reps: e.target.value,
                          })
                        }
                        placeholder="Reps"
                        className="exercise-detail-input"
                      />
                      <div className="input-with-info">
                        <input
                          type="text"
                          value={exercise.intensity}
                          onChange={(e) =>
                            updateExercise(workout.week, workout.day, index, {
                              ...exercise,
                              intensity: e.target.value,
                            })
                          }
                          placeholder="Intensity"
                          className="exercise-detail-input"
                        />
                        <span
                          className="info-icon-inline"
                          title="Use '/' to separate values for different set groups. Example: 85/70 means first sets at 85%, then sets at 70%"
                        >
                          <InfoIcon />
                        </span>
                      </div>
                      <input
                        type="number"
                        value={exercise.restSeconds}
                        onChange={(e) =>
                          updateExercise(workout.week, workout.day, index, {
                            ...exercise,
                            restSeconds: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="Rest"
                        className="exercise-detail-input"
                      />
                      <button
                        className="icon-button delete-icon-button"
                        onClick={() => deleteExercise(workout.week, workout.day, index)}
                        title="Delete Exercise"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  ))}

                  <button
                    className="add-exercise-button"
                    onClick={() => addExercise(workout.week, workout.day)}
                    title="Add Exercise"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
