import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import Dog from '@/server/models/Dog';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const dog = await Dog.findById(id)
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary');
    if (!dog) {
      return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 });
    }
    return NextResponse.json(dog);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const dog = await Dog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary');
    if (!dog) {
      return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 });
    }
    return NextResponse.json(dog);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const dog = await Dog.findByIdAndDelete(id);
    if (!dog) {
      return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Perro eliminado' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
