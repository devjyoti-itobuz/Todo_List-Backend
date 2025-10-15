import mongoose from 'mongoose'
import 'dotenv/config'

const MONGO_URI = process.env.MONGO_URI

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'tasks',
    })
    console.log('MongoDB connected successfully')
    
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
