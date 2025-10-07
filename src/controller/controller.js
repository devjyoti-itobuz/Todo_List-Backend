import { readData, writeData, getISTLocalizedTime } from '../utils/utils.js'
import { taskCreateSchema, taskUpdateSchema } from '../validations/validator.js'

export const createTask = async (req, res, next) => {
  try {
    const validatedData = await taskCreateSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    const newTask = validatedData

    const data = await readData()
    data.tasks.push(newTask)
    await writeData(data)

    res.status(201).json(newTask)
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400
    }
    next(err)
  }
}

export const getAllTasks = async (req, res, next) => {
  try {
    const { search, status = 'all', priority } = req.query
    const data = await readData()
    let tasks = data.tasks

    if (search && typeof search === 'string') {
      const searchText = search.toLowerCase()

      tasks = tasks.filter((task) => {
        return (
          task.title?.toLowerCase().includes(searchText) ||
          task.priority?.toLowerCase().includes(searchText) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(searchText))
        )
      })
    }

    if (status === 'completed') {
      tasks = tasks.filter((task) => task.isCompleted === true)
    } else if (status === 'pending') {
      tasks = tasks.filter((task) => task.isCompleted === false)
    }

    if (priority && typeof priority === 'string') {
      tasks = tasks.filter(
        (task) => task.isImportant?.toLowerCase() === priority.toLowerCase()
      )
    }

    tasks.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    res.json(tasks)
  } catch (err) {
    next(err)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params

    const data = await readData()
    const initialLength = data.tasks.length
    const index = data.tasks.findIndex((t) => t.id === id)

    if (index === -1) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    data.tasks.splice(index, 1)

    if (data.tasks.length === initialLength) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

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

    const validatedData = await taskUpdateSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    })

    const data = await readData()
    const task = data.tasks.find((t) => t.id === id)

    if (!task) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }

    if (validatedData.title && typeof validatedData.title === 'string') {
      task.title = validatedData.title
    }
    if (Array.isArray(validatedData.tags)) {
      task.tags = validatedData.tags
    }
    if (
      validatedData.isImportant &&
      typeof validatedData.isImportant === 'string'
    ) {
      task.isImportant = validatedData.isImportant
    }
    if (typeof validatedData.isCompleted === 'boolean') {
      task.isCompleted = validatedData.isCompleted
    }

    task.updatedAt = getISTLocalizedTime()

    await writeData(data)
    res.json(task)
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400
    }
    next(err)
  }
}
