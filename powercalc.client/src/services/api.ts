const API_BASE_URL = '/api';

// Lifters
export const getLifters = async () => {
  const response = await fetch(`${API_BASE_URL}/lifters`);
  if (!response.ok) throw new Error('Failed to fetch lifters');
  return response.json();
};

export const createLifter = async (lifter) => {
  const response = await fetch(`${API_BASE_URL}/lifters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lifter),
  });
  if (!response.ok) throw new Error('Failed to create lifter');
  return response.json();
};

export const deleteLifter = async (name) => {
  const response = await fetch(`${API_BASE_URL}/lifters/${name}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete lifter');
};

// Programs
export const getPrograms = async () => {
  const response = await fetch(`${API_BASE_URL}/programs`);
  if (!response.ok) throw new Error('Failed to fetch programs');
  return response.json();
};

export const getProgram = async (name) => {
  const response = await fetch(`${API_BASE_URL}/programs/${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error('Failed to fetch program');
  return response.json();
};

export const createProgram = async (program) => {
  const response = await fetch(`${API_BASE_URL}/programs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(program),
  });
  if (!response.ok) throw new Error('Failed to create program');
  return response.json();
};

export const updateProgram = async (name, program) => {
  const response = await fetch(`${API_BASE_URL}/programs/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(program),
  });
  if (!response.ok) throw new Error('Failed to update program');
  return response.json();
};

export const deleteProgram = async (name) => {
  const response = await fetch(`${API_BASE_URL}/programs/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete program');
};

// State
export const getState = async () => {
  const response = await fetch(`${API_BASE_URL}/state`);
  if (!response.ok) throw new Error('Failed to fetch state');
  return response.json();
};

export const updateState = async (state) => {
  const response = await fetch(`${API_BASE_URL}/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!response.ok) throw new Error('Failed to update state');
  return response.json();
};

export const advanceState = async () => {
  const response = await fetch(`${API_BASE_URL}/state/advance`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to advance state');
};

// Workouts
export const startWorkoutSession = async (sessionRequest) => {
  const response = await fetch(`${API_BASE_URL}/workouts/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionRequest),
  });
  if (!response.ok) throw new Error('Failed to start workout session');
  return response.json();
};
