// import { readData, writeData, getISTLocalizedTime } from '../utils/utils.js'
import { getISTLocalizedTime } from '../utils/utils.js'
import { taskCreateSchema, taskUpdateSchema } from '../schema/schema.js'
// import { validateRequest } from '../validations/validator.js'
import { Task } from '../model/taskModel.js'
import mongoose from 'mongoose'

export const createTask = async (req, res, next) => {
  const validatedData = await validateRequest(taskCreateSchema, req.body, next)
  if (!validatedData) return

  try {
    const newTask = new Task(validatedData)

    await newTask.save()

    res.status(201).json(newTask)
  } catch (err) {
    next(err)
  }
}

export const getAllTasks = async (req, res, next) => {
  try {
    const { search, status = 'all', priority } = req.query

    // Build MongoDB query object
    const query = {}

    if (status === 'completed') {
      query.isCompleted = true
    } else if (status === 'pending') {
      query.isCompleted = false
    }

    if (priority && typeof priority === 'string') {
      query.isImportant = { $regex: new RegExp(`^${priority}$`, 'i') } // case-insensitive exact match
    }

    // Search filter on title, priority, tags
    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search, 'i') // case-insensitive partial match

      query.$or = [
        { title: searchRegex },
        // { isImportant: searchRegex },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ]
    }

    // Execute the query with sorting by updatedAt desc
    const tasks = await Task.find(query).sort({ updatedAt: -1 })

    res.json(tasks)
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    // console.log('Deleting task with id:', id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid task ID')
      error.status = 400
      return next(error)
    }

    const deletedTask = await Task.findByIdAndDelete(id)
    // console.log('Deleted task:', deletedTask)

    if (!deletedTask) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const clearAllTasks = async (req, res, next) => {
  try {
    // Delete all documents in the Task collection
    await Task.deleteMany({})

    res.json({ message: 'All tasks cleared' })
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid task ID')
    error.status = 400
    return next(error)
  }

  const validatedData = await validateRequest(taskUpdateSchema, req.body, next)
  if (!validatedData) return

  try {
    validatedData.updatedAt = getISTLocalizedTime()

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true } // return the updated document
    )

    if (!updatedTask) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    res.json(updatedTask)
  } catch (err) {
    next(err)
  }
}
