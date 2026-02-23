import Dog from '../models/Dog.js';

export const getDogs = async (req, res) => {
  try {
    const dogs = await Dog.find()
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary')
      .sort({ createdAt: -1 });
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDogsByStage = async (req, res) => {
  try {
    const { stage } = req.params;
    const dogs = await Dog.find({ stage })
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary')
      .sort({ createdAt: -1 });
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDogById = async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id)
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary');
    if (!dog) return res.status(404).json({ error: 'Perro no encontrado' });
    res.json(dog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDog = async (req, res) => {
  try {
    const dog = await Dog.create(req.body);
    const populated = await Dog.findById(dog._id)
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDog = async (req, res) => {
  try {
    const dog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('socializationFamily')
      .populate('trainer')
      .populate('beneficiary');
    if (!dog) return res.status(404).json({ error: 'Perro no encontrado' });
    res.json(dog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findByIdAndDelete(req.params.id);
    if (!dog) return res.status(404).json({ error: 'Perro no encontrado' });
    res.json({ message: 'Perro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
