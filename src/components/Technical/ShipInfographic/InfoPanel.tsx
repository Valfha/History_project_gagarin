import { INFOGRAPHIC_HOTSPOTS, type ShipModule } from '@/data/vostok';
import { FootnoteList } from '@/components/Biography/Footnote';

interface InfoPanelProps {
  module: ShipModule | undefined;
}

/**
 * Панель с описанием выбранного модуля корабля. Показывается справа от
 * SVG-инфографики на десктопе, под ней — на мобильных.
 *
 * `aria-live="polite"` нужен, чтобы скринридер озвучивал смену контента
 * при клике/Enter по hotspot, не прерывая текущий поток.
 */
export default function InfoPanel({ module }: InfoPanelProps) {
  // Номер выбранного hotspot-а — для согласованности с цифрами на схеме.
  const number = module
    ? INFOGRAPHIC_HOTSPOTS.findIndex((h) => h.moduleId === module.id) + 1
    : 0;

  return (
    <aside
      aria-live="polite"
      aria-label="Описание выбранной подсистемы"
      className="rounded-lg border border-white/10 bg-space-mid/60 p-5"
    >
      {module ? (
        <>
          <div className="flex items-baseline gap-3">
            <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full border-2 border-soviet-gold bg-soviet-red px-2 font-mono text-sm font-bold text-white">
              {number}
            </span>
            {module.abbr ? (
              <span className="font-mono text-xs uppercase tracking-widest text-soviet-red">
                {module.abbr}
              </span>
            ) : null}
            <h3 className="font-display text-xl uppercase tracking-wide text-soviet-gold">
              {module.name}
            </h3>
          </div>

          <p className="mt-3 text-sm font-medium text-ink">
            {module.shortDescription}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {module.longDescription}
            <FootnoteList ids={module.sourceIds} />
          </p>
        </>
      ) : (
        <p className="text-sm text-ink-soft">Выберите номер на схеме слева.</p>
      )}
    </aside>
  );
}
