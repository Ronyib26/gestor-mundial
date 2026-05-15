import { api } from './client';
import type { Distribution, DistributionPreview } from '@/types';

export interface DistributionPreviewInput {
  groupsCount: number;
}

export interface DistributionSaveInput {
  name: string;
  groups: {
    groupId: string;
    teamIds: string[];
  }[];
}

export const distributionsApi = {
  list: () => api.get<Distribution[]>('/distributions'),
  get: (id: string) => api.get<Distribution>(`/distributions/${id}`),
  preview: (data: DistributionPreviewInput) =>
    api.post<DistributionPreview>('/distributions/preview', data),
  save: (data: DistributionSaveInput) =>
    api.post<Distribution>('/distributions', data),
  remove: (id: string) => api.delete<void>(`/distributions/${id}`),
};
