import { Link } from 'react-router-dom';

const sections: ReadonlyArray<{
  to: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}> = [
  {
    to: '/biography',
    title: 'Биография',
    subtitle: 'Клушино — Звёздный городок',
    description:
      'От деревенского детства военных лет до отряда космонавтов: учёба, аэроклуб, отбор в первую «шестёрку».',
    badge: '01',
  },
  {
    to: '/flight',
    title: 'Полёт',
    subtitle: '108 минут истории',
    description:
      'Интерактивный таймлайн 12 апреля 1961 года с синхронизацией переговоров «Кедр — Заря».',
    badge: '02',
  },
  {
    to: '/technical',
    title: 'Восток-1',
    subtitle: 'Корабль и орбита',
    description:
      'Карта траектории первого витка, 3D-модель корабля и его устройство по узлам.',
    badge: '03',
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <section className="relative">
        <p className="stamp">12 · IV · 1961</p>
        <h1 className="mt-6 font-display text-4xl uppercase leading-tight tracking-wide sm:text-6xl">
          <span className="block text-soviet-gold">Юрий Гагарин</span>
          <span className="block text-ink">Первый в космосе</span>
        </h1>
        <div className="accent-rule mt-6" />
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          108 минут, изменивших XX век. Биография, хронология полёта корабля «Восток-1»
          и его техническое устройство — в одном интерактивном проекте.
        </p>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3" aria-label="Разделы сайта">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="section-card group block">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs text-soviet-red">№ {s.badge}</span>
              <span aria-hidden="true" className="text-soviet-gold transition group-hover:translate-x-1">
                →
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl uppercase tracking-wide text-ink">
              {s.title}
            </h2>
            <p className="mt-1 text-sm uppercase tracking-widest text-soviet-gold">
              {s.subtitle}
            </p>
            <p className="mt-4 text-sm text-ink-soft">{s.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
