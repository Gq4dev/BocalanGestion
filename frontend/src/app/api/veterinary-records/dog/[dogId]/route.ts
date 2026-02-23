import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import VeterinaryRecord from '@/server/models/VeterinaryRecord';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ dogId: string }> }
) {
  try {
    await connectDB();
    const { dogId } = await params;
    const list = await VeterinaryRecord.find({ dog: dogId })
      .populate('dog')
      .sort({ date: -1 });
    return NextResponse.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
