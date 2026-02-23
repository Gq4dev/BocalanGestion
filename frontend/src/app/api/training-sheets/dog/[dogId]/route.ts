import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import TrainingSheet from '@/server/models/TrainingSheet';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ dogId: string }> }
) {
  try {
    await connectDB();
    const { dogId } = await params;
    const list = await TrainingSheet.find({ dog: dogId })
      .populate('dog')
      .sort({ date: -1 });
    return NextResponse.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
