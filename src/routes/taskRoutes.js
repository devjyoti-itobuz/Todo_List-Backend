import express from 'express'
import ApiControllerFunctions from '../controller/taskController.js'
import {
  validateCreateTodo,
  validateUpdateTodo,
} from '../middleware/taskValidator.js'

const apiControllerFunctions = new ApiControllerFunctions()

const router = express.Router()

router.get('/', apiControllerFunctions.getAllTasks)
router.post('/', validateCreateTodo, apiControllerFunctions.createTask)
router.put('/:id', validateUpdateTodo, apiControllerFunctions.updateTask)
router.delete('/:id', apiControllerFunctions.deleteTask)
router.delete('/', apiControllerFunctions.clearAllTasks)

export default router
