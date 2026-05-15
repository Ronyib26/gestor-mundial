import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Layout() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-3 py-1.5 shadow-md ring-1 ring-slate-200/60 dark:ring-slate-700/60">
        <ThemeToggle />
      </div>

      {/* ml-20 deja espacio al sidebar colapsado; cuando se expande flota encima del contenido. */}
      <main className="ml-20 mr-4 py-4 sm:py-6 lg:py-8 pr-2 sm:pr-4 lg:pr-6 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
