'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type DashboardStats } from '@/lib/api';
import { Loader } from '@/components/Loader';

const cardClass =
  'group flex flex-col rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-yellow-400 hover:shadow hover:bg-yellow-400/5';

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.dashboard
      .stats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const tiles = [
    {
      href: '/perros?etapa=cachorro',
      title: 'Cachorros en familias',
      count: stats?.cachorros ?? 0,
      icon: '🐕',
    },
    {
      href: '/perros?etapa=adolescente',
      title: 'En entrenamiento',
      count: stats?.adolescentes ?? 0,
      icon: '🎓',
    },
    {
      href: '/perros?etapa=graduado',
      title: 'Perros entregados',
      count: stats?.graduados ?? 0,
      icon: '✅',
    },
    {
      href: '/vacunas-a-vencer',
      title: 'Vacunas a vencer',
      count: stats?.vacunasAVencer ?? 0,
      icon: '💉',
      highlight: (stats?.vacunasAVencer ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-neutral-600 text-sm">Resumen y acceso rápido.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((tile) => {
          const content = (
            <>
              <span className="text-3xl mb-2 block" aria-hidden>
                {tile.icon}
              </span>
              <p className="text-4xl font-bold text-black tabular-nums">{tile.count}</p>
              <h2 className="text-sm font-semibold text-neutral-700 group-hover:text-yellow-800 mt-1">
                {tile.title}
              </h2>
            </>
          );
          const className = `${cardClass} ${tile.highlight ? 'border-amber-300 bg-amber-50/50' : ''}`;
          return (
            <Link key={(tile as { href: string }).href + tile.title} href={(tile as { href: string }).href} className={className}>
              {content}
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/perros" className={cardClass}>
          <span className="text-2xl mb-2 block" aria-hidden>🐕</span>
          <h2 className="text-lg font-semibold text-black group-hover:text-yellow-700">Ver todos los perros</h2>
          <p className="text-xs text-neutral-600 mt-0.5">Lista por etapa.</p>
        </Link>
        <Link href="/personas" className={cardClass}>
          <span className="text-2xl mb-2 block" aria-hidden>👥</span>
          <h2 className="text-lg font-semibold text-black group-hover:text-yellow-700">Personas</h2>
          <p className="text-xs text-neutral-600 mt-0.5">Entrenadores y familias.</p>
        </Link>
      </section>
    </div>
  );
}
