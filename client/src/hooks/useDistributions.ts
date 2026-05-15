import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  distributionsApi,
  type DistributionPreviewInput,
  type DistributionSaveInput,
} from '@/api/distributions';

const KEYS = {
  all: ['distributions'] as const,
  detail: (id: string) => ['distributions', id] as const,
};

export function useDistributions() {
  return useQuery({ queryKey: KEYS.all, queryFn: distributionsApi.list });
}

export function useDistribution(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => distributionsApi.get(id),
    enabled: Boolean(id),
  });
}

export function usePreviewDistribution() {
  return useMutation({
    mutationFn: (data: DistributionPreviewInput) =>
      distributionsApi.preview(data),
  });
}

export function useSaveDistribution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DistributionSaveInput) => distributionsApi.save(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteDistribution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => distributionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
