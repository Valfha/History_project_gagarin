import { FLIGHT_FACTS } from '@/data/timeline';

const FACTS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Старт', value: FLIGHT_FACTS.startMoscow },
  { label: 'Длительность', value: '108 мин' },
  { label: 'Апогей', value: `${FLIGHT_FACTS.apogeeKm} км` },
  { label: 'Перигей', value: `${FLIGHT_FACTS.perigeeKm} км` },
  { label: 'Наклонение', value: `${FLIGHT_FACTS.inclinationDeg}°` },
  { label: 'Период', value: `${FLIGHT_FACTS.orbitalPeriodMin} мин` },
];

/**
 * Шапка раздела «Полёт»: штамп, заголовок, лид и параметры орбиты в чипах.
 *
 * Информационно дополняет интерактивный таймлайн ниже: пользователь сразу
 * видит «масштаб» происходящего — один виток, ~ 90 минут орбитального
 * периода, апогей 327 км. Места старта и приземления вынесены отдельно,
 * с указанием координат-городов.
 */
export default function FlightOverview() {
  return (
    <header className="mb-10">
      <p className="stamp">Раздел 02</p>
      <h1 className="mt-4 font-display text-4xl uppercase leading-tight tracking-wide text-ink sm:text-5xl">
        Полёт · 108 минут
      </h1>
      <div className="accent-rule mt-4" />

      <p className="mt-6 max-w-2xl text-lg text-ink-soft">
        12 апреля 1961 года корабль «Восток-1» совершил один виток вокруг
        Земли. Используйте таймлайн внизу, чтобы пройти полёт по ключевым
        моментам и услышать переговоры «Кедр–Заря».
      </p>

      {/* Параметры орбиты — лента чипов в духе биографии. */}
      <ul
        className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        aria-label="Параметры орбиты"
      >
        {FACTS.map((f) => (
          <li
            key={f.label}
            className="relative flex flex-col rounded border border-white/10 bg-space-mid/60 py-2 pl-4 pr-3"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-2 left-0 w-[3px] rounded bg-soviet-red"
            />
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-soviet-gold">
              {f.label}
            </span>
            <span className="mt-0.5 text-sm text-ink">{f.value}</span>
          </li>
        ))}
      </ul>

      {/* Места старта и приземления */}
      <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
        <Place icon="↑" label="Старт" value={FLIGHT_FACTS.launchSite} />
        <span aria-hidden="true" className="hidden text-ink-soft sm:inline">
          ─────
        </span>
        <Place icon="↓" label="Приземление" value={FLIGHT_FACTS.landingSite} />
      </div>
    </header>
  );
}

function Place({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span
        aria-hidden="true"
        className="font-mono text-lg text-soviet-red"
      >
        {icon}
      </span>
      <div>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-soviet-gold">
          {label}
        </p>
        <p className="text-ink">{value}</p>
      </div>
    </div>
  );
}
