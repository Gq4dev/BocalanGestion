'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NuevaFamiliaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.socializationFamilies.create(form);
      router.push('/familias');
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
        <Link href="/familias" className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">Nueva familia de socialización</h1>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">Nombre de la familia *</label>
          <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Ej. Familia García" />
        </div>
        <div>
          <label className="label">Nombre del contacto *</label>
          <input className="input" value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} required />
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
          <label className="label">Ciudad</label>
          <input className="input" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href="/familias" className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
