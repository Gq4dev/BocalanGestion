import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  conditionOrDisability: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Beneficiary', beneficiarySchema);
