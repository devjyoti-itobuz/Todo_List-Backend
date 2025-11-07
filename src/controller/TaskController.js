import Task from '../model/taskModel.js'
import mongoose from 'mongoose'

export default class TaskController {
  createTask = async (req, res, next) => {
    
    try {
      const userId = req.user.userId
      const newTask = new Task({ ...req.body, userId })

      await newTask.save()

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task: newTask,
      })

    } catch (err) {
      next(err)
    }
  }

  getAllTasks = async (req, res, next) => {
    
    try {
      const userId = req.user.userId
      const { search, status = 'all', priority } = req.query
      const query = { userId }

      if (status === 'completed') {
        query.isCompleted = true
      }
      else if (status === 'pending') {
        query.isCompleted = false
      }

      if (priority) {
        query.isImportant = { $regex: new RegExp(`^${priority}$`, 'i') }
      }

      if (search && typeof search === 'string') {
        const searchRegex = new RegExp(search, 'i')
        query.$or = [
          { title: searchRegex },
          { tags: { $elemMatch: { $regex: searchRegex } } },
        ]
      }

      // const sortQuery = sortBy
      //   ? { [sortBy]: -1, isCompleted: 1 }
      //   : { updatedAt: -1, isCompleted: 1 }
      const sortQuery = {updatedAt: -1, isCompleted: 1};

      const tasks = await Task.find(query).sort(sortQuery)

      res.json({
        success: true,
        message: tasks.length ? 'Tasks fetched successfully' : 'No tasks found',
        tasks,
      })

    } catch (err) {
      next(err)
    }
  }

  deleteTask = async (req, res, next) => {
    
    try {
      const { id } = req.params
      const userId = req.user.userId

      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('Invalid task ID')
        error.status = 400
        return next(error)
      }

      const deletedTask = await Task.findOneAndDelete({ _id: id, userId })

      if (!deletedTask) {
        const error = new Error('Task not found')
        error.status = 404
        return next(error)
      }

      res.json({
        success: true,
        message: 'Task deleted successfully',
        taskId: id,
      })

    } catch (err) {
      next(err)
    }
  }

  clearAllTasks = async (req, res, next) => {
    
    try {
      const userId = req.user.userId

      await Task.deleteMany({ userId })
      
      res.json({
        success: true,
        message: 'All tasks cleared',
      })

    } catch (err) {
      next(err)
    }
  }

  updateTask = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user.userId

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid task ID')
      error.status = 400
      return next(error)
    }

    try {
      const updatedTask = await Task.findByIdAndUpdate(
        { _id: id, userId },
        { $set: req.body },
        { new: true }
      )

      if (!updatedTask) {
        const error = new Error('Task not found')
        error.status = 404
        return next(error)
      }

      res.json({
        success: true,
        message: 'Task updated successfully',
        task: updatedTask,
      })
      
    } catch (err) {
      next(err)
    }
  }
}
