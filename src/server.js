import 'dotenv/config'
import express from 'express'
import tasksRouter from './routes/taskRoutes.js'
import cors from 'cors'
import { errorHandler } from './error/errorHandler.js'
import { connectDB } from './db/mongoClient.js'
import authRouter from './routes/authRoutes.js'
import loggerMiddleware from './middleware/loggerMiddleware.js'
import protectedRoute from './routes/authProtectedRoute.js'

const app = express()
const PORT = process.env.PORT

await connectDB()
app.use(cors())
app.use(express.json())
app.use(errorHandler)

app.use(loggerMiddleware)
app.use('/auth', authRouter)
app.use('/protected', protectedRoute)

app.use('/api/tasks', tasksRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
