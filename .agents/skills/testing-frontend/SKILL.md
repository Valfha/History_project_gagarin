---
name: testing-frontend
description: Test the Vostok-1 Gagarin project frontend end-to-end. Use when verifying UI changes, responsive layout, or navigation.
---

## Local Dev Setup

```bash
cd /home/ubuntu/repos/History_project_gagarin
npm install
npx vite --host 0.0.0.0 --port 5173
```

Access at `http://127.0.0.1:5173/History_project_gagarin/` (note: use `127.0.0.1`, not `localhost` — DNS resolution for `localhost` may fail on the VM).

If port 5173 is taken, Vite auto-selects the next available port (5174, etc.).

## Responsive Testing

- Use Chrome DevTools responsive mode (`Ctrl+Shift+M` or `F12` then toggle device toolbar)
- **Mobile breakpoint:** < 640px (Tailwind `sm`). Hamburger menu visible, desktop nav hidden.
- **Desktop breakpoint:** >= 640px. Horizontal nav visible, hamburger hidden.
- Set viewport to 400px width to test mobile layout.

## Key UI Components

- **Header** (`src/components/Layout/Header.tsx`): Contains hamburger menu for mobile and horizontal nav for desktop. Uses `sm:hidden` / `hidden sm:block` for responsive toggling.
- **Biography** (`src/pages/Biography.tsx` + `src/components/Biography/`): 3 sections with footnotes, photos, and source list.
- **Home** (`src/pages/Home.tsx`): Landing page with 3 section cards.

## Routing

Uses HashRouter for GitHub Pages compatibility. Routes:
- `#/` — Home
- `#/biography` — Biography
- `#/flight` — Flight (placeholder)
- `#/technical` — Technical (placeholder)

## Lint & Type Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # eslint (NOTE: eslint.config.js is missing, this will fail until added)
npm run build        # tsc -b && vite build
```

## Deploy

GitHub Pages: https://valfha.github.io/History_project_gagarin/

## Devin Secrets Needed

None — static frontend with no authentication required.

## Known Issues

- `npm run lint` fails because `eslint.config.js` is missing (needs ESLint v9 flat config).
- Vite dev server might pick a different port if 5173 is occupied — check terminal output.
