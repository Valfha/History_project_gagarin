# Восток-1 · Юрий Гагарин

Интерактивный научно-популярный сайт о первом полёте человека в космос.

## Разделы

1. **Биография** — детство, обучение, отбор в космонавты.
2. **Полёт** — интерактивный таймлайн 12 апреля 1961 с переговорами «Кедр — Заря».
3. **Восток-1** — карта орбиты, 3D-модель и устройство корабля.

## Стек

Vite · React 18 · TypeScript · Tailwind CSS · React Router (HashRouter) ·
Three.js + @react-three/fiber/drei · Leaflet + react-leaflet · Tone.js

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:5173

## Сборка и проверка

```bash
npm run typecheck
npm run build
npm run preview
```

## Деплой

Автоматически на GitHub Pages через `.github/workflows/deploy.yml` при пуше в `main`.

URL после деплоя: https://valfha.github.io/History_project_gagarin/

> Перед первым деплоем нужно один раз включить GitHub Pages:
> **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Источники

Список первоисточников и ссылок добавляется по мере наполнения контента
(см. `src/data/sources.ts`).

## Лицензия

Код — MIT (планируется). Изображения и аудио — Public Domain / Creative Commons,
с указанием источников.
