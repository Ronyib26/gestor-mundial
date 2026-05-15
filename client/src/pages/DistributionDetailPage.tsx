import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useDistribution } from '@/hooks/useDistributions';
import { formatDateTime } from '@/lib/utils';

export function DistributionDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: dist, isLoading, error } = useDistribution(id);

  if (isLoading) {
    return (
      <div className="text-center py-16 text-sm text-slate-500 dark:text-slate-400">
        Cargando...
      </div>
    );
  }

  if (error || !dist) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-red-600 dark:text-red-400 text-sm">
          No se pudo cargar la distribución.
        </p>
        <Link
          to="/distribuciones"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>
      </div>
    );
  }

  const totalTeams = dist.groups.reduce((sum, g) => sum + g.teams.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        to="/distribuciones"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a distribuciones
      </Link>

      <header className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
            {dist.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <span>{formatDateTime(dist.createdAt)}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
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
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dist.groups.map((dg) => (
          <div
            key={dg.group.id}
            className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {dg.group.name}
              </h3>
              {dg.group.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {dg.group.description}
                </p>
              )}
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {dg.teams.map((team) => (
                <li
                  key={team.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {team.countryName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      DT: {team.coach}
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded shrink-0 ml-2">
                    {team.fifaCode}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
