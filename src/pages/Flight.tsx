import { useEffect, useMemo, useRef } from 'react';
import FlightOverview from '@/components/Flight/FlightOverview';
import TimelineScrubber from '@/components/Flight/TimelineScrubber';
import PlayControls from '@/components/Flight/PlayControls';
import EventCard from '@/components/Flight/EventCard';
import TranscriptPanel from '@/components/Flight/TranscriptPanel';
import { usePlaybackClock } from '@/components/Flight/usePlaybackClock';
import { useAudioClips } from '@/components/Flight/useAudioClips';
import SourceList from '@/components/Biography/SourceList';
import {
  FLIGHT_FACTS,
  TIMELINE_EVENTS,
  TRANSCRIPT_LINES,
  formatTPlus,
  type TimelineEvent,
} from '@/data/timeline';

// Самый ранний таймстемп среди событий и реплик. Нужен как нижняя граница
// `clock.seek()`, чтобы клик по предстартовой реплике (T-25:00, T-10:00 …)
// действительно перематывал часы в отрицательную зону, а не клампился к 0.
// Math.min с явным защитным 0 — на случай, если в будущем все события
// окажутся положительными.
const EARLIEST_SEC = Math.min(
  0,
  ...TIMELINE_EVENTS.map((e) => e.timestamp_sec),
  ...TRANSCRIPT_LINES.map((l) => l.timestamp_sec),
);

export default function Flight() {
  const clock = usePlaybackClock({
    durationSec: FLIGHT_FACTS.durationSec,
    minSec: EARLIEST_SEC,
  });
  const audio = useAudioClips({
    events: TIMELINE_EVENTS,
    currentSec: clock.currentSec,
    isPlaying: clock.isPlaying,
  });

  // Делим события на предстартовые (timestamp_sec < 0) и полётные (>= 0).
  const { prelaunchEvents, flightEvents } = useMemo(() => {
    const pre: TimelineEvent[] = [];
    const flight: TimelineEvent[] = [];
    for (const ev of TIMELINE_EVENTS) {
      if (ev.timestamp_sec < 0) pre.push(ev);
      else flight.push(ev);
    }
    return { prelaunchEvents: pre, flightEvents: flight };
  }, []);

  // Активное событие — последнее, чей timestamp_sec <= currentSec
  // (среди flightEvents, всегда непусто потому что 'launch' = 0).
  const activeEvent = useMemo(() => {
    let best: TimelineEvent = flightEvents[0];
    for (const ev of flightEvents) {
      if (ev.timestamp_sec <= clock.currentSec) best = ev;
      else break;
    }
    return best;
  }, [clock.currentSec, flightEvents]);

  // Останавливаем все клипы при паузе таймлайна.
  const wasPlayingRef = useRef(clock.isPlaying);
  useEffect(() => {
    if (wasPlayingRef.current && !clock.isPlaying) {
      audio.stopAllClips();
    }
    wasPlayingRef.current = clock.isPlaying;
  }, [clock.isPlaying, audio]);

  // Обёртки, которые синхронно «прогревают» Audio-элементы внутри
  // user-gesture обработчика — чтобы браузер разрешил последующий автозапуск.
  const handleToggle = () => {
    audio.primeAudio();
    // Если стартуем уже на/после таймстемпа активного события и у него есть
    // аудио — играем СИНХРОННО прямо здесь, в click-handler (user-gesture,
    // гарантированно минующий autoplay policy).
    // Если же currentSec < activeEvent.timestamp_sec (например запуск из
    // pre-launch зоны при currentSec = -1500, а activeEvent = 'launch'@0),
    // НЕ запускаем клип сейчас — иначе «Поехали» прозвучит в момент клика,
    // а не на T+0. primeAudio выше разблокирует autoplay policy, и клип
    // сработает через auto-trigger в useAudioClips при пересечении T+0.
    if (
      !clock.isPlaying &&
      activeEvent.audio &&
      clock.currentSec >= activeEvent.timestamp_sec
    ) {
      void audio.playClipForEvent(activeEvent.id);
    }
    clock.toggle();
  };
  const handlePlayAudioForActive = () => {
    audio.primeAudio();
    void audio.playClipForEvent(activeEvent.id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <FlightOverview />

      {/* Предстарт — компактная горизонтальная лента карточек */}
      <section
        aria-labelledby="prelaunch-heading"
        className="mb-10 rounded-2xl border border-white/10 bg-space-mid/40 p-5"
      >
        <header className="mb-4 flex items-baseline justify-between gap-3">
          <h2
            id="prelaunch-heading"
            className="font-display text-sm uppercase tracking-widest text-ink"
          >
            Подготовка к старту
          </h2>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            T−1:30 → T+0
          </p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {prelaunchEvents.map((ev) => (
            <li
              key={ev.id}
              className="rounded-xl border border-white/10 bg-space-deep/60 p-4 text-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-soviet-red">
                  {formatTPlus(ev.timestamp_sec)}
                </span>
                <span className="font-mono text-[0.65rem] text-ink-soft">
                  {ev.moscowTime} МСК
                </span>
              </div>
              <h3 className="mt-2 font-display text-base uppercase leading-tight tracking-wide text-ink">
                {ev.title}
              </h3>
              <p className="mt-2 text-xs text-ink-soft">{ev.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Основной таймлайн полёта (T+0 … T+108) */}
      <section
        aria-labelledby="flight-timeline-heading"
        className="rounded-2xl border border-white/10 bg-space-mid/40 p-5 sm:p-6"
      >
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="flight-timeline-heading"
            className="font-display text-sm uppercase tracking-widest text-ink"
          >
            108 минут полёта
          </h2>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
            T+0 → T+1:48
          </p>
        </header>

        <PlayControls
          isPlaying={clock.isPlaying}
          onToggle={handleToggle}
          onReset={clock.reset}
          speed={clock.speed}
          onSpeedChange={clock.setSpeed}
        />

        <div className="mt-6">
          <TimelineScrubber
            durationSec={FLIGHT_FACTS.durationSec}
            currentSec={clock.currentSec}
            onSeek={clock.seek}
            events={flightEvents}
            activeEventId={activeEvent.id}
          />
        </div>

        {/* Двухколоночный layout: карточка события | транскрипт */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <EventCard
            key={activeEvent.id}
            event={activeEvent}
            hasAudio={Boolean(activeEvent.audio)}
            onPlayAudio={handlePlayAudioForActive}
          />
          <div className="lg:max-h-[640px]">
            <TranscriptPanel
              lines={TRANSCRIPT_LINES}
              currentSec={clock.currentSec}
              onSeek={clock.seek}
            />
          </div>
        </div>
      </section>

      <SourceList />
    </div>
  );
}
