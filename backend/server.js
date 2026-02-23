import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dogsRouter from './routes/dogs.js';
import socializationFamiliesRouter from './routes/socializationFamilies.js';
import trainersRouter from './routes/trainers.js';
import beneficiariesRouter from './routes/beneficiaries.js';
import trainingSheetsRouter from './routes/trainingSheets.js';
import veterinaryRecordsRouter from './routes/veterinaryRecords.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/dogs', dogsRouter);
app.use('/api/socialization-families', socializationFamiliesRouter);
app.use('/api/trainers', trainersRouter);
app.use('/api/beneficiaries', beneficiariesRouter);
app.use('/api/training-sheets', trainingSheetsRouter);
app.use('/api/veterinary-records', veterinaryRecordsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API en http://localhost:${PORT}`);
});
