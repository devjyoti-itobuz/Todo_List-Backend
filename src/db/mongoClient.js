import mongoose from 'mongoose'
import config from '../config/constants.js';

export const connectDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      dbName: 'tasks',
    })
    console.log('MongoDB connected successfully')
    
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
