import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="stamp">404</p>
      <h1 className="mt-4 font-display text-3xl uppercase tracking-wide">
        Связь с объектом не установлена
      </h1>
      <p className="mt-6 text-ink-soft">Такой страницы нет на борту.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded border-2 border-soviet-red px-5 py-2 font-display uppercase tracking-widest text-soviet-red transition hover:bg-soviet-red hover:text-white"
      >
        На главную
      </Link>
    </div>
  );
}
