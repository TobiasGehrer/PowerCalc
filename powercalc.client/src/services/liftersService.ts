import { Lifter } from '../types';
import { apiRequest } from './apiService';

export const getLifters = async (): Promise<Lifter[]> => {
  return apiRequest<Lifter[]>('/lifters');
};

export const createLifter = async (lifter: Lifter): Promise<Lifter> => {
  return apiRequest<Lifter>('/lifters', {
    method: 'POST',
    body: JSON.stringify(lifter),
  });
};

export const updateLifter = async (oldName: string, lifter: Lifter): Promise<void> => {
  return apiRequest<void>(`/lifters/${encodeURIComponent(oldName)}`, {
    method: 'PUT',
    body: JSON.stringify(lifter),
  });
};

export const deleteLifter = async (name: string): Promise<void> => {
  return apiRequest<void>(`/lifters/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
};
