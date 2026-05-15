import { useState, type ComponentType } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Shuffle,
  Menu,
  X,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
  exact?: boolean;
}

const principalItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Inicio', path: '/', exact: true },
];

const datosItems: MenuItem[] = [
  { icon: Users, label: 'Equipos', path: '/equipos' },
  { icon: FolderOpen, label: 'Grupos', path: '/grupos' },
];

const mundialItems: MenuItem[] = [
  { icon: Shuffle, label: 'Distribuciones', path: '/distribuciones' },
];

interface NavGroupProps {
  label: string;
  items: MenuItem[];
  isOpen: boolean;
  isActive: (path: string, exact?: boolean) => boolean;
  onNavigate: (path: string) => void;
}

function NavGroup({
  label,
  items,
  isOpen,
  isActive,
  onNavigate,
}: NavGroupProps) {
  return (
    <div className="space-y-0.5">
      {isOpen && (
        <p className="text-[10px] uppercase tracking-widest text-white/40 px-3 pt-3 pb-1">
          {label}
        </p>
      )}
      {items.map((item) => {
        const active = isActive(item.path, item.exact);
        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={cn(
              'group relative flex items-center gap-3 h-10 px-3 rounded-lg',
              'cursor-pointer bg-transparent border-0 pointer-events-auto',
              'transition-all duration-200',
              active
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white',
              isOpen ? 'w-full' : 'w-10'
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-500 rounded-r-full" />
            )}
            <item.icon
              className={cn(
                'w-5 h-5 shrink-0 transition-colors',
                active ? 'text-brand-400' : ''
              )}
              strokeWidth={2}
            />
            <span
              className={cn(
                'text-sm whitespace-nowrap transition-opacity duration-250',
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              )}
            >
              {item.label}
            </span>
            {!isOpen && (
              <span
                className={cn(
                  'absolute left-14 px-3 py-1.5 rounded-md text-xs text-white',
                  'whitespace-nowrap opacity-0 pointer-events-none',
                  'group-hover:opacity-100 transition-opacity duration-200',
                  'bg-slate-900/90 backdrop-blur-xl ring-1 ring-white/10 shadow-lg'
                )}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <aside
      className={cn(
        'fixed top-4 left-4 bottom-4 z-50 rounded-2xl',
        'bg-slate-700/85 dark:bg-slate-900/85',
        'backdrop-blur-xl ring-1 ring-white/10',
        'shadow-2xl shadow-slate-900/20',
        'transition-[width] duration-450 ease-in-out',
        isOpen ? 'w-56 overflow-hidden' : 'w-14'
      )}
    >
      {/* pointer-events-none cuando está colapsado para que el overflow no capture clicks; los botones individuales reactivan eventos con pointer-events-auto. */}
      <div
        className={cn(
          'absolute inset-0 w-56 flex flex-col',
          isOpen ? '' : 'pointer-events-none'
        )}
      >
        <div className="flex items-center h-14 px-1.5 shrink-0">
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="w-10 h-10 grid place-items-center text-white/85 hover:text-white transition-colors cursor-pointer bg-transparent border-0 pointer-events-auto rounded-lg hover:bg-white/5"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div
            className={cn(
              'flex items-center gap-2 ml-1 whitespace-nowrap transition-opacity duration-250',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-brand-400" />
            </div>
            <span className="text-white font-semibold text-sm">
              Gestor Mundial
            </span>
          </div>
        </div>

        {isOpen && (
          <div className="mx-3 border-t border-white/10 mb-1 shrink-0" />
        )}

        <nav className="flex-1 flex flex-col px-1.5 overflow-y-auto overflow-x-hidden">
          <NavGroup
            label="Principal"
            items={principalItems}
            isOpen={isOpen}
            isActive={isActive}
            onNavigate={handleNavigate}
          />
          <NavGroup
            label="Datos"
            items={datosItems}
            isOpen={isOpen}
            isActive={isActive}
            onNavigate={handleNavigate}
          />
          <NavGroup
            label="Mundial"
            items={mundialItems}
            isOpen={isOpen}
            isActive={isActive}
            onNavigate={handleNavigate}
          />
          <div className="flex-1" />
        </nav>
      </div>
    </aside>
  );
}
