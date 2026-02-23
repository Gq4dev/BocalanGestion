'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Dog, type TrainingSheet, type VeterinaryRecord, type SocializationFamily, type Trainer, type Beneficiary } from '@/lib/api';

export default function PerroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [dog, setDog] = useState<Dog | null>(null);
  const [sheets, setSheets] = useState<TrainingSheet[]>([]);
  const [vetRecords, setVetRecords] = useState<VeterinaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.dogs.get(id)
      .then(setDog)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.trainingSheets.byDog(id).then(setSheets).catch(() => {});
    api.veterinaryRecords.byDog(id).then(setVetRecords).catch(() => {});
  }, [id]);

  if (loading) return <p className="text-neutral-500">Cargando…</p>;
  if (error || !dog) return <p className="text-red-600">Error: {error || 'Perro no encontrado'}</p>;

  const family = typeof dog.socializationFamily === 'object' ? dog.socializationFamily as SocializationFamily : null;
  const trainer = typeof dog.trainer === 'object' ? dog.trainer as Trainer : null;
  const beneficiary = typeof dog.beneficiary === 'object' ? dog.beneficiary as Beneficiary : null;

  const stageLinks = {
    cachorro: { href: '/cachorros', label: 'Cachorros' },
    adolescente: { href: '/adolescentes', label: 'Adolescentes' },
    graduado: { href: '/graduados', label: 'Graduados' },
  };
  const back = stageLinks[dog.stage];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={back?.href || '/'} className="text-neutral-500 hover:text-black">← Volver</Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            {dog.name}
          </h1>
          <span className="rounded-full bg-yellow-100 text-yellow-900 px-3 py-0.5 text-sm font-medium capitalize">
            {dog.stage}
          </span>
        </div>
        <Link href={`/perro/${id}/editar`} className="btn-secondary w-full sm:w-auto text-center">
          Editar perro
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="card">
          <h2 className="text-lg font-semibold mb-4">Datos del perro</h2>
          <dl className="space-y-2 text-sm">
            {dog.birthDate && <Row label="Nacimiento" value={new Date(dog.birthDate).toLocaleDateString('es')} />}
            {dog.breed && <Row label="Raza" value={dog.breed} />}
            {dog.sex && <Row label="Sexo" value={dog.sex} />}
            {dog.chipId && <Row label="Chip" value={dog.chipId} />}
            {dog.notes && <Row label="Notas" value={dog.notes} />}
          </dl>
        </section>

        {(family || trainer || beneficiary) && (
          <section className="card">
            <h2 className="text-lg font-semibold mb-4">
              {dog.stage === 'cachorro' && 'Familia de socialización'}
              {dog.stage === 'adolescente' && 'Entrenador'}
              {dog.stage === 'graduado' && 'Usuario / beneficiario'}
            </h2>
            {family && (
              <dl className="space-y-2 text-sm">
                <Row label="Familia" value={family.name} />
                <Row label="Contacto" value={family.contactName} />
                {family.phone && <Row label="Teléfono" value={family.phone} />}
                {family.email && <Row label="Email" value={family.email} />}
                {family.city && <Row label="Ciudad" value={family.city} />}
              </dl>
            )}
            {trainer && (
              <dl className="space-y-2 text-sm">
                <Row label="Entrenador" value={trainer.name} />
                {trainer.phone && <Row label="Teléfono" value={trainer.phone} />}
                {trainer.email && <Row label="Email" value={trainer.email} />}
              </dl>
            )}
            {beneficiary && (
              <dl className="space-y-2 text-sm">
                <Row label="Usuario" value={beneficiary.name} />
                {beneficiary.phone && <Row label="Teléfono" value={beneficiary.phone} />}
                {beneficiary.email && <Row label="Email" value={beneficiary.email} />}
                {beneficiary.conditionOrDisability && <Row label="Condición" value={beneficiary.conditionOrDisability} />}
              </dl>
            )}
          </section>
        )}
      </div>

      <section id="veterinaria" className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold">Ficha veterinaria</h2>
          <Link href={`/perro/${id}/veterinaria/nuevo`} className="btn-primary text-sm w-full sm:w-auto text-center">
            + Cargar registro
          </Link>
        </div>
        {vetRecords.length === 0 ? (
          <p className="text-neutral-500 text-sm">Sin registros. Agregá vacunas, desparasitaciones y controles.</p>
        ) : (
          <ul className="space-y-3">
            {vetRecords.map((r) => (
              <li key={r._id} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-neutral-200 last:border-0">
                <div>
                  <span className="font-medium capitalize">{r.type}</span>
                  {r.description && <span className="text-neutral-600 ml-2">– {r.description}</span>}
                  <span className="text-neutral-500 text-sm block mt-0.5">
                    {new Date(r.date).toLocaleDateString('es')}
                    {r.vetName && ` · ${r.vetName}`}
                  </span>
                </div>
                <Link href={`/perro/${id}/veterinaria/${r._id}`} className="text-sm text-yellow-600 hover:underline">
                  Editar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dog.stage === 'adolescente' && (
        <section id="planillas" className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold">Planillas de entrenamiento</h2>
            <Link href={`/perro/${id}/planilla/nueva`} className="btn-primary text-sm w-full sm:w-auto text-center">
              + Nueva planilla
            </Link>
          </div>
          {sheets.length === 0 ? (
            <p className="text-neutral-500 text-sm">Sin planillas. Cargá sesiones de entrenamiento.</p>
          ) : (
            <ul className="space-y-3">
              {sheets.map((s) => (
                <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-neutral-200 last:border-0">
                  <div>
                    <span className="font-medium">{new Date(s.date).toLocaleDateString('es')}</span>
                    {s.generalNotes && <p className="text-neutral-600 text-sm mt-0.5 line-clamp-2">{s.generalNotes}</p>}
                  </div>
                  <Link href={`/perro/${id}/planilla/${s._id}`} className="text-sm text-yellow-600 hover:underline">
                    Ver / Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
