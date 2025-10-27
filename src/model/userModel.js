import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    profileImage: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

const userModel = mongoose.model('User', userSchema)
export default userModel
