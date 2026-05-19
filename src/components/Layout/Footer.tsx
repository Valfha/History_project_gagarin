export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-white/10 bg-space-deep/90">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display uppercase tracking-widest text-ink">
              Восток-1 · 12 апреля 1961
            </p>
            <p className="mt-1 max-w-prose">
              Научно-популярный сайт о первом полёте человека в космос. Контент основан на
              открытых источниках (РГАНТД, Роскосмос, мемуары участников программы).
            </p>
          </div>
          <div className="text-xs">
            <p>© {new Date().getFullYear()} Учебный проект</p>
            <p className="mt-1">
              Изображения и аудио — Public Domain / Creative Commons.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
