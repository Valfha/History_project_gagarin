import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { TimelineEvent } from '@/data/timeline';

/**
 * Хук, который связывает часы таймлайна с аудиоклипами событий.
 *
 * Логика:
 *  - Преподгружает уникальные аудиофайлы (по полю `event.audio`) в кэш
 *    HTMLAudioElement.
 *  - Когда `currentSec` пересекает таймстемп события с аудио ВО ВРЕМЯ
 *    автопроигрывания (isPlaying === true), запускает соответствующий клип.
 *  - Защищён от повторного срабатывания: каждый клип в текущей сессии
 *    «проигран» только один раз; флаг сбрасывается при seek/reset.
 *
 * HTMLAudioElement используется намеренно вместо Tone.js: клипы короткие,
 * one-shot, без эффектов. Это даёт минимальный bundle-size прирост и
 * избавляет от необходимости инициализировать AudioContext через
 * Tone.start().
 */
interface UseAudioClipsOptions {
  events: ReadonlyArray<TimelineEvent>;
  currentSec: number;
  isPlaying: boolean;
  /** Множитель громкости 0…1 (по умолчанию 0.8). */
  volume?: number;
  /** Если true — клипы не запускаются (например, в reduce-motion режиме). */
  muted?: boolean;
}

export interface AudioClipsApi {
  /** Принудительно проиграть аудио конкретного события (кнопка ▶ на карточке). */
  playClipForEvent: (eventId: string) => Promise<void>;
  /** Остановить любой текущий клип. */
  stopAllClips: () => void;
  /**
   * Разблокирует все Audio-элементы для последующего автозапуска.
   * Должен вызываться синхронно изнутри обработчика user-gesture
   * (например, клик по кнопке Play): тихо запускает и сразу ставит
   * на паузу каждый клип, чтобы браузер запомнил «пользователь разрешил».
   */
  primeAudio: () => void;
}

export function useAudioClips({
  events,
  currentSec,
  isPlaying,
  volume = 0.8,
  muted = false,
}: UseAudioClipsOptions): AudioClipsApi {
  // Кэш Audio-элементов, ключ — относительный путь.
  const audioCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Set айди событий, чьи клипы уже запускались в текущей «сессии»
  // (сбрасывается при seek назад).
  const playedRef = useRef<Set<string>>(new Set());

  // Предыдущий currentSec — нужен для определения направления и пересечения.
  const lastSecRef = useRef<number>(currentSec);

  // События с аудио — стабилизируем мемо.
  const audioEvents = useMemo(
    () => events.filter((e) => e.audio !== undefined),
    [events],
  );

  // Преподгрузка аудиофайлов при изменении списка.
  useEffect(() => {
    for (const ev of audioEvents) {
      if (!ev.audio) continue;
      if (audioCacheRef.current.has(ev.audio)) continue;
      const url = `${import.meta.env.BASE_URL}${ev.audio}`;
      const el = new Audio(url);
      el.preload = 'auto';
      el.volume = volume;
      audioCacheRef.current.set(ev.audio, el);
    }
  }, [audioEvents, volume]);

  // Обновление громкости.
  useEffect(() => {
    for (const el of audioCacheRef.current.values()) {
      el.volume = volume;
    }
  }, [volume]);

  // Главный эффект: отслеживание пересечения таймстемпов событий.
  useEffect(() => {
    const prevSec = lastSecRef.current;
    lastSecRef.current = currentSec;

    // Если seek назад больше чем на 1 секунду — сбрасываем «проигранные»,
    // чтобы клипы могли отработать снова.
    if (currentSec < prevSec - 1) {
      playedRef.current.clear();
    }

    if (!isPlaying || muted) return;

    // Прошли ли мы момент события на этом тике (вперёд).
    for (const ev of audioEvents) {
      if (!ev.audio) continue;
      if (playedRef.current.has(ev.id)) continue;
      if (prevSec <= ev.timestamp_sec && ev.timestamp_sec <= currentSec) {
        const el = audioCacheRef.current.get(ev.audio);
        if (!el) continue;
        playedRef.current.add(ev.id);
        el.currentTime = 0;
        void el.play().catch(() => {
          // Autoplay policy ещё не разблокирована — тихо игнорируем,
          // следующий user-gesture (Play/seek) разблокирует через primeAudio.
        });
      }
    }
  }, [currentSec, isPlaying, muted, audioEvents]);

  const playClipForEvent = useCallback(
    async (eventId: string) => {
      const ev = audioEvents.find((e) => e.id === eventId);
      if (!ev?.audio) return;
      const el = audioCacheRef.current.get(ev.audio);
      if (!el) return;
      el.currentTime = 0;
      try {
        await el.play();
        playedRef.current.add(ev.id);
      } catch {
        // Browser отказал в autoplay — клип запустится в auto-trigger
        // позже, когда пользователь нажмёт Play.
      }
    },
    [audioEvents],
  );

  const stopAllClips = useCallback(() => {
    for (const el of audioCacheRef.current.values()) {
      el.pause();
      el.currentTime = 0;
    }
  }, []);

  const primedRef = useRef(false);
  const primeAudio = useCallback(() => {
    if (primedRef.current) return;
    primedRef.current = true;
    for (const el of audioCacheRef.current.values()) {
      const prevVolume = el.volume;
      el.volume = 0;
      el.play()
        .then(() => {
          el.pause();
          el.currentTime = 0;
          el.volume = prevVolume;
        })
        .catch(() => {
          el.volume = prevVolume;
        });
    }
  }, []);

  // Останавливаем клипы при размонтировании.
  useEffect(() => {
    const cache = audioCacheRef.current;
    return () => {
      for (const el of cache.values()) {
        el.pause();
      }
    };
  }, []);

  return { playClipForEvent, stopAllClips, primeAudio };
}
