import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date },
  breed: { type: String },
  sex: { type: String, enum: ['macho', 'hembra'] },
  chipId: { type: String },
  photo: { type: String },
  stage: {
    type: String,
    enum: ['cachorro', 'adolescente', 'graduado'],
    required: true,
    default: 'cachorro',
  },
  // Cachorro: familia de socialización
  socializationFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'SocializationFamily' },
  // Adolescente: entrenador
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  // Graduado: usuario final
  beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Dog', dogSchema);
