const API = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  dogs: {
    list: () => fetchApi<Dog[]>(`/api/dogs`),
    byStage: (stage: string) => fetchApi<Dog[]>(`/api/dogs/by-stage/${stage}`),
    get: (id: string) => fetchApi<Dog>(`/api/dogs/${id}`),
    create: (body: Partial<Dog>) => fetchApi<Dog>(`/api/dogs`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Dog>) => fetchApi<Dog>(`/api/dogs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/api/dogs/${id}`, { method: 'DELETE' }),
  },
  socializationFamilies: {
    list: () => fetchApi<SocializationFamily[]>(`/api/socialization-families`),
    get: (id: string) => fetchApi<SocializationFamily>(`/api/socialization-families/${id}`),
    create: (body: Partial<SocializationFamily>) => fetchApi<SocializationFamily>(`/api/socialization-families`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<SocializationFamily>) => fetchApi<SocializationFamily>(`/api/socialization-families/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/api/socialization-families/${id}`, { method: 'DELETE' }),
  },
  trainers: {
    list: () => fetchApi<Trainer[]>(`/api/trainers`),
    get: (id: string) => fetchApi<Trainer>(`/api/trainers/${id}`),
    create: (body: Partial<Trainer>) => fetchApi<Trainer>(`/api/trainers`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Trainer>) => fetchApi<Trainer>(`/api/trainers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/api/trainers/${id}`, { method: 'DELETE' }),
  },
  beneficiaries: {
    list: () => fetchApi<Beneficiary[]>(`/api/beneficiaries`),
    get: (id: string) => fetchApi<Beneficiary>(`/api/beneficiaries/${id}`),
    create: (body: Partial<Beneficiary>) => fetchApi<Beneficiary>(`/api/beneficiaries`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Beneficiary>) => fetchApi<Beneficiary>(`/api/beneficiaries/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/api/beneficiaries/${id}`, { method: 'DELETE' }),
  },
  trainingSheets: {
    list: () => fetchApi<TrainingSheet[]>(`/api/training-sheets`),
    byDog: (dogId: string) => fetchApi<TrainingSheet[]>(`/api/training-sheets/dog/${dogId}`),
    get: (id: string) => fetchApi<TrainingSheet>(`/api/training-sheets/${id}`),
    create: (body: Partial<TrainingSheet>) => fetchApi<TrainingSheet>(`/api/training-sheets`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<TrainingSheet>) => fetchApi<TrainingSheet>(`/api/training-sheets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/api/training-sheets/${id}`, { method: 'DELETE' }),
  },
  veterinaryRecords: {
    list: () => fetchApi<VeterinaryRecord[]>(`/api/veterinary-records`),
    byDog: (dogId: string) => fetchApi<VeterinaryRecord[]>(`/api/veterinary-records/dog/${dogId}`),
    get: (id: string) => fetchApi<VeterinaryRecord>(`/api/veterinary-records/${id}`),
    create: (body: Partial<VeterinaryRecord>) => fetchApi<VeterinaryRecord>(`/api/veterinary-records`, { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<VeterinaryRecord>) => fetchApi<VeterinaryRecord>(`/api/veterinary-records/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => fetchApi<{ message: string }>(`/api/veterinary-records/${id}`, { method: 'DELETE' }),
  },
};

export interface Dog {
  _id: string;
  name: string;
  birthDate?: string;
  breed?: string;
  sex?: 'macho' | 'hembra';
  chipId?: string;
  photo?: string;
  stage: 'cachorro' | 'adolescente' | 'graduado';
  socializationFamily?: SocializationFamily | string;
  trainer?: Trainer | string;
  beneficiary?: Beneficiary | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocializationFamily {
  _id: string;
  name: string;
  contactName: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface Trainer {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Beneficiary {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  conditionOrDisability?: string;
  notes?: string;
}

export interface TrainingSheetSkill {
  name: string;
  level?: 'no_iniciado' | 'en_proceso' | 'logrado' | 'mantenido';
  notes?: string;
}

export interface TrainingSheet {
  _id: string;
  dog: Dog | string;
  date: string;
  skills?: TrainingSheetSkill[];
  generalNotes?: string;
  nextGoals?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VeterinaryRecord {
  _id: string;
  dog: Dog | string;
  date: string;
  type: 'vacuna' | 'desparasitacion' | 'control' | 'enfermedad' | 'cirugia' | 'otro';
  description?: string;
  vetName?: string;
  vetClinic?: string;
  nextDueDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
