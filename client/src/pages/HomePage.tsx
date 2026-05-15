import { Link } from 'react-router-dom';
import { Users, FolderOpen, Shuffle, ArrowRight, Trophy } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { useDistributions } from '@/hooks/useDistributions';

export function HomePage() {
  const { data: teams = [] } = useTeams();
  const { data: groups = [] } = useGroups();
  const { data: distributions = [] } = useDistributions();

  const stats = [
    {
      label: 'Equipos registrados',
      value: teams.length,
      icon: Users,
      to: '/equipos',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Grupos disponibles',
      value: groups.length,
      icon: FolderOpen,
      to: '/grupos',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Distribuciones guardadas',
      value: distributions.length,
      icon: Shuffle,
      to: '/distribuciones',
      iconBg: 'bg-violet-50 dark:bg-violet-950/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Gestor del Mundial
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Administra equipos, grupos y genera distribuciones aleatorias.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm hover:shadow-md hover:ring-slate-300 dark:hover:ring-slate-700 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-5 h-5 ${stat.iconColor}`}
                  strokeWidth={2}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {stat.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 ring-1 ring-slate-200/80 dark:ring-slate-800/80 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
          ¿Cómo funciona?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Cuatro pasos para generar tu sorteo.
        </p>
        <ol className="space-y-3">
          {[
            'Registra los equipos participantes (país, código FIFA, técnico, jugadores y ranking).',
            'Define los grupos del torneo (Grupo A, Grupo B, …).',
            'En Distribuciones, ingresa cuántos grupos formar. El sistema valida que los equipos puedan distribuirse equitativamente.',
            'Revisa la vista previa aleatoria y guarda la distribución; podrás consultarla luego.',
          ].map((text, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{text}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/distribuciones/nueva"
            className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <Shuffle className="w-4 h-4" />
            Generar distribución
          </Link>
        </div>
      </section>
    </div>
  );
}
