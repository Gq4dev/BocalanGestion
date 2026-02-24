'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader } from '@/components/Loader';
import { api, type Trainer, type SocializationFamily } from '@/lib/api';

type Tab = 'entrenadores' | 'familias';

function normalize(s: string) {
  return s.toLowerCase().trim().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function PersonasPage() {
  const [tab, setTab] = useState<Tab>('entrenadores');
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [families, setFamilies] = useState<SocializationFamily[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = normalize(search);
  const filteredTrainers = q ? trainers.filter((t) => normalize(t.name).includes(q) || (t.phone && normalize(t.phone).includes(q)) || (t.email && normalize(t.email).includes(q))) : trainers;
  const filteredFamilies = q ? families.filter((f) => normalize(f.name).includes(q) || normalize(f.contactName).includes(q) || (f.city && normalize(f.city).includes(q)) || (f.phone && normalize(f.phone).includes(q))) : families;

  useEffect(() => {
    setLoading(true);
    if (tab === 'entrenadores') {
      api.trainers.list()
        .then(setTrainers)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    } else {
      api.socializationFamilies.list()
        .then(setFamilies)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-black">Personas</h1>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('entrenadores')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'entrenadores' ? 'bg-yellow-400 text-black' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Entrenadores
        </button>
        <button
          type="button"
          onClick={() => setTab('familias')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'familias' ? 'bg-yellow-400 text-black' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Familias
        </button>
      </div>

      <input
        type="search"
        placeholder={tab === 'entrenadores' ? 'Buscar entrenadores…' : 'Buscar familias…'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full max-w-md"
        aria-label="Buscar"
      />

      {tab === 'entrenadores' && (
        <>
          <div className="flex justify-end">
            <Link href="/entrenadores/nuevo" className="btn-primary text-sm">Nuevo entrenador</Link>
          </div>
          {loading && <Loader />}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && trainers.length === 0 && !q && (
            <div className="card text-center py-12 text-neutral-500">
              No hay entrenadores. <Link href="/entrenadores/nuevo" className="text-yellow-600 hover:underline">Agregar</Link>.
            </div>
          )}
          {!loading && !error && (trainers.length > 0 || q) && (
            <ul className="card divide-y divide-neutral-200 p-0 overflow-hidden">
              {filteredTrainers.length === 0 ? (
                <li className="px-4 py-6 text-center text-neutral-500 text-sm">Ningún resultado para «{search}».</li>
              ) : (
              filteredTrainers.map((t) => (
                <li key={t._id}>
                  <Link
                    href={`/entrenadores/${t._id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-lg" aria-hidden>🧑‍🏫</span>
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        {t.phone && <p className="text-sm text-neutral-600">{t.phone}</p>}
                      </div>
                    </div>
                    <span className="text-sm text-yellow-600">Ver →</span>
                  </Link>
                </li>
              ))
              )}
            </ul>
          )}
        </>
      )}

      {tab === 'familias' && (
        <>
          <div className="flex justify-end">
            <Link href="/familias/nueva" className="btn-primary text-sm">Nueva familia</Link>
          </div>
          {loading && <Loader />}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && families.length === 0 && !q && (
            <div className="card text-center py-12 text-neutral-500">
              No hay familias. <Link href="/familias/nueva" className="text-yellow-600 hover:underline">Agregar</Link>.
            </div>
          )}
          {!loading && !error && (families.length > 0 || q) && (
            <ul className="card divide-y divide-neutral-200 p-0 overflow-hidden">
              {filteredFamilies.length === 0 ? (
                <li className="px-4 py-6 text-center text-neutral-500 text-sm">Ningún resultado para «{search}».</li>
              ) : (
              filteredFamilies.map((f) => (
                <li key={f._id}>
                  <Link
                    href={`/familias/${f._id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{f.name}</p>
                      <p className="text-sm text-neutral-600">{f.contactName}</p>
                      {f.city && <p className="text-sm text-neutral-500">{f.city}</p>}
                    </div>
                    <span className="text-sm text-yellow-600">Ver →</span>
                  </Link>
                </li>
              ))
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
