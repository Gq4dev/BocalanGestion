'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader } from '@/components/Loader';
import { api, type SocializationFamily } from '@/lib/api';

function normalize(s: string) {
  return s.toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function FamiliasPage() {
  const [list, setList] = useState<SocializationFamily[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = normalize(search);
  const filtered = q ? list.filter((f) => normalize(f.name).includes(q) || normalize(f.contactName).includes(q) || (f.city && normalize(f.city).includes(q)) || (f.phone && normalize(f.phone).includes(q))) : list;

  useEffect(() => {
    api.socializationFamilies.list()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Familias de socialización</h1>
        <Link href="/familias/nueva" className="btn-primary w-full sm:w-auto">Nueva familia</Link>
      </div>
      <input
        type="search"
        placeholder="Buscar por nombre, contacto o ciudad…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full max-w-md"
        aria-label="Buscar"
      />
      {list.length === 0 && !q ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay familias. <Link href="/familias/nueva" className="text-yellow-600 hover:underline">Agregar</Link>.
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Ningún resultado para «{search}».</p>
          ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f) => (
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
        </>
      )}
    </div>
  );
}
