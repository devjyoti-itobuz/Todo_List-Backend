import Router from 'express'
import {verifyToken} from '../middleware/verifyToken.js'
const protectedRoute = new Router()

protectedRoute.get('/', verifyToken, (req, res, next) => {
  
  res.status(200).json({ message: 'Protected route accessed' })

  next()
})

export default protectedRoute
