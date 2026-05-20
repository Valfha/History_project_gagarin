# Восток-1 · Юрий Гагарин

Интерактивный научно-популярный учебный сайт о первом полёте человека в
космос — 12 апреля 1961 года.

**Прод:** https://valfha.github.io/History_project_gagarin/

## Разделы

### 1. Биография
Детство в Клушино и Гжатске, обучение в Люберцах и Саратовском
аэроклубе, военное училище в Оренбурге, отбор в первый отряд
космонавтов («Сочинская шестёрка», ЦПК, центрифуга, барокамера).
Все ключевые факты подкреплены кликабельными сносками на источники.

### 2. Полёт
Интерактивный таймлайн 12 апреля 1961 года: радиопереговоры
«Кедр» (Гагарин) — «Заря» (ЦУП), сообщения ТАСС, синхронизированное
аудио (рассекреченные записи РГАНТД / Гостелерадиофонд), плеер
с шкалой времени и переключаемой скоростью клока.

### 3. Восток-1 (техническая часть)
- **Орбита:** карта Leaflet с CARTO Dark, реальный ground-track
  108-минутного витка от Байконура до приземления под Энгельсом.
- **3D-модель:** схематичная three.js / R3F модель Восток-3КА —
  спускаемый аппарат, приборный отсек, ТДУ С5.4, антенны;
  OrbitControls (вращение/зум).
- **Устройство:** SVG-инфографика с 6 интерактивными hotspot-ами
  (СА, ПО, ТДУ, антенны, СК-1, К-21) — клик / Tab + Enter
  показывает описание модуля со сносками.

## Особенности

- Все факты триангулированы по 2+ независимым источникам
  (30 первоисточников: мемуары, архивные документы, академические
  публикации, профильные энциклопедии).
- Доступность: семантические landmarks, `aria-live`/`aria-pressed`,
  навигация с клавиатуры, контрастная палитра, alt-тексты.
- Code-splitting: `/technical` подгружается лениво — главная и
  Биография стартуют ~76 KB gzip.
- Адаптивный дизайн: 320 / 768 / 1024 / 1440 px.
- Тёмный космический фон + советские акценты (red `#c8102e`,
  gold `#f0c14b`), шрифты Russo One / Inter / JetBrains Mono.

## Стек

Vite 5 · React 18 · TypeScript (strict) · Tailwind CSS v3 ·
React Router DOM v6 (HashRouter) · Three.js + @react-three/fiber +
@react-three/drei · Leaflet + react-leaflet · нативный
`HTMLAudioElement` для синхронизированного аудио в Полёте.

## Локальный запуск

```bash
git clone https://github.com/Valfha/History_project_gagarin.git
cd History_project_gagarin
npm install
npm run dev
# открыть http://localhost:5173/History_project_gagarin/
```

Полезные скрипты:

```bash
npm run typecheck                 # tsc --noEmit (strict, 0 ошибок)
npm run build                     # production build в dist/
node scripts/download-images.mjs  # пакетная загрузка биографических фото
node scripts/download-audio.mjs   # пакетная загрузка аудио
uv run scripts/optimize-images.py # пережать крупные jpg в public/images/biography/
```

## Деплой

GitHub Pages через GitHub Actions
(`.github/workflows/deploy.yml`, source = «GitHub Actions» в
Settings → Pages). Push в `main` запускает сборку и деплой.

`vite.config.ts` использует `base: '/History_project_gagarin/'` —
важно для путей на GitHub Pages.

## Источники и атрибуции

Все 30 источников перечислены в `src/data/sources.ts` и кликабельно
выводятся в виде сносок под текстом и общим списком в подвале
каждой страницы. Категории: `archive`, `memoir`, `book`,
`academic`, `documentary`, `encyclopedia`, `government`,
`media`, `museum`, `news`, `audio`.

**Аудио переговоров «Кедр — Заря»** (раздел «Полёт»):
рассекреченные записи РГАНТД / Гостелерадиофонд, 1961
(Public Domain в РФ); копии — Wikimedia Commons и voicebot.su
(educational use).

**Фотографии** (раздел «Биография»): Public Domain / Creative
Commons из Wikimedia Commons, РИА «Новости» (фотохроника ТАСС),
архив ЦПК. Учебный проект, материалы используются с явной
атрибуцией.

## Лицензия

Код — MIT.
Изображения и аудио — оригинальные лицензии, см. атрибуции выше.
