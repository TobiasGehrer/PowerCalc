import { WorkoutSession } from '../types';
import ExerciseCard from '../components/ExerciseCard';
import { ArrowLeftIcon, CheckIcon } from '../components/icons';
import { advanceState } from '../services/api';

interface WorkoutViewProps {
  session: WorkoutSession;
  onFinish: () => void;
}

export default function WorkoutView({ session, onFinish }: WorkoutViewProps) {
  const handleFinish = async () => {
    try {
      await advanceState();
      onFinish();
    } catch (error) {
      console.error('Error finishing workout:', error);
    }
  };

  return (
    <div className="workout-view">
      <div className="workout-title-section">
        <h1 onClick={onFinish} className="clickable-title">
          <span className="title-power">Power</span>Calc
        </h1>
        <span className="workout-subtitle">Week {session.week}, Day {session.day}</span>
        <button onClick={handleFinish} className="finish-workout-button" title="Finish Workout">
          <CheckIcon />
        </button>
      </div>

      <div className="workout-content" data-participants={Math.min(session.workouts.length, 3)}>
        {session.workouts.map((workout) => (
          <div key={workout.lifterName} className="lifter-workout">
            <h2>{workout.lifterName}</h2>
            <div className="lifter-exercises">
              {workout.exercises.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} index={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
