import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="starfield relative flex min-h-screen flex-col">
      <a className="skip-link" href="#main">
        Перейти к основному содержанию
      </a>
      <Header />
      <main id="main" className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
