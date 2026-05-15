import { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { TeamForm } from '@/components/teams/TeamForm';
import { useTeams, useDeleteTeam } from '@/hooks/useTeams';
import type { Team } from '@/types';

export function TeamsPage() {
  const { data: teams = [], isLoading } = useTeams();
  const deleteMutation = useDeleteTeam();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>();
  const [deletingTeam, setDeletingTeam] = useState<Team | undefined>();
  const [search, setSearch] = useState('');

  const filtered = teams.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.countryName.toLowerCase().includes(q) ||
      t.fifaCode.toLowerCase().includes(q) ||
      t.coach.toLowerCase().includes(q)
    );
  });

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTeam(undefined);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTeam(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTeam) return;
    try {
      await deleteMutation.mutateAsync(deletingTeam.id);
      toast.success('Equipo eliminado');
      setDeletingTeam(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Equipos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Países participantes del Mundial.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Nuevo equipo
        </Button>
      </header>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <Input
          placeholder="Buscar por país, código o técnico..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-slate-500 dark:text-slate-400">
          Cargando...
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm">
          <EmptyState
            icon={Users}
            title="No hay equipos registrados"
            description="Comienza creando tu primer equipo participante del Mundial."
            action={
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4" /> Crear equipo
              </Button>
            }
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm overflow-hidden">
          {/* Vista móvil: cards */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 lg:hidden">
            {filtered.map((team) => (
              <div
                key={team.id}
                className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {team.countryName}
                      </span>
                      <span className="text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {team.fifaCode}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      DT: {team.coach}
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <button
                      onClick={() => handleEdit(team)}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingTeam(team)}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>{team.playersCount} jugadores</span>
                  <span>Ranking #{team.fifaRanking}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Vista escritorio: tabla */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-5 py-3">
                    País
                  </th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-5 py-3">
                    Código
                  </th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-5 py-3">
                    Director técnico
                  </th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-5 py-3">
                    Jugadores
                  </th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-5 py-3">
                    Ranking
                  </th>
                  <th className="text-right font-medium text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 px-5 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((team) => (
                  <tr
                    key={team.id}
                    className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {team.countryName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs">
                        {team.fifaCode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {team.coach}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {team.playersCount}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      #{team.fifaRanking}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(team)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTeam(team)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      Sin resultados para "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={editingTeam ? 'Editar equipo' : 'Nuevo equipo'}
        size="md"
      >
        <TeamForm
          team={editingTeam}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingTeam)}
        onClose={() => setDeletingTeam(undefined)}
        onConfirm={handleConfirmDelete}
        title="Eliminar equipo"
        description={`¿Seguro que deseas eliminar "${deletingTeam?.countryName}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
