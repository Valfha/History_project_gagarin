import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Biography from './pages/Biography';
import Flight from './pages/Flight';
import NotFound from './pages/NotFound';

// Технический раздел тянет three.js / R3F / drei + leaflet (~1 MB JS).
// Биографии и главной они не нужны, поэтому подгружаем chunk по требованию.
const Technical = lazy(() => import('./pages/Technical'));

function TechnicalFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-4 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-soviet-gold"
          aria-hidden="true"
        />
        <p className="font-mono text-xs uppercase tracking-widest text-soviet-red">
          Загрузка технического раздела
        </p>
        <p className="text-sm text-ink-soft">
          Подгружаем 3D-движок и карту орбиты…
        </p>
      </div>
    </div>
  );
}

// HashRouter — самый надёжный вариант для GitHub Pages,
// не требует SPA-fallback и не ломается на прямых ссылках.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="biography" element={<Biography />} />
          <Route path="flight" element={<Flight />} />
          <Route
            path="technical"
            element={
              <Suspense fallback={<TechnicalFallback />}>
                <Technical />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
