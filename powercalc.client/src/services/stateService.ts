import { AppState } from '../types';
import { apiRequest } from './apiService';

export const getState = async (): Promise<AppState> => {
  return apiRequest<AppState>('/state');
};

export const updateState = async (state: AppState): Promise<AppState> => {
  return apiRequest<AppState>('/state', {
    method: 'PUT',
    body: JSON.stringify(state),
  });
};

export const advanceState = async (): Promise<void> => {
  return apiRequest<void>('/state/advance', {
    method: 'POST',
  });
};
