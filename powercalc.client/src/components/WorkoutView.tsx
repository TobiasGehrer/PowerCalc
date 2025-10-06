import { advanceState } from '../services/api';

interface WorkoutViewProps {
  session: any;
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
      <div className="workout-header">
        <h1>
          Week {session.week} - Day {session.day}
        </h1>
        <button onClick={onFinish} className="back-button">
          Back to Dashboard
        </button>
        <button onClick={handleFinish} className="finish-button">
          Finish Workout
        </button>
      </div>

      <div className="workout-content" data-participants={Math.min(session.workouts.length, 3)}>
        {session.workouts.map((workout: any) => (
          <div key={workout.lifterName} className="lifter-workout">
            <h2>{workout.lifterName}</h2>
            <div className="lifter-exercises">
              {workout.exercises.map((exercise: any, index: number) => (
                <div key={index} className="exercise">
                  <div className="exercise-badge">{index + 1}</div>
                  <div className="exercise-header">
                    <div className="exercise-name">{exercise.name}</div>
                    <div className="exercise-rest">Rest: {exercise.restSeconds}s</div>
                  </div>
                  <table className="sets-table">
                    <tbody>
                      {exercise.sets.map((set: any) => (
                        <tr key={set.setNumber}>
                          <td>{set.setNumber}. Set</td>
                          <td>
                            <span className="weight">
                              {set.reps} x {set.weight} kg
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
