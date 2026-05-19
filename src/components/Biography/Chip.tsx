import type { KeyFact } from '@/data/biography';

interface ChipProps {
  fact: KeyFact;
}

/**
 * Чип ключевого факта: дата сверху моноширинным шрифтом, событие снизу.
 *
 * Используется в виде «ленты» под текстом каждой биографической секции.
 * Визуально напоминает советский ярлык/штамп благодаря красной полосе слева.
 */
export default function Chip({ fact }: ChipProps) {
  return (
    <div className="relative flex flex-col rounded border border-white/10 bg-space-mid/60 py-2 pl-4 pr-3 transition hover:border-soviet-red/60 hover:bg-space-mid">
      {/* Декоративная красная полоса слева */}
      <span
        aria-hidden="true"
        className="absolute inset-y-2 left-0 w-[3px] rounded bg-soviet-red"
      />
      <span className="font-mono text-xs uppercase tracking-widest text-soviet-gold">
        {fact.date}
      </span>
      <span className="mt-0.5 text-sm text-ink">{fact.label}</span>
    </div>
  );
}

/**
 * Лента чипов — отзывчивая сетка, удобная как на десктопе, так и на телефоне.
 */
export function ChipRow({ facts }: { facts: ReadonlyArray<KeyFact> }) {
  return (
    <ul
      className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
      aria-label="Ключевые даты"
    >
      {facts.map((fact, idx) => (
        <li key={`${fact.date}-${idx}`}>
          <Chip fact={fact} />
        </li>
      ))}
    </ul>
  );
}
