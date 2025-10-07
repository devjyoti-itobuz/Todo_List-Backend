import { v4 as uuidv4 } from 'uuid'
import { readData, writeData, getISTLocalizedTime } from '../utils/utils.js'

export const createTask = async (req, res, next) => {
  try {
    const { title, tags = [], isImportant } = req.body

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      const error = new Error('Invalid title (min 3 characters)')
      error.status = 400
      return next(error)
      // return res.status(400).json({ error: 'Invalid title (min 3 characters)' })
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      tags: Array.isArray(tags) ? tags : [],
      isImportant: isImportant.trim(),
      isCompleted: false,
      createdAt: getISTLocalizedTime(),
      updatedAt: getISTLocalizedTime(),
    }

    const data = await readData()
    data.tasks.push(newTask)
    await writeData(data)

    res.status(201).json(newTask)
  } catch (err) {
    // res.status(500).json({ error: `Failed to create task, ${err}` })
    next(err)
  }
}

export const getAllTasks = async (req, res, next) => {
  try {
    const data = await readData()
    res.json(data.tasks)
  } catch (err) {
    // res.status(500).json({ error: `Failed to load tasks, ${err}` })
    next(err)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params

    const data = await readData()
    const initialLength = data.tasks.length
    data.tasks = data.tasks.filter((t) => t.id !== id)

    if (data.tasks.length === initialLength)
      return res.status(404).json({ error: 'Task not found' })

    await writeData(data)
    res.status(204).send()
  } catch (err) {
    // res.status(500).json({ error: `Failed to delete task,  ${err}` })
    next(err)
  }
}

export const clearAllTasks = async (req, res, next) => {
  try {
    const data = { tasks: [] }
    await writeData(data)
    res.json({ message: 'All tasks cleared' })
  } catch (err) {
    // res.status(500).json({ error: `Failed to clear tasks, ${err}` })
    next(err)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, tags, isImportant, isCompleted } = req.body

    const data = await readData()
    const task = data.tasks.find((t) => t.id === id)

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    if (title && typeof title === 'string') task.title = title.trim()
    if (Array.isArray(tags)) task.tags = tags
    if (isImportant && typeof isImportant === 'string')
      task.isImportant = isImportant
    if (typeof isCompleted === 'boolean') task.isCompleted = isCompleted

    task.updatedAt = getISTLocalizedTime()

    await writeData(data)
    res.json(task)
  } catch (err) {
    // res.status(500).json({ error: `Failed to update task, ${err}` })
    next(err)
  }
}
