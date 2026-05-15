import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Shuffle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDistributions, useDeleteDistribution } from '@/hooks/useDistributions';
import { formatDateTime } from '@/lib/utils';
import type { Distribution } from '@/types';

export function DistributionsPage() {
  const { data: distributions = [], isLoading } = useDistributions();
  const deleteMutation = useDeleteDistribution();
  const [deleting, setDeleting] = useState<Distribution | undefined>();

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Distribución eliminada');
      setDeleting(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Distribuciones
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Asignaciones aleatorias de equipos a grupos guardadas.
          </p>
        </div>
        <Link
          to="/distribuciones/nueva"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva distribución
        </Link>
      </header>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-slate-500 dark:text-slate-400">
          Cargando...
        </div>
      ) : distributions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm">
          <EmptyState
            icon={Shuffle}
            title="No hay distribuciones guardadas"
            description="Genera tu primera asignación aleatoria de equipos a grupos."
            action={
              <Link
                to="/distribuciones/nueva"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Crear distribución
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {distributions.map((dist) => {
            const totalTeams = dist.groups.reduce(
              (sum, g) => sum + g.teams.length,
              0
            );
            return (
              <div
                key={dist.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-5 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-700 transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
                      <Shuffle
                        className="w-5 h-5 text-violet-600 dark:text-violet-400"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {dist.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>
                          <strong className="text-slate-700 dark:text-slate-300">
                            {dist.groups.length}
                          </strong>{' '}
                          grupos
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span>
                          <strong className="text-slate-700 dark:text-slate-300">
                            {totalTeams}
                          </strong>{' '}
                          equipos
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span>{formatDateTime(dist.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/distribuciones/${dist.id}`}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Ver detalle <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleting(dist)}
                      className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(undefined)}
        onConfirm={handleConfirmDelete}
        title="Eliminar distribución"
        description={`¿Seguro que deseas eliminar "${deleting?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
