'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader } from '@/components/Loader';
import { api, uploadPhoto, type Dog, type SocializationFamily, type Trainer, type Beneficiary } from '@/lib/api';

export default function EditarPerroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [dog, setDog] = useState<Dog | null>(null);
  const [families, setFamilies] = useState<SocializationFamily[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    api.dogs.get(id).then((d) => {
      setDog(d);
      setForm({
        name: d.name,
        birthDate: d.birthDate ? d.birthDate.slice(0, 10) : '',
        breed: d.breed || '',
        sex: d.sex || '',
        chipId: d.chipId || '',
        stage: d.stage,
        socializationFamily: typeof d.socializationFamily === 'object' && d.socializationFamily ? (d.socializationFamily as SocializationFamily)._id : (d.socializationFamily as string) || '',
        trainer: typeof d.trainer === 'object' && d.trainer ? (d.trainer as Trainer)._id : (d.trainer as string) || '',
        beneficiary: typeof d.beneficiary === 'object' && d.beneficiary ? (d.beneficiary as Beneficiary)._id : (d.beneficiary as string) || '',
        notes: d.notes || '',
        photo: d.photo || '',
      });
    }).catch(() => {});
    api.socializationFamilies.list().then(setFamilies).catch(() => {});
    api.trainers.list().then(setTrainers).catch(() => {});
    api.beneficiaries.list().then(setBeneficiaries).catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dog) return;
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        stage: form.stage as Dog['stage'],
        birthDate: form.birthDate || undefined,
        breed: form.breed || undefined,
        sex: form.sex || undefined,
        chipId: form.chipId || undefined,
        notes: form.notes || undefined,
        photo: form.photo || undefined,
      };
      if (form.socializationFamily) body.socializationFamily = form.socializationFamily; else body.socializationFamily = null;
      if (form.trainer) body.trainer = form.trainer; else body.trainer = null;
      if (form.beneficiary) body.beneficiary = form.beneficiary; else body.beneficiary = null;
      await api.dogs.update(id, body as Partial<Dog>);
      router.push(`/perro/${id}`);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!dog) return <Loader />;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/perro/${id}`} className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">Editar {dog.name}</h1>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Foto</label>
          <div className="flex items-center gap-4">
            {form.photo && (
              <img src={form.photo} alt="" className="w-20 h-20 object-cover rounded-full border border-neutral-200" />
            )}
            <label className="cursor-pointer">
              <span className="btn-secondary text-sm">{form.photo ? 'Cambiar' : 'Subir foto'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const url = await uploadPhoto(f);
                    setForm((prev) => ({ ...prev, photo: url }));
                  } catch (err) {
                    alert((err as Error).message);
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
        <div>
          <label className="label">Nombre *</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="label">Etapa</label>
          <select
            className="input"
            value={form.stage}
            onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
          >
            <option value="cachorro">Cachorro</option>
            <option value="adolescente">Adolescente</option>
            <option value="graduado">Graduado</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Fecha de nacimiento</label>
            <input
              type="date"
              className="input"
              value={form.birthDate}
              onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Sexo</label>
            <select
              className="input"
              value={form.sex}
              onChange={(e) => setForm((f) => ({ ...f, sex: e.target.value }))}
            >
              <option value="">—</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Raza</label>
          <input
            className="input"
            value={form.breed}
            onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Chip</label>
          <input
            className="input"
            value={form.chipId}
            onChange={(e) => setForm((f) => ({ ...f, chipId: e.target.value }))}
          />
        </div>
        {form.stage === 'cachorro' && (
          <div>
            <label className="label">Familia de socialización</label>
            <select
              className="input"
              value={form.socializationFamily}
              onChange={(e) => setForm((f) => ({ ...f, socializationFamily: e.target.value }))}
            >
              <option value="">—</option>
              {families.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
        )}
        {form.stage === 'adolescente' && (
          <div>
            <label className="label">Entrenador</label>
            <select
              className="input"
              value={form.trainer}
              onChange={(e) => setForm((f) => ({ ...f, trainer: e.target.value }))}
            >
              <option value="">—</option>
              {trainers.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}
        {form.stage === 'graduado' && (
          <div>
            <label className="label">Usuario / beneficiario</label>
            <select
              className="input"
              value={form.beneficiary}
              onChange={(e) => setForm((f) => ({ ...f, beneficiary: e.target.value }))}
            >
              <option value="">—</option>
              {beneficiaries.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="label">Notas</label>
          <textarea
            className="input min-h-[80px]"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href={`/perro/${id}`} className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
