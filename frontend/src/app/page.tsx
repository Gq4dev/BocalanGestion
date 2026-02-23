import Link from 'next/link';

const perrosOptions = [
  { href: '/cachorros', title: 'Cachorros', description: 'En socialización con familias de acogida', icon: '🐕' },
  { href: '/adolescentes', title: 'En entrenamiento', description: 'Planillas de seguimiento', icon: '🎓' },
  { href: '/graduados', title: 'Entregados', description: 'Graduados y sus usuarios', icon: '⭐' },
];

const cardClass =
  'group flex flex-col rounded-xl border-2 border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-yellow-400 hover:shadow-lg hover:bg-yellow-400/5';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          Acceso rápido según el menú de la asociación.
        </p>
      </section>

      {/* Perros (igual que el menú) */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-3">Perros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perrosOptions.map((item) => (
            <Link key={item.href} href={item.href} className={cardClass}>
              <span className="text-3xl sm:text-4xl mb-3 block" aria-hidden>{item.icon}</span>
              <h3 className="text-lg font-semibold text-black group-hover:text-yellow-700">{item.title}</h3>
              <p className="text-sm text-neutral-600 mt-0.5 group-hover:text-neutral-700">{item.description}</p>
              <span className="mt-3 text-sm font-medium text-yellow-600 group-hover:text-yellow-700 inline-flex items-center gap-1">
                Ir <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Entrenadores y Familias (igual que el menú) */}
      <section>
        <h2 className="text-lg font-semibold text-black mb-3">Entrenadores y Familias</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/entrenadores" className={cardClass}>
            <span className="text-3xl sm:text-4xl mb-3 block" aria-hidden>🧑‍🏫</span>
            <h3 className="text-lg font-semibold text-black group-hover:text-yellow-700">Entrenadores</h3>
            <p className="text-sm text-neutral-600 mt-0.5 group-hover:text-neutral-700">Datos de entrenadores</p>
            <span className="mt-3 text-sm font-medium text-yellow-600 group-hover:text-yellow-700 inline-flex items-center gap-1">
              Ir <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
          <Link href="/familias" className={cardClass}>
            <span className="text-3xl sm:text-4xl mb-3 block" aria-hidden>👨‍👩‍👧‍👦</span>
            <h3 className="text-lg font-semibold text-black group-hover:text-yellow-700">Familias</h3>
            <p className="text-sm text-neutral-600 mt-0.5 group-hover:text-neutral-700">Familias de socialización</p>
            <span className="mt-3 text-sm font-medium text-yellow-600 group-hover:text-yellow-700 inline-flex items-center gap-1">
              Ir <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
