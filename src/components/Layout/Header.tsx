import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems: ReadonlyArray<{ to: string; label: string; end?: boolean }> = [
  { to: '/', label: 'Главная', end: true },
  { to: '/biography', label: 'Биография' },
  { to: '/flight', label: 'Полёт' },
  { to: '/technical', label: 'Восток-1' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Закрываем меню при смене маршрута (на случай быстрых тапов).
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // ESC закрывает меню — стандартное поведение dropdown.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block rounded px-3 py-2 text-sm font-medium uppercase tracking-wider transition',
      isActive
        ? 'text-soviet-gold'
        : 'text-ink-soft hover:text-ink hover:bg-white/5',
    ].join(' ');

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-space-deep/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Логотип */}
        <NavLink to="/" className="group flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-soviet-red bg-space-deep font-display text-soviet-red transition group-hover:bg-soviet-red group-hover:text-white"
          >
            ★
          </span>
          <span className="font-display text-lg uppercase tracking-widest">
            <span className="text-soviet-gold">Восток</span>
            <span className="text-ink">-1</span>
          </span>
        </NavLink>

        {/* Десктопная навигация (>= sm) */}
        <nav aria-label="Основная навигация" className="hidden sm:block">
          <ul className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Кнопка-гамбургер (< sm) */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/25 text-ink transition hover:border-soviet-red/60 hover:text-soviet-gold sm:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setIsOpen((v) => !v)}
        >
          <HamburgerIcon open={isOpen} />
        </button>
      </div>

      {/* Мобильная панель навигации */}
      <nav
        id="mobile-nav"
        aria-label="Мобильная навигация"
        className={[
          'overflow-hidden border-t border-white/10 bg-space-deep/95 backdrop-blur transition-[max-height,opacity] duration-300 ease-out sm:hidden',
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <ul className="space-y-1 px-4 py-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  [
                    'flex items-center justify-between rounded px-3 py-3 text-sm font-medium uppercase tracking-wider transition',
                    isActive
                      ? 'bg-soviet-red/10 text-soviet-gold'
                      : 'text-ink-soft hover:bg-white/5 hover:text-ink',
                  ].join(' ')
                }
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-soviet-red"
                >
                  →
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/**
 * Иконка: три полоски, анимированно превращающиеся в крестик при `open`.
 */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        className={`origin-center transition-transform duration-300 ${
          open ? 'translate-y-[6px] rotate-45' : ''
        }`}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        className={`transition-opacity duration-200 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        className={`origin-center transition-transform duration-300 ${
          open ? '-translate-y-[6px] -rotate-45' : ''
        }`}
      />
    </svg>
  );
}
