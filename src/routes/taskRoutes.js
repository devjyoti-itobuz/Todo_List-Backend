import express from 'express'
import TaskController from '../controller/TaskController.js'
import {
  validateCreateTodo,
  validateUpdateTodo,
} from '../middleware/validator/taskValidator.js'

const taskControllerFunctions = new TaskController()

const router = express.Router()

router.get('/', taskControllerFunctions.getAllTasks)
router.post('/', validateCreateTodo, taskControllerFunctions.createTask)
router.put('/:id', validateUpdateTodo, taskControllerFunctions.updateTask)
router.delete('/:id', taskControllerFunctions.deleteTask)
router.delete('/', taskControllerFunctions.clearAllTasks)

export default router
