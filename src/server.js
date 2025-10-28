import config from './config/constants.js'
import express from 'express'
import tasksRouter from './routes/taskRoutes.js'
import cors from 'cors'
import { errorHandler } from './error/errorHandler.js'
import { connectDb } from './db/mongoClient.js'
import authRouter from './routes/authRoutes.js'
import loggerMiddleware from './middleware/loggerMiddleware.js'
import { verifyToken } from './middleware/verifyToken.js'

const app = express()
const PORT = config.PORT

await connectDb()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(loggerMiddleware)
app.use('/user/auth', authRouter)

app.use('/api/tasks', verifyToken, tasksRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
