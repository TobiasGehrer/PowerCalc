import { Program, FullProgram } from '../types';
import { apiRequest } from './apiService';

export const getPrograms = async (): Promise<Program[]> => {
  return apiRequest<Program[]>('/programs');
};

export const getProgram = async (name: string): Promise<FullProgram> => {
  return apiRequest<FullProgram>(`/programs/${encodeURIComponent(name)}`);
};

export const createProgram = async (program: Program): Promise<Program> => {
  return apiRequest<Program>('/programs', {
    method: 'POST',
    body: JSON.stringify(program),
  });
};

export const updateProgram = async (name: string, program: Program): Promise<Program> => {
  return apiRequest<Program>(`/programs/${encodeURIComponent(name)}`, {
    method: 'PUT',
    body: JSON.stringify(program),
  });
};

export const deleteProgram = async (name: string): Promise<void> => {
  return apiRequest<void>(`/programs/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
};
