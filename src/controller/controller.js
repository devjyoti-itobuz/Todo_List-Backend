import { readFile, writeFile } from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../../database/db.json')

async function readData() {
  const data = await readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

async function writeData(data) {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

function getISTLocalizedTime() {
  const now = new Date()
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: true, // Use 12-hour clock with AM/PM
  }
  return now.toLocaleString('en-IN', options)
}

export const createTask = async (req, res) => {
  try {
    const { title, tags = [], isImportant } = req.body

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ error: 'Invalid title (min 3 characters)' })
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
    res.status(500).json({ error: `Failed to create task, ${err}` })
  }
}

export const getAllTasks = async (req, res) => {
  try {
    const data = await readData()
    res.json(data.tasks)
  } catch (err) {
    res.status(500).json({ error: `Failed to load tasks, ${err}` })
  }
}

export const deleteTask = async (req, res) => {
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
    res.status(500).json({ error: `Failed to delete task,  ${err}` })
  }
}

export const clearAllTasks = async (req, res) => {
  try {
    const data = { tasks: [] }
    await writeData(data)
    res.json({ message: 'All tasks cleared' })
  } catch (err) {
    res.status(500).json({ error: `Failed to clear tasks, ${err}` })
  }
}

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { title, tags, isImportant, isCompleted } = req.body

    const data = await readData()
    const task = data.tasks.find((t) => t.id === id)

    if (!task) return res.status(404).json({ error: 'Task not found' })

    if (title && typeof title === 'string') task.title = title.trim()
    if (Array.isArray(tags)) task.tags = tags
    if (isImportant && typeof isImportant === 'string') task.isImportant = isImportant
    if (typeof isCompleted === 'boolean') task.isCompleted = isCompleted

    task.updatedAt = getISTLocalizedTime()

    await writeData(data)
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: `Failed to update task, ${err}` })
  }
}