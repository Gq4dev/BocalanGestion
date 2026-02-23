import mongoose from 'mongoose';

const socializationFamilySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SocializationFamily ||
  mongoose.model('SocializationFamily', socializationFamilySchema);
