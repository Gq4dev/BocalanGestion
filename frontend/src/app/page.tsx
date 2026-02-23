import Link from 'next/link';

const cardClass =
  'group flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-yellow-400 hover:shadow hover:bg-yellow-400/5';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-neutral-600 text-sm">Acceso rápido.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/perros" className={cardClass}>
          <span className="text-2xl mb-2 block" aria-hidden>🐕</span>
          <h2 className="text-lg font-semibold text-black group-hover:text-yellow-700">Perros</h2>
          <p className="text-xs text-neutral-600 mt-0.5">Por etapa: cachorros, entrenamiento, graduados.</p>
        </Link>
        <Link href="/personas" className={cardClass}>
          <span className="text-2xl mb-2 block" aria-hidden>👥</span>
          <h2 className="text-lg font-semibold text-black group-hover:text-yellow-700">Personas</h2>
          <p className="text-xs text-neutral-600 mt-0.5">Entrenadores y familias de socialización.</p>
        </Link>
      </section>
    </div>
  );
}
