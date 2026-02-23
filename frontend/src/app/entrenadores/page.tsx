'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Trainer } from '@/lib/api';

export default function EntrenadoresPage() {
  const [list, setList] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.trainers.list()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-500">Cargando…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Entrenadores</h1>
        <Link href="/entrenadores/nuevo" className="btn-primary w-full sm:w-auto">Nuevo entrenador</Link>
      </div>
      {list.length === 0 ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay entrenadores.{' '}
          <Link href="/entrenadores/nuevo" className="text-yellow-600 hover:underline">
            Agregar
          </Link>
          .
        </div>
      ) : (
        <ul className="card divide-y divide-neutral-200 p-0 overflow-hidden">
          {list.map((t) => (
            <li key={t._id}>
              <Link
                href={`/entrenadores/${t._id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-base">{t.name}</p>
                  {t.phone && <p className="text-sm text-neutral-600">{t.phone}</p>}
                  {t.email && <p className="text-sm text-neutral-500">{t.email}</p>}
                </div>
                <span className="text-sm font-medium text-yellow-600">
                  Ver detalles →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
