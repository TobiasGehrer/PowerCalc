import { WorkoutExercise } from '../types';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
}

export default function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <div className="exercise">
      <div className="exercise-badge">{index + 1}</div>
      <div className="exercise-header">
        <div className="exercise-name">{exercise.name}</div>
        <div className="exercise-rest">Rest: {exercise.restSeconds}s</div>
      </div>
      <table className="sets-table">
        <tbody>
          {exercise.sets.map((set) => (
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
  );
}
