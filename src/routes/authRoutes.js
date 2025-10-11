import { Router } from 'express'
import AuthenticationController from '../controller/authController.js'

const authRouter = Router()

const authentication = new AuthenticationController()

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

authRouter.post('/register', authentication.registerUser)
authRouter.post('/login', authentication.loginUser)
// authRouter.post('/refresh-token', authentication.refreshToken)
authRouter.post('/logout', authentication.logoutUser)

export default authRouter
