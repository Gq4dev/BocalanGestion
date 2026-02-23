import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import Dog from '@/server/models/Dog';
import '@/server/models/SocializationFamily';
import '@/server/models/Trainer';
import '@/server/models/Beneficiary';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ stage: string }> }
) {
  try {
    await connectDB();
    const { stage } = await params;
    const dogs = await Dog.find({ stage })
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary')
      .sort({ createdAt: -1 });
    return NextResponse.json(dogs);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
