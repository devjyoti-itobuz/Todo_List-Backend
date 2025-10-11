import express from 'express'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  clearAllTasks,
} from '../controller/controller.js'
import {
  validateCreateTodo,
  validateUpdateTodo,
} from '../validations/validator.js'

const router = express.Router()

router.get('/', getAllTasks)
router.post('/', validateCreateTodo, createTask)
router.put('/:id', validateUpdateTodo, updateTask)
router.delete('/:id', deleteTask)
router.delete('/', clearAllTasks)

export default router