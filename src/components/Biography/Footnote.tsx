import type { MouseEvent } from 'react';
import { getSourceById } from '@/data/sources';

interface FootnoteProps {
  /** ID источника из sources.ts. */
  id: number;
}

/**
 * Кликабельная сноска вида [1].
 *
 * Клик — плавный скролл к соответствующему пункту в списке источников.
 * Мы НЕ полагаемся на штатный якорь (`href="#source-N"`), потому что под
 * HashRouter он бы перезаписал маршрутный хеш и сбил роутинг. Вместо этого
 * используем preventDefault + scrollIntoView и вручную помечаем целевой
 * элемент data-атрибутом для подсветки.
 */
export default function Footnote({ id }: FootnoteProps) {
  const src = getSourceById(id);
  const tooltip = src ? `${src.publisher} — ${src.title}` : `Источник ${id}`;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(`source-${id}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Кратковременная подсветка целевого пункта.
    target.dataset.highlighted = 'true';
    window.setTimeout(() => {
      delete target.dataset.highlighted;
    }, 1800);
  };

  return (
    <a
      href={`#source-${id}`}
      onClick={handleClick}
      title={tooltip}
      aria-label={`Сноска ${id}: ${tooltip}`}
      className="mx-0.5 inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-sm border border-soviet-red/60 bg-soviet-red/10 px-1 align-super font-mono text-[0.65rem] text-soviet-red transition hover:bg-soviet-red hover:text-white focus-visible:bg-soviet-red focus-visible:text-white"
    >
      {id}
    </a>
  );
}

/**
 * Утилита: рендер списка сносок [1][2][3] с разделителями-запятыми.
 * Используется в конце абзаца.
 */
export function FootnoteList({ ids }: { ids: ReadonlyArray<number> }) {
  if (ids.length === 0) return null;
  return (
    <span className="ml-0.5 whitespace-nowrap">
      {ids.map((id) => (
        <Footnote key={id} id={id} />
      ))}
    </span>
  );
}
