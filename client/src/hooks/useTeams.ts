import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsApi, type TeamInput } from '@/api/teams';

const KEYS = {
  all: ['teams'] as const,
  detail: (id: string) => ['teams', id] as const,
};

export function useTeams() {
  return useQuery({ queryKey: KEYS.all, queryFn: teamsApi.list });
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => teamsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TeamInput) => teamsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TeamInput }) =>
      teamsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
