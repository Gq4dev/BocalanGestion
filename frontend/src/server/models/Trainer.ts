import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    notes: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema);
