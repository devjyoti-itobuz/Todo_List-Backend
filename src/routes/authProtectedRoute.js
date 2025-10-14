import Router from 'express'
import {verifyToken} from '../middleware/verifyToken.js'
// import loggerMiddleware from '../middleware/loggerMiddleware.js'
import AuthController from '../controller/authController.js'
const protectedRoute = new Router()
const authController = new AuthController()

protectedRoute.get('/', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' })
  // next()
})
protectedRoute.post('/refresh-token', authController.refreshAccessToken)

export default protectedRoute
