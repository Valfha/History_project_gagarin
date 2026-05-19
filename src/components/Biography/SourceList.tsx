import { SOURCES, type Source, type SourceCategory } from '@/data/sources';

const CATEGORY_LABELS: Record<SourceCategory, string> = {
  encyclopedia: 'Энциклопедии',
  archive: 'Архивы и библиотеки',
  museum: 'Музеи',
  media: 'СМИ',
  memoir: 'Мемуары',
  agency: 'Космические агентства',
};

const CATEGORY_ORDER: ReadonlyArray<SourceCategory> = [
  'agency',
  'archive',
  'museum',
  'encyclopedia',
  'media',
  'memoir',
];

/**
 * Полный список источников внизу страницы биографии.
 *
 * Группируется по категориям, отсортированным по «авторитетности» для
 * научно-популярного материала: сначала агентства и архивы, затем музеи,
 * энциклопедии, СМИ и мемуары.
 *
 * Каждый пункт получает id `source-N`, на который указывают сноски Footnote.
 */
export default function SourceList() {
  const grouped = groupByCategory(SOURCES);

  return (
    <section
      aria-labelledby="sources-heading"
      className="mt-20 border-t border-white/10 pt-10"
    >
      <h2
        id="sources-heading"
        className="font-display text-2xl uppercase tracking-wide text-ink"
      >
        Источники
      </h2>
      <div className="accent-rule mt-3" />
      <p className="mt-4 max-w-2xl text-sm text-ink-soft">
        Каждый факт раздела «Биография» проверен минимум по двум независимым
        источникам. Числа в квадратных скобках в тексте — кликабельные ссылки
        на соответствующий пункт ниже.
      </p>

      <div className="mt-8 space-y-8">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-soviet-gold">
                {CATEGORY_LABELS[cat]}
              </h3>
              <ol className="mt-3 space-y-3">
                {items.map((s) => (
                  <SourceItem key={s.id} source={s} />
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SourceItem({ source }: { source: Source }) {
  return (
    <li
      id={`source-${source.id}`}
      className="rounded border-l-2 border-soviet-red/60 bg-space-mid/40 py-2 pl-4 pr-3 text-sm scroll-mt-24 transition-colors duration-300 data-[highlighted=true]:border-soviet-red data-[highlighted=true]:bg-soviet-red/20"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-soviet-red">[{source.id}]</span>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline-offset-2 hover:text-soviet-gold hover:underline"
        >
          {source.title}
        </a>
      </div>
      <p className="mt-0.5 text-xs text-ink-soft">
        <span className="text-ink">{source.publisher}</span> · {source.covers}
      </p>
    </li>
  );
}

function groupByCategory(
  sources: ReadonlyArray<Source>,
): Map<SourceCategory, Source[]> {
  const map = new Map<SourceCategory, Source[]>();
  for (const s of sources) {
    const arr = map.get(s.category) ?? [];
    arr.push(s);
    map.set(s.category, arr);
  }
  return map;
}
