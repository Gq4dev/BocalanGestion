import mongoose from 'mongoose';

const veterinaryRecordSchema = new mongoose.Schema({
  dog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
  date: { type: Date, required: true, default: Date.now },
  type: {
    type: String,
    enum: ['vacuna', 'desparasitacion', 'control', 'enfermedad', 'cirugia', 'otro'],
    required: true,
  },
  description: { type: String },
  vetName: { type: String },
  vetClinic: { type: String },
  nextDueDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('VeterinaryRecord', veterinaryRecordSchema);
