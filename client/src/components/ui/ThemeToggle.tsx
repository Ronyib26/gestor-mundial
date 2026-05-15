import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  showLabel?: boolean;
}

/**
 * boton para cambiar entre tema claro y oscuro.
 */
export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const switchEl = (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-300 ease-in-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-brand-500',
        isDark ? 'bg-brand-600' : 'bg-slate-300'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-flex items-center justify-center',
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md',
          'transition-transform duration-300 ease-in-out',
          isDark ? 'translate-x-5.5' : 'translate-x-0.5'
        )}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-slate-700" strokeWidth={2.5} />
        ) : (
          <Sun className="w-3 h-3 text-amber-500" strokeWidth={2.5} />
        )}
      </span>
    </button>
  );

  if (!showLabel) return switchEl;

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 w-full">
      <div className="flex items-center gap-2 text-white/70 text-sm min-w-0">
        {isDark ? (
          <Moon className="w-4 h-4 shrink-0" strokeWidth={2} />
        ) : (
          <Sun className="w-4 h-4 shrink-0" strokeWidth={2} />
        )}
        <span className="truncate">
          {isDark ? 'Tema oscuro' : 'Tema claro'}
        </span>
      </div>
      {switchEl}
    </div>
  );
}
