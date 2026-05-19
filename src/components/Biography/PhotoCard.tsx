import type { BiographyPhoto } from '@/data/biography';

interface PhotoCardProps {
  photo: BiographyPhoto;
}

/**
 * Карточка фотографии: само изображение (или эстетичный плейсхолдер),
 * подпись под фото, метка лицензии и ссылка на оригинал на Wikimedia Commons
 * (открывается в новой вкладке).
 *
 * Если `photo.placeholder === true`, рендерим инлайн-SVG в духе советских
 * плакатов вместо <img>. Это позволяет показать секцию ещё до того, как мы
 * скачали реальные снимки в `public/images/biography/`.
 */
export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <figure className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-space-mid/60 transition hover:border-soviet-red/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-space-deep">
        {photo.placeholder ? (
          <PhotoPlaceholder caption={photo.caption} />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}${photo.src}`}
            alt={photo.caption}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <figcaption className="flex flex-1 flex-col gap-2 p-4 text-sm">
        <p className="text-ink">{photo.caption}</p>
        <a
          href={photo.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit items-center gap-1 rounded border border-white/10 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft transition hover:border-soviet-gold/60 hover:text-soviet-gold"
        >
          <span aria-hidden="true">©</span>
          <span>{photo.license}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </figcaption>
    </figure>
  );
}

/**
 * Эстетичный плейсхолдер в духе советских конструктивистских плакатов:
 * звезда, диагональные полосы, штамп «АРХИВ • ФОТО».
 */
function PhotoPlaceholder({ caption }: { caption: string }) {
  return (
    <div
      role="img"
      aria-label={`Плейсхолдер фотографии: ${caption}`}
      className="flex h-full w-full items-center justify-center"
    >
      <svg
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#172238"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d1426" />
            <stop offset="100%" stopColor="#070914" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg)" />
        <rect width="400" height="300" fill="url(#grid)" opacity="0.6" />
        {/* Диагональные акцентные полосы */}
        <path d="M -30 250 L 100 100 L 110 110 L -20 260 Z" fill="#c8102e" opacity="0.18" />
        <path d="M 300 -10 L 430 130 L 420 140 L 290 0 Z" fill="#f0c14b" opacity="0.12" />
        {/* Звезда по центру */}
        <g transform="translate(200 150)">
          <path
            d="M 0 -40 L 11 -12 L 41 -12 L 17 6 L 26 35 L 0 18 L -26 35 L -17 6 L -41 -12 L -11 -12 Z"
            fill="none"
            stroke="#c8102e"
            strokeWidth="2"
          />
        </g>
        {/* Штамп */}
        <g transform="translate(200 230)" textAnchor="middle">
          <text
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11"
            letterSpacing="3"
            fill="#a8b3c7"
          >
            АРХИВ · ФОТО
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * Сетка фото секции — 1 колонка на мобильных, 3 на десктопе.
 */
export function PhotoGrid({ photos }: { photos: ReadonlyArray<BiographyPhoto> }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <PhotoCard key={photo.src} photo={photo} />
      ))}
    </div>
  );
}
