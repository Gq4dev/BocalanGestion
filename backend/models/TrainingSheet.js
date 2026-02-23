import mongoose from 'mongoose';

const trainingSheetSchema = new mongoose.Schema({
  dog: { type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true },
  date: { type: Date, required: true, default: Date.now },
  // Planilla fácil de cargar: habilidades con nivel o checkbox
  skills: [{
    name: { type: String, required: true },
    level: { type: String, enum: ['no_iniciado', 'en_proceso', 'logrado', 'mantenido'] },
    notes: { type: String },
  }],
  generalNotes: { type: String },
  nextGoals: { type: String },
}, { timestamps: true });

export default mongoose.model('TrainingSheet', trainingSheetSchema);
