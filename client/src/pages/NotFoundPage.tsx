import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <div className="text-6xl font-bold text-slate-300 dark:text-slate-700">
        404
      </div>
      <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
        Página no encontrada
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        La ruta que buscas no existe.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm hover:shadow-md transition-all"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
