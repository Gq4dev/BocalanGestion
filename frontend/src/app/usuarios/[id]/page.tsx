'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, type Beneficiary } from '@/lib/api';

export default function UsuarioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    api.beneficiaries.get(id).then((b) => {
      setItem(b);
      setForm({
        name: b.name,
        phone: b.phone || '',
        email: b.email || '',
        address: b.address || '',
        conditionOrDisability: b.conditionOrDisability || '',
        notes: b.notes || '',
      });
    }).catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await api.beneficiaries.update(id, form);
      const updated = await api.beneficiaries.get(id);
      setItem(updated);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!item) return <p className="text-neutral-500">Cargando…</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/usuarios" className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">{item.name}</h1>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Nombre *</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Condición / discapacidad</label>
          <input className="input" value={form.conditionOrDisability} onChange={(e) => setForm((f) => ({ ...f, conditionOrDisability: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Teléfono</label>
            <input type="tel" className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">Dirección</label>
          <input className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href="/usuarios" className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
