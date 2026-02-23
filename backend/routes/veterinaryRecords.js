import express from 'express';
import {
  getAll,
  getByDog,
  getById,
  create,
  update,
  remove,
} from '../controllers/veterinaryRecords.js';

const router = express.Router();
router.get('/', getAll);
router.get('/dog/:dogId', getByDog);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
export default router;
