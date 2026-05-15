import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shuffle,
  Save,
  AlertCircle,
  CheckCircle2,
  Users,
  FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import {
  usePreviewDistribution,
  useSaveDistribution,
} from '@/hooks/useDistributions';
import { ApiClientError } from '@/api/client';
import type { DistributionPreview } from '@/types';

export function FormationPage() {
  const navigate = useNavigate();
  const { data: teams = [] } = useTeams();
  const { data: groups = [] } = useGroups();
  const previewMutation = usePreviewDistribution();
  const saveMutation = useSaveDistribution();

  const [groupsCount, setGroupsCount] = useState<number | ''>('');
  const [distributionName, setDistributionName] = useState('');
  const [preview, setPreview] = useState<DistributionPreview | null>(null);

  const clientValidation = useMemo(() => {
    if (groupsCount === '' || groupsCount === 0) {
      return { ok: false, message: null };
    }
    if (groupsCount <= 1) {
      return {
        ok: false,
        message: 'La cantidad de grupos debe ser mayor a 1.',
      };
    }
    if (groupsCount > groups.length) {
      return {
        ok: false,
        message: `Solo hay ${groups.length} grupos registrados. Crea más grupos primero.`,
      };
    }
    if (teams.length === 0) {
      return {
        ok: false,
        message: 'No hay equipos registrados.',
      };
    }
    if (teams.length % groupsCount !== 0) {
      return {
        ok: false,
        message: `Los ${teams.length} equipos no se dividen exactamente entre ${groupsCount} grupos. Cada grupo debe tener la misma cantidad de equipos.`,
      };
    }
    return {
      ok: true,
      message: `Vas a formar ${groupsCount} grupos de ${teams.length / groupsCount} equipos cada uno.`,
    };
  }, [groupsCount, groups.length, teams.length]);

  const handleGenerate = async () => {
    if (!clientValidation.ok || groupsCount === '') return;
    try {
      const result = await previewMutation.mutateAsync({ groupsCount });
      setPreview(result);
      toast.success('Vista previa generada');
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Error al generar la vista previa');
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    if (!distributionName.trim()) {
      toast.error('Ingresa un nombre para la distribución');
      return;
    }
    try {
      const saved = await saveMutation.mutateAsync({
        name: distributionName.trim(),
        groups: preview.groups.map((g) => ({
          groupId: g.groupId,
          teamIds: g.teamIds,
        })),
      });
      toast.success('Distribución guardada');
      navigate(`/distribuciones/${saved.id}`);
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Error al guardar');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        to="/distribuciones"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a distribuciones
      </Link>

      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Nueva distribución
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Genera una asignación aleatoria de equipos a grupos.
        </p>
      </header>

      {/* Inventario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {teams.length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Equipos disponibles
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {groups.length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Grupos disponibles
            </div>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Configuración
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          ¿En cuántos grupos quieres distribuir los equipos?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
          <Input
            type="number"
            min={2}
            max={groups.length || undefined}
            placeholder="Ej: 4"
            value={groupsCount}
            onChange={(e) => {
              const val = e.target.value;
              setGroupsCount(val === '' ? '' : Number(val));
              setPreview(null);
            }}
          />
          <Button
            onClick={handleGenerate}
            disabled={!clientValidation.ok}
            loading={previewMutation.isPending}
            size="lg"
          >
            <Shuffle className="w-4 h-4" /> Generar asignación
          </Button>
        </div>

        {clientValidation.message && (
          <div
            className={`mt-4 rounded-xl p-3.5 flex items-start gap-2.5 text-sm ${
              clientValidation.ok
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-200/60 dark:ring-emerald-800/40'
                : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 ring-1 ring-amber-200/60 dark:ring-amber-800/40'
            }`}
          >
            {clientValidation.ok ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="leading-relaxed">{clientValidation.message}</span>
          </div>
        )}
      </section>

      {/* Reglas */}
      <details className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm group">
        <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-between">
          <span>Ver reglas de validación</span>
          <span className="text-slate-400 dark:text-slate-500 group-open:rotate-180 transition-transform">
            ▾
          </span>
        </summary>
        <ul className="px-5 pb-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          {[
            'La cantidad de grupos debe ser mayor a 1.',
            'No puede superar la cantidad de grupos registrados.',
            'El total de equipos debe dividirse exactamente entre la cantidad de grupos (sin restos).',
            'Todos los equipos se asignan; ningún equipo se repite.',
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-slate-400 dark:text-slate-500 mt-0.5">•</span>
              <span className="leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </details>

      {/* Vista previa */}
      {preview && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Vista previa
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {preview.groups.length} grupos de {preview.teamsPerGroup} equipos
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleGenerate}
              loading={previewMutation.isPending}
            >
              <Shuffle className="w-4 h-4" /> Volver a generar
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preview.groups.map((g) => (
              <div
                key={g.groupId}
                className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {g.groupName}
                  </h3>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {g.teams.map((team) => (
                    <li
                      key={team.id}
                      className="px-4 py-2.5 flex items-center justify-between text-sm"
                    >
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {team.countryName}
                      </span>
                      <span className="font-mono font-semibold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {team.fifaCode}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Guardar */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Guardar distribución
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Ponle un nombre para identificarla después.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
              <Input
                placeholder="Ej: Sorteo final Mundial 2026"
                value={distributionName}
                onChange={(e) => setDistributionName(e.target.value)}
                maxLength={100}
              />
              <Button
                onClick={handleSave}
                disabled={!distributionName.trim()}
                loading={saveMutation.isPending}
                size="lg"
              >
                <Save className="w-4 h-4" /> Guardar
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
