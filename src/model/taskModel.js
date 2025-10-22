import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
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

const taskModel = mongoose.model('Task', taskSchema)
export default taskModel
