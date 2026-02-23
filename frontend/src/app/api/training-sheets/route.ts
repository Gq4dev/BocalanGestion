import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import TrainingSheet from '@/server/models/TrainingSheet';

export async function GET() {
  try {
    await connectDB();
    const list = await TrainingSheet.find().populate('dog').sort({ date: -1 });
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
    const doc = await TrainingSheet.create(body);
    const populated = await TrainingSheet.findById(doc._id).populate('dog');
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
