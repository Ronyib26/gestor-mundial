import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { GroupForm } from '@/components/groups/GroupForm';
import { useGroups, useDeleteGroup } from '@/hooks/useGroups';
import type { Group } from '@/types';

export function GroupsPage() {
  const { data: groups = [], isLoading } = useGroups();
  const deleteMutation = useDeleteGroup();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | undefined>();
  const [deletingGroup, setDeletingGroup] = useState<Group | undefined>();

  const handleCreate = () => {
    setEditingGroup(undefined);
    setModalOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGroup(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGroup) return;
    try {
      await deleteMutation.mutateAsync(deletingGroup.id);
      toast.success('Grupo eliminado');
      setDeletingGroup(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Grupos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Grupos disponibles para asignar equipos.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4" /> Nuevo grupo
        </Button>
      </header>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-slate-500 dark:text-slate-400">
          Cargando...
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm">
          <EmptyState
            icon={FolderOpen}
            title="No hay grupos registrados"
            description="Crea los grupos del torneo (Grupo A, Grupo B, …)."
            action={
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4" /> Crear grupo
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl p-5 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-700 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                    <FolderOpen
                      className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(group)}
                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingGroup(group)}
                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title={editingGroup ? 'Editar grupo' : 'Nuevo grupo'}
        size="md"
      >
        <GroupForm
          group={editingGroup}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingGroup)}
        onClose={() => setDeletingGroup(undefined)}
        onConfirm={handleConfirmDelete}
        title="Eliminar grupo"
        description={`¿Seguro que deseas eliminar "${deletingGroup?.name}"?`}
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
