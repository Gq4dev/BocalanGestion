import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema(
  {
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
    socializationFamily: { type: mongoose.Schema.Types.ObjectId, ref: 'SocializationFamily' },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Dog || mongoose.model('Dog', dogSchema);
