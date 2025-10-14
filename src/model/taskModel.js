import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: '',
    },
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
  },
  {
    timestamps: true,
  }
)

export const Task = mongoose.model('Task', taskSchema)
