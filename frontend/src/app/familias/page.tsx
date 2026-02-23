'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type SocializationFamily } from '@/lib/api';

export default function FamiliasPage() {
  const [list, setList] = useState<SocializationFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.socializationFamilies.list()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-500">Cargando…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Familias de socialización</h1>
        <Link href="/familias/nueva" className="btn-primary w-full sm:w-auto">Nueva familia</Link>
      </div>
      {list.length === 0 ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay familias. <Link href="/familias/nueva" className="text-yellow-600 hover:underline">Agregar</Link>.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((f) => (
            <li key={f._id}>
              <Link href={`/familias/${f._id}`} className="card block hover:border-yellow-400 hover:shadow-md">
                <div className="font-semibold text-lg">{f.name}</div>
                <p className="text-sm text-neutral-600">{f.contactName}</p>
                {f.phone && <p className="text-sm text-neutral-500">{f.phone}</p>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
