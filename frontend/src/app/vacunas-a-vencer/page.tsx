'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type VeterinaryRecord, type Dog } from '@/lib/api';
import { Loader } from '@/components/Loader';

export default function VacunasAVencerPage() {
  const [list, setList] = useState<VeterinaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.veterinaryRecords
      .vacunasAVencer()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-neutral-500 hover:text-black">← Volver al dashboard</Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center gap-2">
          <span aria-hidden>💉</span>
          Vacunas a vencer
        </h1>
      </div>
      <p className="text-neutral-600 text-sm">Vacunas con vencimiento en los próximos 30 días o ya vencidas.</p>

      <section className="card">
        {list.length === 0 ? (
          <p className="text-neutral-500 text-sm py-4">No hay vacunas a vencer en los próximos 30 días.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {list.map((r) => {
              const dog = typeof r.dog === 'object' ? (r.dog as Dog) : null;
              const dogId = dog?._id ?? (r.dog as string);
              const dogName = dog?.name ?? 'Perro';
              const due = r.nextDueDate ? new Date(r.nextDueDate) : null;
              const isOverdue = due ? due.getTime() < Date.now() : false;
              return (
                <li key={r._id} className="py-3 first:pt-0 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link href={`/perro/${dogId}#veterinaria`} className="font-medium text-yellow-700 hover:text-yellow-800 hover:underline">
                      {dogName}
                    </Link>
                    {r.description && <span className="text-neutral-600 ml-2">– {r.description}</span>}
                    {due && (
                      <span className={`block text-sm mt-0.5 ${isOverdue ? 'text-red-600 font-medium' : 'text-neutral-500'}`}>
                        Vence: {due.toLocaleDateString('es')}
                        {isOverdue && ' (vencida)'}
                      </span>
                    )}
                  </div>
                  <Link href={`/perro/${dogId}/veterinaria/${r._id}`} className="text-sm text-yellow-600 hover:underline">
                    Editar
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
