import 'dotenv/config'
import express from 'express'
const app = express()
const port = process.env.PORT

const sc = {
  success: true,
  message: 'Server is up and running',
}

app.get('/', (req, res) => {
  res.send(sc)
})

app.listen(port, () => {
  console.log(`${sc.message} at ${port}`)
})
