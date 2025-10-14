import { Router } from 'express'
import AuthenticationController from '../controller/authController.js'
import { validateUserSchema } from '../middleware/userValidation.js'
import { sendOTP, verifyOTP } from '../controller/otpController.js'
import isVerified from '../middleware/verifiedCheck.js'

const authRouter = Router()

const authentication = new AuthenticationController()

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

authRouter.post('/register', validateUserSchema, authentication.registerUser)
authRouter.post('/login', validateUserSchema, authentication.loginUser)
// authRouter.post('/refresh-token', authentication.refreshToken)
authRouter.post('/logout', authentication.logoutUser)
authRouter.post('/sendOTP',isVerified, sendOTP)
authRouter.post('/verifyOTP',isVerified, verifyOTP)

authRouter.post('/forgot-password/sendOTP', sendOTP)
authRouter.post('/forgot-password/verifyOTP', verifyOTP)
authRouter.post('/forgot-password/reset', authentication.setNewPasswordAfterOTP)

authRouter.post('/reset-password', authentication.resetPassword)

export default authRouter
