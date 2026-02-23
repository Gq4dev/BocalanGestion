'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Beneficiary } from '@/lib/api';

function normalize(s: string) {
  return s.toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function UsuariosPage() {
  const [list, setList] = useState<Beneficiary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = normalize(search);
  const filtered = q ? list.filter((b) => normalize(b.name).includes(q) || (b.conditionOrDisability && normalize(b.conditionOrDisability).includes(q)) || (b.phone && normalize(b.phone).includes(q)) || (b.email && normalize(b.email).includes(q))) : list;

  useEffect(() => {
    api.beneficiaries.list()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-500">Cargando…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Usuarios / beneficiarios</h1>
        <Link href="/usuarios/nuevo" className="btn-primary w-full sm:w-auto">Nuevo usuario</Link>
      </div>
      <p className="text-neutral-600 text-sm">Personas que reciben un perro graduado.</p>
      <input
        type="search"
        placeholder="Buscar por nombre, condición o contacto…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full max-w-md"
        aria-label="Buscar"
      />
      {list.length === 0 && !q ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay usuarios. <Link href="/usuarios/nuevo" className="text-yellow-600 hover:underline">Agregar</Link>.
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <p className="text-neutral-500 text-sm py-4">Ningún resultado para «{search}».</p>
          ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <li key={b._id}>
              <Link href={`/usuarios/${b._id}`} className="card block hover:border-yellow-400 hover:shadow-md">
                <div className="font-semibold text-lg">{b.name}</div>
                {b.conditionOrDisability && <p className="text-sm text-neutral-600">{b.conditionOrDisability}</p>}
                {b.phone && <p className="text-sm text-neutral-500">{b.phone}</p>}
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
