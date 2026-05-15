import { api } from './client';
import type { Group } from '@/types';

export interface GroupInput {
  name: string;
  description?: string | null;
}

export const groupsApi = {
  list: () => api.get<Group[]>('/groups'),
  get: (id: string) => api.get<Group>(`/groups/${id}`),
  create: (data: GroupInput) => api.post<Group>('/groups', data),
  update: (id: string, data: GroupInput) =>
    api.put<Group>(`/groups/${id}`, data),
  remove: (id: string) => api.delete<void>(`/groups/${id}`),
};
