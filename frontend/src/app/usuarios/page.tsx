'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Beneficiary } from '@/lib/api';

export default function UsuariosPage() {
  const [list, setList] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {list.length === 0 ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay usuarios. <Link href="/usuarios/nuevo" className="text-yellow-600 hover:underline">Agregar</Link>.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((b) => (
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
    </div>
  );
}
