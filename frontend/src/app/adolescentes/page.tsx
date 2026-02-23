'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Dog, type Trainer } from '@/lib/api';

export default function AdolescentesPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.dogs.byStage('adolescente'), api.trainers.list()])
      .then(([d, t]) => {
        setDogs(d);
        setTrainers(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-500">Cargando adolescentes…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Adolescentes en entrenamiento
        </h1>
        <Link href="/adolescentes/nuevo" className="btn-primary w-full sm:w-auto">
          Nuevo adolescente
        </Link>
      </div>

      <p className="text-neutral-600">
        Perros en etapa de entrenamiento con su entrenador asignado y planillas de seguimiento.
      </p>

      {dogs.length === 0 ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay perros en entrenamiento. <Link href="/adolescentes/nuevo" className="text-yellow-600 hover:underline">Agregar uno</Link>.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => {
            const trainer = typeof dog.trainer === 'object' && dog.trainer
              ? dog.trainer
              : trainers.find((t) => t._id === dog.trainer);
            return (
              <li key={dog._id}>
                <Link
                  href={`/perro/${dog._id}`}
                  className="card block hover:border-yellow-400 hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-lg text-black">
                    {dog.name}
                  </div>
                  {dog.breed && <p className="text-sm text-neutral-600">{dog.breed}</p>}
                  {trainer && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Entrenador: {(trainer as Trainer).name}
                    </p>
                  )}
                  <Link
                    href={`/perro/${dog._id}#planillas`}
                    className="text-sm text-neutral-500 hover:text-yellow-600 mt-2 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver planillas →
                  </Link>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
