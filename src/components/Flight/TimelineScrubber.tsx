import type { ChangeEvent } from 'react';
import type { TimelineEvent } from '@/data/timeline';
import { formatTPlus } from '@/data/timeline';

interface TimelineScrubberProps {
  /** Полная длительность шкалы в секундах (для «Восток-1» — 6480). */
  durationSec: number;
  /** Текущее значение скруббера в секундах. */
  currentSec: number;
  /** Колбэк при перетаскивании / клике / клавиатуре. */
  onSeek: (sec: number) => void;
  /** События, которые отображаются мини-метками под шкалой. */
  events: ReadonlyArray<TimelineEvent>;
  /** ID активного события (для подсветки метки). */
  activeEventId?: string;
}

/**
 * Горизонтальный скруббер таймлайна полёта.
 *
 * UX:
 *  - Шкала от T+0 до T+108 (durationSec).
 *  - Под шкалой — мини-точки событий; крупные точки = isMajor.
 *  - Активная метка подсвечивается.
 *  - Управление: drag мышью/тачем, клик по позиции, клавиатура (стрелки).
 *  - Использует native <input type="range"> — это даёт «бесплатные»
 *    keyboard handling и aria-атрибуты.
 */
export default function TimelineScrubber({
  durationSec,
  currentSec,
  onSeek,
  events,
  activeEventId,
}: TimelineScrubberProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  };

  // Доли позиций для меток на шкале (только события полёта, без предстарта).
  const flightEvents = events.filter(
    (ev) => ev.timestamp_sec >= 0 && ev.timestamp_sec <= durationSec,
  );

  return (
    <div className="w-full">
      {/* Метки сверху: текущая позиция T+ */}
      <div className="mb-2 flex items-baseline justify-between font-mono text-xs text-ink-soft">
        <span className="text-soviet-gold">{formatTPlus(currentSec)}</span>
        <span>{formatTPlus(durationSec)}</span>
      </div>

      <div className="relative">
        {/* Сама шкала-инпут */}
        <input
          type="range"
          min={0}
          max={durationSec}
          step={1}
          value={Math.round(currentSec)}
          onChange={handleChange}
          aria-label="Время полёта"
          aria-valuemin={0}
          aria-valuemax={durationSec}
          aria-valuenow={Math.round(currentSec)}
          aria-valuetext={formatTPlus(currentSec)}
          className="scrubber-range relative z-10 w-full cursor-pointer"
        />

        {/* Мини-метки событий под шкалой */}
        <div className="pointer-events-none absolute inset-x-0 top-full mt-1 h-6">
          {flightEvents.map((ev) => {
            const pct = (ev.timestamp_sec / durationSec) * 100;
            const isActive = ev.id === activeEventId;
            return (
              <span
                key={ev.id}
                title={`${formatTPlus(ev.timestamp_sec)} — ${ev.title}`}
                style={{ left: `${pct}%` }}
                className={[
                  'absolute top-0 -translate-x-1/2 rounded-full transition-all',
                  ev.isMajor ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5',
                  isActive
                    ? 'scale-150 bg-soviet-gold shadow-[0_0_8px_rgba(240,193,75,0.8)]'
                    : ev.highlight === 'success'
                      ? 'bg-emerald-400/70'
                      : ev.highlight === 'tension'
                        ? 'bg-soviet-red-bright/80'
                        : ev.highlight === 'milestone'
                          ? 'bg-soviet-gold/70'
                          : 'bg-ink-soft/50',
                ].join(' ')}
              />
            );
          })}
        </div>
      </div>

      {/* Стилизация native input — CSS пишем здесь, чтобы не разводить
          лишние файлы. Тонкая дорожка, круглый красный thumb. */}
      <style>{`
        .scrubber-range {
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          height: 24px;
        }
        .scrubber-range::-webkit-slider-runnable-track {
          height: 4px;
          background: rgba(168, 179, 199, 0.25);
          border-radius: 2px;
        }
        .scrubber-range::-moz-range-track {
          height: 4px;
          background: rgba(168, 179, 199, 0.25);
          border-radius: 2px;
        }
        .scrubber-range::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #c8102e;
          border: 2px solid #f4ead5;
          margin-top: -6px;
          cursor: grab;
          box-shadow: 0 0 12px rgba(200, 16, 46, 0.6);
        }
        .scrubber-range::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }
        .scrubber-range::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #c8102e;
          border: 2px solid #f4ead5;
          cursor: grab;
          box-shadow: 0 0 12px rgba(200, 16, 46, 0.6);
        }
        .scrubber-range:focus-visible::-webkit-slider-thumb {
          outline: 2px solid #f0c14b;
          outline-offset: 2px;
        }
        .scrubber-range:focus-visible::-moz-range-thumb {
          outline: 2px solid #f0c14b;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
