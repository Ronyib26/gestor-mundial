import { api } from './client';
import type { Team } from '@/types';

export interface TeamInput {
  countryName: string;
  fifaCode: string;
  coach: string;
  playersCount: number;
  fifaRanking: number;
}

export const teamsApi = {
  list: () => api.get<Team[]>('/teams'),
  get: (id: string) => api.get<Team>(`/teams/${id}`),
  create: (data: TeamInput) => api.post<Team>('/teams', data),
  update: (id: string, data: TeamInput) => api.put<Team>(`/teams/${id}`, data),
  remove: (id: string) => api.delete<void>(`/teams/${id}`),
};
