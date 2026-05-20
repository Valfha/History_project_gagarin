import { FootnoteList } from '@/components/Biography/Footnote';
import type { TimelineEvent } from '@/data/timeline';
import { formatTPlus } from '@/data/timeline';

interface EventCardProps {
  event: TimelineEvent;
  /** Есть ли реальный аудиоклип у этого события (если да — рендерим кнопку). */
  hasAudio: boolean;
  /** Колбэк: пользователь нажал «слушать аудио». */
  onPlayAudio: () => void;
}

const HIGHLIGHT_STYLES = {
  success: {
    border: 'border-emerald-400/40',
    badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    label: 'УСПЕХ',
  },
  tension: {
    border: 'border-soviet-red/50',
    badge: 'bg-soviet-red/15 text-soviet-red-bright border-soviet-red/40',
    label: 'КРИТИЧЕСКАЯ ФАЗА',
  },
  milestone: {
    border: 'border-soviet-gold/40',
    badge: 'bg-soviet-gold/15 text-soviet-gold border-soviet-gold/40',
    label: 'ВЕХА',
  },
} as const;

/**
 * Большая карточка текущего события. Сменяется при перемещении скруббера —
 * обёртка применяет к ней мягкий fade-in через key.
 */
export default function EventCard({
  event,
  hasAudio,
  onPlayAudio,
}: EventCardProps) {
  const highlight = event.highlight ? HIGHLIGHT_STYLES[event.highlight] : null;

  return (
    <article
      aria-live="polite"
      aria-atomic="true"
      className={[
        'relative overflow-hidden rounded-2xl border bg-space-mid/70 p-6 backdrop-blur-sm transition',
        highlight ? highlight.border : 'border-white/10',
      ].join(' ')}
    >
      {/* Левая красная полоса-акцент */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-soviet-red"
      />

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Бейдж с T+ и MSK */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-soviet-red/60 bg-soviet-red/10 px-2 py-0.5 font-mono text-xs text-soviet-red">
              {formatTPlus(event.timestamp_sec)}
            </span>
            <span className="font-mono text-xs text-ink-soft">
              {event.moscowTime} МСК
            </span>
            {highlight && (
              <span
                className={[
                  'rounded border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest',
                  highlight.badge,
                ].join(' ')}
              >
                {highlight.label}
              </span>
            )}
          </div>

          <h3 className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide text-ink sm:text-3xl">
            {event.title}
          </h3>
        </div>

        {hasAudio && (
          <button
            type="button"
            onClick={onPlayAudio}
            aria-label="Прослушать аудиозапись этого момента"
            className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-soviet-gold bg-soviet-gold/10 text-soviet-gold transition hover:bg-soviet-gold hover:text-space-deep focus-visible:bg-soviet-gold focus-visible:text-space-deep"
            title="Прослушать запись (Поехали!)"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </header>

      <p className="mt-4 text-base leading-relaxed text-ink/90">
        {event.description}
        <FootnoteList ids={event.sourceIds} />
      </p>
    </article>
  );
}
