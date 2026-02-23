import { NextRequest, NextResponse } from 'next/server';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx. 2 MB)' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo no permitido (JPEG, PNG, WebP, GIF)' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const url = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al subir';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
