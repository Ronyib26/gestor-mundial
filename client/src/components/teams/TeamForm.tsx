import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { teamSchema, type TeamFormData } from '@/lib/schemas';
import { useCreateTeam, useUpdateTeam } from '@/hooks/useTeams';
import { ApiClientError } from '@/api/client';
import type { Team } from '@/types';

interface TeamFormProps {
  team?: Team;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TeamForm({ team, onSuccess, onCancel }: TeamFormProps) {
  const isEdit = Boolean(team);
  const createMutation = useCreateTeam();
  const updateMutation = useUpdateTeam();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: team
      ? {
          countryName: team.countryName,
          fifaCode: team.fifaCode,
          coach: team.coach,
          playersCount: team.playersCount,
          fifaRanking: team.fifaRanking,
        }
      : {
          countryName: '',
          fifaCode: '',
          coach: '',
          playersCount: 23,
          fifaRanking: 1,
        },
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      if (team) {
        await updateMutation.mutateAsync({ id: team.id, data });
        toast.success('Equipo actualizado');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Equipo creado');
      }
      onSuccess();
    } catch (err) {
      if (err instanceof ApiClientError && err.errors) {
        for (const [field, messages] of Object.entries(err.errors)) {
          setError(field as keyof TeamFormData, {
            message: messages[0],
          });
        }
      } else {
        toast.error(err instanceof Error ? err.message : 'Error desconocido');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre del país"
        placeholder="Ej: Argentina"
        error={errors.countryName?.message}
        {...register('countryName')}
      />
      <Input
        label="Código FIFA"
        placeholder="Ej: ARG"
        maxLength={3}
        style={{ textTransform: 'uppercase' }}
        error={errors.fifaCode?.message}
        hint="Exactamente 3 letras (ej. ARG, BRA, GTM)"
        {...register('fifaCode')}
      />
      <Input
        label="Director técnico"
        placeholder="Ej: Lionel Scaloni"
        error={errors.coach?.message}
        {...register('coach')}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Jugadores inscritos"
          type="number"
          min={23}
          max={26}
          error={errors.playersCount?.message}
          hint="Entre 23 y 26"
          {...register('playersCount')}
        />
        <Input
          label="Ranking FIFA"
          type="number"
          min={1}
          error={errors.fifaRanking?.message}
          {...register('fifaRanking')}
        />
      </div>

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
          {isEdit ? 'Guardar cambios' : 'Crear equipo'}
        </Button>
      </div>
    </form>
  );
}
