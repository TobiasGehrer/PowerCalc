import { WorkoutSession } from '../types';
import { apiRequest } from './apiService';

export interface StartWorkoutSessionRequest {
  programName: string;
  week: number;
  day: number;
  lifterNames: string[];
}

export const startWorkoutSession = async (
  sessionRequest: StartWorkoutSessionRequest
): Promise<WorkoutSession> => {
  return apiRequest<WorkoutSession>('/workouts/session', {
    method: 'POST',
    body: JSON.stringify(sessionRequest),
  });
};
