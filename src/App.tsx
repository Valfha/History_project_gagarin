import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Biography from './pages/Biography';
import Flight from './pages/Flight';
import Technical from './pages/Technical';
import NotFound from './pages/NotFound';

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
          <Route path="technical" element={<Technical />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
