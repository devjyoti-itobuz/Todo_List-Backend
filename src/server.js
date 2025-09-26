import 'dotenv/config'
import express from 'express';
import tasksRouter from './routes/routes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json())

app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});