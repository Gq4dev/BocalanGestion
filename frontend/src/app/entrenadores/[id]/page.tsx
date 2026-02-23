'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, uploadPhoto, type Trainer } from '@/lib/api';

export default function EntrenadorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    api.trainers.get(id).then((t) => {
      setItem(t);
      setForm({ name: t.name, phone: t.phone || '', email: t.email || '', notes: t.notes || '', photo: t.photo || '' });
    }).catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await api.trainers.update(id, { name: form.name, phone: form.phone, email: form.email, notes: form.notes, photo: form.photo || undefined });
      const updated = await api.trainers.get(id);
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
        <Link href="/entrenadores" className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">{item.name}</h1>
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
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label className="label">Teléfono</label>
          <input type="tel" className="input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href="/entrenadores" className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
