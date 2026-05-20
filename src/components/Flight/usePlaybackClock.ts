import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Часы воспроизведения таймлайна.
 *
 * Представляет текущий момент полёта (currentSec) и управляет автопрокруткой
 * с заданной скоростью. Когда таймлайн «играет», currentSec увеличивается на
 * deltaTime * speed каждый кадр через requestAnimationFrame.
 *
 * Часы НЕ привязаны к реальному аудио — это «эмулированное воспроизведение»
 * полётной шкалы. Реальные аудиоклипы запускаются отдельным эффектом, который
 * подписывается на currentSec.
 */
interface UsePlaybackClockOptions {
  /** Длительность таймлайна в секундах (например, 6480 для 108-мин полёта). */
  durationSec: number;
  /**
   * Минимально допустимое значение currentSec. По умолчанию 0 (от старта).
   * Может быть отрицательным — например, -5400 для предстартовой фазы
   * (T-1:30 → подъём космонавтов). Используется как нижняя граница `seek()`.
   */
  minSec?: number;
  /** Начальная скорость (1x по умолчанию). Поддерживаемые: 1, 2, 4, 16. */
  initialSpeed?: number;
}

export interface PlaybackClock {
  currentSec: number;
  isPlaying: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  seek: (sec: number) => void;
  setSpeed: (n: number) => void;
}

export function usePlaybackClock({
  durationSec,
  minSec = 0,
  initialSpeed = 1,
}: UsePlaybackClockOptions): PlaybackClock {
  const [currentSec, setCurrentSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  // RAF-цикл. Используем рефы, чтобы не пересоздавать петлю при изменении
  // currentSec — он апдейтится изнутри.
  const rafIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      const prev = lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      if (prev !== null) {
        const deltaMs = timestamp - prev;
        const deltaSec = (deltaMs / 1000) * speed;
        setCurrentSec((current) => {
          const next = current + deltaSec;
          if (next >= durationSec) {
            setIsPlaying(false);
            return durationSec;
          }
          return next;
        });
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [isPlaying, speed, durationSec]);

  const play = useCallback(() => {
    setCurrentSec((s) => (s >= durationSec ? 0 : s));
    setIsPlaying(true);
  }, [durationSec]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const toggle = useCallback(() => {
    setIsPlaying((p) => {
      // При возобновлении с конца — начинаем сначала.
      if (!p) {
        setCurrentSec((s) => (s >= durationSec ? 0 : s));
      }
      return !p;
    });
  }, [durationSec]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentSec(0);
  }, []);

  const seek = useCallback(
    (sec: number) => {
      const clamped = Math.max(minSec, Math.min(sec, durationSec));
      setCurrentSec(clamped);
    },
    [durationSec, minSec],
  );

  return {
    currentSec,
    isPlaying,
    speed,
    play,
    pause,
    toggle,
    reset,
    seek,
    setSpeed,
  };
}
