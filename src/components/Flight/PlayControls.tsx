interface PlayControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (n: number) => void;
}

const SPEEDS: ReadonlyArray<{ value: number; label: string }> = [
  { value: 1, label: '1×' },
  { value: 2, label: '2×' },
  { value: 4, label: '4×' },
  { value: 16, label: '16×' },
];

/**
 * Панель управления плеером: play/pause, reset, переключатель скорости.
 *
 * Скорость нужна, чтобы быстро прокрутить «пустые» участки полёта
 * (например, между T+24 и T+78 — длинная орбитальная фаза без ключевых
 * событий). На 16× все 108 минут проходят за ~6.5 секунд реального времени.
 */
export default function PlayControls({
  isPlaying,
  onToggle,
  onReset,
  speed,
  onSpeedChange,
}: PlayControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Play / Pause */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
        aria-pressed={isPlaying}
        className="group inline-flex h-12 items-center gap-3 rounded-full border-2 border-soviet-red bg-soviet-red/10 px-5 text-sm font-semibold uppercase tracking-widest text-soviet-red transition hover:bg-soviet-red hover:text-white focus-visible:bg-soviet-red focus-visible:text-white"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
        <span className="hidden sm:inline">
          {isPlaying ? 'Пауза' : 'Запуск'}
        </span>
      </button>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        aria-label="Вернуться к началу"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-xs uppercase tracking-widest text-ink-soft transition hover:border-soviet-gold/60 hover:text-ink"
      >
        <ResetIcon />
        <span className="hidden sm:inline">К началу</span>
      </button>

      {/* Speed selector */}
      <div
        role="radiogroup"
        aria-label="Скорость воспроизведения"
        className="ml-auto flex items-center gap-1 rounded-full border border-white/15 p-1"
      >
        {SPEEDS.map((s) => {
          const active = speed === s.value;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSpeedChange(s.value)}
              className={[
                'min-w-[2.75rem] rounded-full px-3 py-1.5 font-mono text-xs transition',
                active
                  ? 'bg-soviet-gold/90 text-space-deep'
                  : 'text-ink-soft hover:text-ink',
              ].join(' ')}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Иконки (инлайн SVG, чтобы не зависеть от внешних библиотек) ---

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
