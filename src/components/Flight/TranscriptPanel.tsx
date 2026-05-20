import { useEffect, useRef } from 'react';
import { FootnoteList } from '@/components/Biography/Footnote';
import {
  formatTPlus,
  type Speaker,
  type TranscriptLine,
} from '@/data/timeline';

interface TranscriptPanelProps {
  lines: ReadonlyArray<TranscriptLine>;
  currentSec: number;
  onSeek: (sec: number) => void;
}

/** Цветовое оформление по позывному. */
const SPEAKER_STYLES: Record<Speaker, { color: string; label: string }> = {
  Кедр: {
    color: 'text-soviet-gold',
    label: 'КЕДР',
  },
  'Заря-1': {
    color: 'text-soviet-red-bright',
    label: 'ЗАРЯ-1',
  },
  'Заря-2': {
    color: 'text-soviet-red/80',
    label: 'ЗАРЯ-2',
  },
  'Заря-3': {
    color: 'text-soviet-red/70',
    label: 'ЗАРЯ-3',
  },
  Весна: {
    color: 'text-sky-400',
    label: 'ВЕСНА',
  },
};

/** Окно «активности» вокруг currentSec — реплика считается активной 6 сек. */
const ACTIVE_WINDOW_SEC = 6;

/**
 * Список реплик переговоров «Кедр–Заря» с подсветкой активной строки.
 *
 * Поведение:
 *  - Активной считается реплика, чей `timestamp_sec` ближе всего к
 *    `currentSec` в окне ±ACTIVE_WINDOW_SEC.
 *  - Клик на реплику = seek к этому моменту таймлайна.
 *  - Активная реплика автопрокручивается в видимую область (если пользователь
 *    не двигался по списку самостоятельно).
 *  - Уважает prefers-reduced-motion: без плавной прокрутки.
 */
export default function TranscriptPanel({
  lines,
  currentSec,
  onSeek,
}: TranscriptPanelProps) {
  // Находим активную реплику.
  const activeIdx = findActiveLineIndex(lines, currentSec);
  const activeLineRef = useRef<HTMLLIElement | null>(null);

  // Автопрокрутка к активной реплике.
  useEffect(() => {
    if (activeIdx < 0) return;
    const el = activeLineRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollIntoView({
      block: 'nearest',
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [activeIdx]);

  return (
    <section
      aria-labelledby="transcript-heading"
      className="flex h-full flex-col rounded-2xl border border-white/10 bg-space-mid/40"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-white/10 px-5 py-3">
        <h3
          id="transcript-heading"
          className="font-display text-sm uppercase tracking-widest text-ink"
        >
          Переговоры «Кедр–Заря»
        </h3>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
          {lines.length} реплик
        </p>
      </header>

      <ol className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
        {lines.map((line, idx) => {
          const style = SPEAKER_STYLES[line.speaker];
          const isActive = idx === activeIdx;
          return (
            <li
              key={line.id}
              ref={isActive ? activeLineRef : null}
              className={[
                'rounded-md border-l-2 px-3 py-2 transition',
                isActive
                  ? 'border-soviet-gold bg-soviet-gold/10'
                  : 'border-white/10 hover:border-white/30 hover:bg-white/5',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => onSeek(line.timestamp_sec)}
                className="flex w-full flex-col items-start gap-1 text-left"
                aria-label={`Перейти к ${formatTPlus(line.timestamp_sec)}, ${style.label}`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[0.65rem] text-ink-soft">
                    {formatTPlus(line.timestamp_sec)}
                  </span>
                  <span
                    className={[
                      'font-mono text-[0.65rem] font-bold uppercase tracking-widest',
                      style.color,
                    ].join(' ')}
                    title={line.speakerFull ?? style.label}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="text-ink/90">
                  {line.text}
                  <FootnoteList ids={line.sourceIds} />
                </p>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="border-t border-white/10 px-5 py-3 text-[0.65rem] uppercase tracking-widest text-ink-soft">
        Аудио: рассекреченные записи переговоров «Кедр–Заря» и сообщений ТАСС,
        РГАНТД / Гостелерадиофонд, 1961 (Public Domain в РФ); копии — Wikimedia
        Commons и voicebot.su (educational use).
      </p>
    </section>
  );
}

/** Возвращает индекс активной реплики (-1, если нет в окне). */
function findActiveLineIndex(
  lines: ReadonlyArray<TranscriptLine>,
  currentSec: number,
): number {
  let bestIdx = -1;
  let bestDelta = Number.POSITIVE_INFINITY;
  for (let i = 0; i < lines.length; i++) {
    const delta = Math.abs(lines[i].timestamp_sec - currentSec);
    if (delta < bestDelta && delta <= ACTIVE_WINDOW_SEC) {
      bestDelta = delta;
      bestIdx = i;
    }
  }
  return bestIdx;
}
