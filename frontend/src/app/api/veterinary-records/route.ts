import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import VeterinaryRecord from '@/server/models/VeterinaryRecord';

export async function GET() {
  try {
    await connectDB();
    const list = await VeterinaryRecord.find().populate('dog').sort({ date: -1 });
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
    const doc = await VeterinaryRecord.create(body);
    const populated = await VeterinaryRecord.findById(doc._id).populate('dog');
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
