import VeterinaryRecord from '../models/VeterinaryRecord.js';

export const getAll = async (req, res) => {
  try {
    const list = await VeterinaryRecord.find().populate('dog').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getByDog = async (req, res) => {
  try {
    const list = await VeterinaryRecord.find({ dog: req.params.dogId }).populate('dog').sort({ date: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const doc = await VeterinaryRecord.findById(req.params.id).populate('dog');
    if (!doc) return res.status(404).json({ error: 'No encontrado' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = await VeterinaryRecord.create(req.body);
    const populated = await VeterinaryRecord.findById(doc._id).populate('dog');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const doc = await VeterinaryRecord.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('dog');
    if (!doc) return res.status(404).json({ error: 'No encontrado' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const doc = await VeterinaryRecord.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
