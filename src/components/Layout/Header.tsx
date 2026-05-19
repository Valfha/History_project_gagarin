import { NavLink } from 'react-router-dom';

const navItems: ReadonlyArray<{ to: string; label: string; end?: boolean }> = [
  { to: '/', label: 'Главная', end: true },
  { to: '/biography', label: 'Биография' },
  { to: '/flight', label: 'Полёт' },
  { to: '/technical', label: 'Восток-1' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-space-deep/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-3 group">
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

        <nav aria-label="Основная навигация">
          <ul className="flex items-center gap-1 sm:gap-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'relative rounded px-2 py-1 text-sm font-medium uppercase tracking-wider transition sm:px-3',
                      isActive
                        ? 'text-soviet-gold'
                        : 'text-ink-soft hover:text-ink',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
