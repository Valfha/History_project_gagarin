import { useEffect } from 'react';
import { BIOGRAPHY_SECTIONS, type BiographySection } from '@/data/biography';
import { ChipRow } from '@/components/Biography/Chip';
import { PhotoGrid } from '@/components/Biography/PhotoCard';
import { FootnoteList } from '@/components/Biography/Footnote';
import SourceList from '@/components/Biography/SourceList';

export default function Biography() {
  // Если пришли по ссылке вида /biography#childhood — мягко прокрутим к секции.
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
        <p className="stamp">Раздел 01</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-tight tracking-wide text-ink sm:text-5xl">
          Биография
        </h1>
        <div className="accent-rule mt-4" />
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          От деревенского детства военных лет до отряда космонавтов: учёба,
          аэроклуб, отбор в первую «шестёрку». Числа в квадратных скобках —
          ссылки на источники в конце страницы.
        </p>

        {/* Якорная навигация по секциям */}
        <nav aria-label="Навигация по разделу" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {BIOGRAPHY_SECTIONS.map((s) => (
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

      {/* Секции биографии */}
      <div className="mt-16 space-y-24">
        {BIOGRAPHY_SECTIONS.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>

      {/* Полный список источников */}
      <SourceList />
    </div>
  );
}

function Section({ section }: { section: BiographySection }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="scroll-mt-24"
    >
      <header className="flex items-baseline gap-4">
        <span className="font-mono text-3xl text-soviet-red">
          {section.number}
        </span>
        <div>
          <h2
            id={`${section.id}-heading`}
            className="font-display text-3xl uppercase tracking-wide text-ink sm:text-4xl"
          >
            {section.title}
          </h2>
          <p className="mt-1 font-mono text-sm uppercase tracking-widest text-soviet-gold">
            {section.period}
          </p>
        </div>
      </header>

      {/* Параграфы со сносками */}
      <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/90">
        {section.paragraphs.map((p, idx) => (
          <p key={idx}>
            {p.text}
            <FootnoteList ids={p.sourceIds} />
          </p>
        ))}
      </div>

      {/* Чипы ключевых фактов */}
      <ChipRow facts={section.keyFacts} />

      {/* Фотогалерея */}
      <PhotoGrid photos={section.photos} />
    </section>
  );
}
