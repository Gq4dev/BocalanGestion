'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, type Dog } from '@/lib/api';

const STAGES = [
  { value: 'cachorro' as const, label: 'Cachorros', hrefNew: '/cachorros/nuevo' },
  { value: 'adolescente' as const, label: 'En entrenamiento', hrefNew: '/adolescentes/nuevo' },
  { value: 'graduado' as const, label: 'Graduados', hrefNew: '/graduados/nuevo' },
] as const;

function normalize(s: string) {
  return s.toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

const VALID_STAGES = ['cachorro', 'adolescente', 'graduado'] as const;

export default function PerrosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const etapaParam = searchParams.get('etapa');
  const stage = (VALID_STAGES.includes(etapaParam as typeof VALID_STAGES[number]) ? etapaParam : 'cachorro') as 'cachorro' | 'adolescente' | 'graduado';

  const [dogs, setDogs] = useState<Dog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = normalize(search);
  const filtered = q ? dogs.filter((d) => normalize(d.name).includes(q) || (d.breed && normalize(d.breed).includes(q))) : dogs;

  useEffect(() => {
    setLoading(true);
    api.dogs.byStage(stage)
      .then(setDogs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [stage]);

  const currentStage = STAGES.find((s) => s.value === stage)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Perros</h1>
        <Link href={currentStage.hrefNew} className="btn-primary w-full sm:w-auto text-center">
          Nuevo
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por nombre o raza…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 max-w-xs"
          aria-label="Buscar"
        />
        <div className="flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => router.replace(`/perros?etapa=${s.value}`)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              stage === s.value
                ? 'bg-yellow-400 text-black'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {s.label}
          </button>
        ))}
        </div>
      </div>

      {loading && <p className="text-neutral-500">Cargando…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!loading && !error && dogs.length === 0 && !q && (
        <div className="card text-center py-12 text-neutral-500">
          No hay perros en esta etapa.{' '}
          <Link href={currentStage.hrefNew} className="text-yellow-600 hover:underline">Agregar</Link>.
        </div>
      )}
      {!loading && !error && (dogs.length > 0 || q) && (
        <ul className="card divide-y divide-neutral-200 p-0 overflow-hidden">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center text-neutral-500 text-sm">Ningún resultado para «{search}».</li>
          ) : (
          filtered.map((dog) => (
            <li key={dog._id}>
              <Link
                href={`/perro/${dog._id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {dog.photo ? (
                    <img
                      src={dog.photo}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover bg-neutral-100"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-lg" aria-hidden>🐕</span>
                  )}
                  <div>
                    <p className="font-semibold">{dog.name}</p>
                    {dog.breed && <p className="text-sm text-neutral-600">{dog.breed}</p>}
                  </div>
                </div>
                <span className="rounded-full bg-yellow-100 text-yellow-900 px-2.5 py-0.5 text-xs font-medium capitalize">
                  {dog.stage}
                </span>
                <span className="text-sm text-yellow-600">Ver →</span>
              </Link>
            </li>
          ))
          )}
        </ul>
      )}
    </div>
  );
}
