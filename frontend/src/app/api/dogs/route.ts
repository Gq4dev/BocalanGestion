import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import Dog from '@/server/models/Dog';
import '@/server/models/SocializationFamily';
import '@/server/models/Trainer';
import '@/server/models/Beneficiary';

export async function GET() {
  try {
    await connectDB();
    const dogs = await Dog.find()
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const dog = await Dog.create(body);
    const populated = await Dog.findById(dog._id)
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary');
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
