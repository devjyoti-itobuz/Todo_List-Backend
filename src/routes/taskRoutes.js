import express from 'express'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  clearAllTasks,
} from '../controller/taskController.js'
import {
  validateCreateTodo,
  validateUpdateTodo,
} from '../middleware/taskValidator.js'

const router = express.Router()

router.get('/', getAllTasks)
router.post('/', validateCreateTodo, createTask)
router.put('/:id', validateUpdateTodo, updateTask)
router.delete('/:id', deleteTask)
router.delete('/', clearAllTasks)

export default router
