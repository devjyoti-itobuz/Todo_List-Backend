import 'dotenv/config'
import express from 'express';
import tasksRouter from './routes/routes.js';
import cors from 'cors';
import { errorHandler } from './error/errorHandler.js';
import { connectDB } from './db/mongoClient.js'

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json())
app.use(errorHandler)

app.use('/api/tasks', tasksRouter);

await connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});