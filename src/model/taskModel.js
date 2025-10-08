import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isImportant: {
      type: String,
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: String,
      default: () =>
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    },
    updatedAt: {
      type: String,
      default: () =>
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    },
  },
  {
    timestamps: false, // managing timestamps manually
  }
)

export const Task = mongoose.model('Task', taskSchema)
