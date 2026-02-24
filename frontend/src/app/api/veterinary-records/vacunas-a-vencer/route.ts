import { NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import VeterinaryRecord from '@/server/models/VeterinaryRecord';

const DUE_WITHIN_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

export async function GET() {
  try {
    await connectDB();
    const limit = new Date(Date.now() + DUE_WITHIN_MS);
    const list = await VeterinaryRecord.find({
      type: 'vacuna',
      nextDueDate: { $lte: limit },
    })
      .populate('dog')
      .sort({ nextDueDate: 1 });
    return NextResponse.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
