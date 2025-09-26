import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  clearAllTasks,
} from '../controller/controller.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.delete('/', clearAllTasks);

export default router;