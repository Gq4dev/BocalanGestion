'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { api, type TrainingSheetSkill } from '@/lib/api';

const PRESET_SKILLS = ['Obediencia básica', 'Camino en correa', 'Señales de asistencia', 'Socialización', 'Control en espacios públicos', 'Recoger objetos', 'Abrir puertas', 'Alertas', 'Otro'];
const LEVELS: { value: TrainingSheetSkill['level']; label: string }[] = [
  { value: 'no_iniciado', label: 'No iniciado' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'logrado', label: 'Logrado' },
  { value: 'mantenido', label: 'Mantenido' },
];

export default function NuevaPlanillaPage() {
  const params = useParams();
  const router = useRouter();
  const dogId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [generalNotes, setGeneralNotes] = useState('');
  const [nextGoals, setNextGoals] = useState('');
  const [skills, setSkills] = useState<TrainingSheetSkill[]>(
    PRESET_SKILLS.slice(0, 5).map((name) => ({ name, level: 'no_iniciado' as const }))
  );

  const updateSkill = (index: number, field: keyof TrainingSheetSkill, value: string) => {
    setSkills((prev) => {
      const next = [...prev];
      (next[index] as Record<string, string>)[field] = value;
      return next;
    });
  };

  const addSkill = () => setSkills((prev) => [...prev, { name: '', level: 'no_iniciado' }]);
  const removeSkill = (index: number) => setSkills((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.trainingSheets.create({
        dog: dogId,
        date,
        skills: skills.filter((s) => s.name.trim()),
        generalNotes: generalNotes || undefined,
        nextGoals: nextGoals || undefined,
      });
      router.push(`/perro/${dogId}#planillas`);
      router.refresh();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/perro/${dogId}#planillas`} className="text-neutral-500 hover:text-black">← Volver</Link>
        <h1 className="text-2xl font-bold">Nueva planilla de entrenamiento</h1>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="label">Fecha *</label>
          <input type="date" className="input max-w-[200px]" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Habilidades / ejercicios</label>
            <button type="button" onClick={addSkill} className="text-sm text-yellow-600 hover:underline">+ Agregar</button>
          </div>
          <div className="space-y-3">
            {skills.map((skill, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-center p-2 rounded-lg bg-neutral-100">
                <select className="input flex-1 min-w-[140px]" value={skill.name} onChange={(e) => updateSkill(i, 'name', e.target.value)}>
                  <option value="">— Elegir —</option>
                  {PRESET_SKILLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select className="input w-full sm:w-[140px]" value={skill.level || 'no_iniciado'} onChange={(e) => updateSkill(i, 'level', e.target.value)}>
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeSkill(i)} className="text-neutral-400 hover:text-red-600 p-1" aria-label="Quitar">✕</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Notas generales de la sesión</label>
          <textarea className="input min-h-[100px]" value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} placeholder="Cómo fue la sesión..." />
        </div>
        <div>
          <label className="label">Próximos objetivos</label>
          <textarea className="input min-h-[80px]" value={nextGoals} onChange={(e) => setNextGoals(e.target.value)} placeholder="Qué trabajar la próxima vez..." />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Link href={`/perro/${dogId}#planillas`} className="btn-secondary flex-1 sm:flex-none text-center">Cancelar</Link>
          <button type="submit" className="btn-primary flex-1 sm:flex-none" disabled={loading}>{loading ? 'Guardando…' : 'Guardar planilla'}</button>
        </div>
      </form>
    </div>
  );
}
