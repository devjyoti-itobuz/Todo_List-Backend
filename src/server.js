import 'dotenv/config'
import express from 'express'
import tasksRouter from './routes/taskRoutes.js'
import cors from 'cors'
import { errorHandler } from './error/errorHandler.js'
import { connectDB } from './db/mongoClient.js'
// import authRouter from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT

await connectDB()
app.use(cors())
app.use(express.json())
app.use(errorHandler)

// app.use(authRouter)

app.use('/api/tasks', tasksRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
