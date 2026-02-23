'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type VeterinaryRecord } from '@/lib/api';

const TYPES: { value: VeterinaryRecord['type']; label: string }[] = [
  { value: 'vacuna', label: 'Vacuna' },
  { value: 'desparasitacion', label: 'Desparasitación' },
  { value: 'control', label: 'Control' },
  { value: 'enfermedad', label: 'Enfermedad' },
  { value: 'cirugia', label: 'Cirugía' },
  { value: 'otro', label: 'Otro' },
];

export default function EditarVeterinariaPage() {
  const params = useParams();
  const router = useRouter();
  const dogId = params.id as string;
  const recordId = params.recordId as string;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: '',
    type: 'control' as VeterinaryRecord['type'],
    description: '',
    vetName: '',
    vetClinic: '',
    nextDueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (!recordId) return;
    api.veterinaryRecords.get(recordId).then((r) => {
      setForm({
        date: r.date.slice(0, 10),
        type: r.type,
        description: r.description || '',
        vetName: r.vetName || '',
        vetClinic: r.vetClinic || '',
        nextDueDate: r.nextDueDate ? r.nextDueDate.slice(0, 10) : '',
        notes: r.notes || '',
      });
    }).catch(() => {});
  }, [recordId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.veterinaryRecords.update(recordId, {
        date: form.date,
        type: form.type,
        description: form.description || undefined,
        vetName: form.vetName || undefined,
        vetClinic: form.vetClinic || undefined,
        nextDueDate: form.nextDueDate || undefined,
        notes: form.notes || undefined,
      });
      router.push(`/perro/${dogId}#veterinaria`);
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
        <Link href={`/perro/${dogId}#veterinaria`} className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">Editar registro veterinario</h1>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Fecha *</label>
            <input type="date" className="input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Tipo *</label>
            <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as VeterinaryRecord['type'] }))}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Descripción</label>
          <input className="input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Veterinario/a</label>
            <input className="input" value={form.vetName} onChange={(e) => setForm((f) => ({ ...f, vetName: e.target.value }))} />
          </div>
          <div>
            <label className="label">Clínica</label>
            <input className="input" value={form.vetClinic} onChange={(e) => setForm((f) => ({ ...f, vetClinic: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Próximo control / vencimiento</label>
          <input type="date" className="input" value={form.nextDueDate} onChange={(e) => setForm((f) => ({ ...f, nextDueDate: e.target.value }))} />
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href={`/perro/${dogId}#veterinaria`} className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
