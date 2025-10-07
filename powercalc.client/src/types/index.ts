export interface Lifter {
  name: string;
  oneRepMaxes: {
    squat: number;
    bench: number;
    deadlift: number;
    ohp: number;
    [key: string]: number;
  };
}

export interface Program {
  name: string;
  weeks: number;
  days: number;
}

export interface AppState {
  currentProgram: string;
  currentWeek: number;
  currentDay: number;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  name: string;
  restSeconds: number;
  sets: WorkoutSet[];
}

export interface LifterWorkout {
  lifterName: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutSession {
  week: number;
  day: number;
  workouts: LifterWorkout[];
}
