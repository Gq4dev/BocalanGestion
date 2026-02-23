import express from 'express';
import {
  getDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
  getDogsByStage,
} from '../controllers/dogs.js';

const router = express.Router();

router.get('/', getDogs);
router.get('/by-stage/:stage', getDogsByStage);
router.get('/:id', getDogById);
router.post('/', createDog);
router.put('/:id', updateDog);
router.delete('/:id', deleteDog);

export default router;
