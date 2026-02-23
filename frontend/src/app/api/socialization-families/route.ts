import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import SocializationFamily from '@/server/models/SocializationFamily';

export async function GET() {
  try {
    await connectDB();
    const list = await SocializationFamily.find().sort({ name: 1 });
    return NextResponse.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const doc = await SocializationFamily.create(body);
    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
