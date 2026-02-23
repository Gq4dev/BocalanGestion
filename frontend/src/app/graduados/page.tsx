'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Dog, type Beneficiary } from '@/lib/api';

export default function GraduadosPage() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.dogs.byStage('graduado'), api.beneficiaries.list()])
      .then(([d, b]) => {
        setDogs(d);
        setBeneficiaries(b);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-neutral-500">Cargando graduados…</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Graduados
        </h1>
        <Link href="/graduados/nuevo" className="btn-primary w-full sm:w-auto">
          Nuevo graduado
        </Link>
      </div>

      <p className="text-neutral-600">
        Perros ya graduados y datos de sus usuarios/beneficiarios.
      </p>

      {dogs.length === 0 ? (
        <div className="card text-center py-12 text-neutral-500">
          No hay graduados cargados. <Link href="/graduados/nuevo" className="text-yellow-600 hover:underline">Agregar uno</Link>.
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => {
            const beneficiary = typeof dog.beneficiary === 'object' && dog.beneficiary
              ? dog.beneficiary
              : beneficiaries.find((b) => b._id === dog.beneficiary);
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
                  {beneficiary && (
                    <p className="text-sm text-yellow-600 mt-1">
                      Usuario: {(beneficiary as Beneficiary).name}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
