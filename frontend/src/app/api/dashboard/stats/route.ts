import { NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import Dog from '@/server/models/Dog';
import VeterinaryRecord from '@/server/models/VeterinaryRecord';

export async function GET() {
  try {
    await connectDB();

    const [cachorros, adolescentes, graduados, vacunasAVencer] = await Promise.all([
      Dog.countDocuments({ stage: 'cachorro' }),
      Dog.countDocuments({ stage: 'adolescente' }),
      Dog.countDocuments({ stage: 'graduado' }),
      VeterinaryRecord.countDocuments({
        type: 'vacuna',
        nextDueDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    return NextResponse.json({
      cachorros,
      adolescentes,
      graduados,
      vacunasAVencer,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
