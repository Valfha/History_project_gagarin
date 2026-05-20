import { useEffect } from 'react';
import { FLIGHT_FACTS } from '@/data/timeline';
import OrbitMap from '@/components/Technical/OrbitMap/OrbitMap';

interface TechnicalSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
}

const SECTIONS: ReadonlyArray<TechnicalSection> = [
  {
    id: 'orbit',
    number: '03.1',
    title: 'Орбита',
    subtitle: 'Параметры первого витка и траектория над Землёй',
  },
  {
    id: 'ship',
    number: '03.2',
    title: 'Корабль',
    subtitle: '3D-модель Восток-3КА: спускаемый аппарат и приборный отсек',
  },
  {
    id: 'device',
    number: '03.3',
    title: 'Устройство',
    subtitle: 'Системы корабля: ТДУ, антенны, скафандр СК-1, кресло-катапульта',
  },
];

export default function Technical() {
  // Поддержка ссылок вида /technical#ship → плавная прокрутка к секции.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      {/* Шапка раздела */}
      <header>
        <p className="stamp">Раздел 03</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-tight tracking-wide text-ink sm:text-5xl">
          Восток-1
        </h1>
        <div className="accent-rule mt-4" />
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          Корабль 1КП «Восток-3КА» №3, выведенный ракетой-носителем Р-7А
          «Восток» 12 апреля 1961 г. Один виток вокруг Земли за {FLIGHT_FACTS.orbitalPeriodMin}{' '}
          мин на орбите с апогеем {FLIGHT_FACTS.apogeeKm}/{FLIGHT_FACTS.perigeeKm}{' '}
          км и наклонением {FLIGHT_FACTS.inclinationDeg}°.
        </p>

        {/* Якорная навигация по секциям */}
        <nav aria-label="Навигация по разделу" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    // HashRouter использует хеш для маршрутов, поэтому
                    // ссылку-якорь обрабатываем сами через scrollIntoView.
                    e.preventDefault();
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center gap-2 rounded border border-white/10 bg-space-mid/60 px-3 py-1.5 text-xs uppercase tracking-widest text-ink-soft transition hover:border-soviet-red/60 hover:text-soviet-gold"
                >
                  <span className="font-mono text-soviet-red">{s.number}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Секции */}
      <div className="mt-12 space-y-16">
        {SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-24"
            aria-labelledby={`${s.id}-heading`}
          >
            <header>
              <p className="font-mono text-xs uppercase tracking-widest text-soviet-red">
                {s.number}
              </p>
              <h2
                id={`${s.id}-heading`}
                className="mt-2 font-display text-3xl uppercase tracking-wide text-ink"
              >
                {s.title}
              </h2>
              <p className="mt-2 text-ink-soft">{s.subtitle}</p>
              <div className="accent-rule mt-4" />
            </header>

            {s.id === 'orbit' ? <OrbitSection /> : <SectionStub index={SECTIONS.indexOf(s) + 2} />}
          </section>
        ))}
      </div>
    </div>
  );
}

/** Параметры орбиты + карта наземной трассы. */
function OrbitSection() {
  const stats: ReadonlyArray<{ label: string; value: string }> = [
    { label: 'Апогей', value: `${FLIGHT_FACTS.apogeeKm} км` },
    { label: 'Перигей', value: `${FLIGHT_FACTS.perigeeKm} км` },
    { label: 'Наклонение', value: `${FLIGHT_FACTS.inclinationDeg}°` },
    { label: 'Период', value: `${FLIGHT_FACTS.orbitalPeriodMin} мин` },
    { label: 'Длительность', value: `${FLIGHT_FACTS.durationSec / 60} мин` },
    { label: 'Витков', value: '~1.2' },
  ];

  return (
    <div className="mt-6 space-y-6">
      {/* Сетка параметров орбиты */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 bg-space-mid/80 px-4 py-3"
          >
            <dt className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft">
              {s.label}
            </dt>
            <dd className="font-display text-lg text-soviet-gold">{s.value}</dd>
          </div>
        ))}
      </dl>

      {/* Карта */}
      <OrbitMap />

      <p className="text-sm text-ink-soft">
        Точки старта и приземления отмечены маркерами. Линия — расчётная наземная
        трасса при условии непрерывного орбитального полёта в течение 108 мин.
        Реальное приземление произошло после торможения тормозной двигательной
        установки (ТДУ) в районе T+78:34 над Африкой — далее корабль шёл по
        атмосферному участку траектории к деревне Смеловка.
      </p>
    </div>
  );
}

/** Заглушка для секций, которые ещё не наполнены контентом. */
function SectionStub({ index }: { index: number }) {
  return (
    <div className="mt-6 rounded border border-dashed border-white/10 bg-space-mid/40 p-8 text-center text-sm text-ink-soft">
      Готовится — шаг&nbsp;3.{index}
    </div>
  );
}
