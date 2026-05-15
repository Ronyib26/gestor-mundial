import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { groupSchema, type GroupFormData } from '@/lib/schemas';
import { useCreateGroup, useUpdateGroup } from '@/hooks/useGroups';
import { ApiClientError } from '@/api/client';
import type { Group } from '@/types';

interface GroupFormProps {
  group?: Group;
  onSuccess: () => void;
  onCancel: () => void;
}

export function GroupForm({ group, onSuccess, onCancel }: GroupFormProps) {
  const isEdit = Boolean(group);
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: group
      ? { name: group.name, description: group.description ?? '' }
      : { name: '', description: '' },
  });

  const onSubmit = async (data: GroupFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
      };
      if (group) {
        await updateMutation.mutateAsync({ id: group.id, data: payload });
        toast.success('Grupo actualizado');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Grupo creado');
      }
      onSuccess();
    } catch (err) {
      if (err instanceof ApiClientError && err.errors) {
        for (const [field, messages] of Object.entries(err.errors)) {
          setError(field as keyof GroupFormData, { message: messages[0] });
        }
      } else {
        toast.error(err instanceof Error ? err.message : 'Error desconocido');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre del grupo"
        placeholder="Ej: Grupo A"
        error={errors.name?.message}
        {...register('name')}
      />
      <Textarea
        label="Descripción (opcional)"
        placeholder="Descripción breve del grupo..."
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading}>
          {isEdit ? 'Guardar cambios' : 'Crear grupo'}
        </Button>
      </div>
    </form>
  );
}
