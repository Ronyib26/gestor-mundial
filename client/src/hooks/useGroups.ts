import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi, type GroupInput } from '@/api/groups';

const KEYS = {
  all: ['groups'] as const,
  detail: (id: string) => ['groups', id] as const,
};

export function useGroups() {
  return useQuery({ queryKey: KEYS.all, queryFn: groupsApi.list });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => groupsApi.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GroupInput) => groupsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupInput }) =>
      groupsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
