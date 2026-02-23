'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type SocializationFamily } from '@/lib/api';

export default function NuevoCachorroPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<SocializationFamily[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    birthDate: '',
    breed: '',
    sex: '' as '' | 'macho' | 'hembra',
    chipId: '',
    socializationFamily: '',
    notes: '',
  });

  useEffect(() => {
    api.socializationFamilies.list().then(setFamilies).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        stage: 'cachorro',
        birthDate: form.birthDate || undefined,
        breed: form.breed || undefined,
        sex: form.sex || undefined,
        chipId: form.chipId || undefined,
        notes: form.notes || undefined,
      };
      if (form.socializationFamily) body.socializationFamily = form.socializationFamily;
      await api.dogs.create(body as Parameters<typeof api.dogs.create>[0]);
      router.push('/cachorros');
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/perros?etapa=cachorro" className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">Nuevo cachorro</h1>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Nombre *</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            placeholder="Ej. Luna"
          />
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
              onChange={(e) => setForm((f) => ({ ...f, sex: e.target.value as 'macho' | 'hembra' }))}
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
            placeholder="Ej. Labrador"
          />
        </div>
        <div>
          <label className="label">Número de chip</label>
          <input
            className="input"
            value={form.chipId}
            onChange={(e) => setForm((f) => ({ ...f, chipId: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Familia de socialización</label>
          <select
            className="input"
            value={form.socializationFamily}
            onChange={(e) => setForm((f) => ({ ...f, socializationFamily: e.target.value }))}
          >
            <option value="">— Sin asignar —</option>
            {families.map((fam) => (
              <option key={fam._id} value={fam._id}>{fam.name} – {fam.contactName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea
            className="input min-h-[80px]"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Observaciones..."
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href="/perros?etapa=cachorro" className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar cachorro'}
          </button>
        </div>
      </form>
    </div>
  );
}
