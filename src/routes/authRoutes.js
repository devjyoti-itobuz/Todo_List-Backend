import { Router } from 'express'
import AuthenticationController from '../controller/authController.js'
import OtpControllerFunctions from '../controller/otpController.js'
import { validateUserSchema } from '../middleware/validator/userValidation.js'
import isVerified from '../middleware/verifiedCheck.js'
import { verifyToken } from '../middleware/verifyToken.js'

const authRouter = Router()

const authentication = new AuthenticationController()
const otpControl = new OtpControllerFunctions()

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`)
  next()
})

authRouter.post('/register', validateUserSchema, authentication.registerUser)
authRouter.post('/login', validateUserSchema, authentication.loginUser)

authRouter.post('/refresh-token', authentication.refreshAccessToken)

authRouter.post('/sendOTP', isVerified, otpControl.sendOTP)
authRouter.post('/verifyOTP', isVerified, otpControl.verifyOTP)

authRouter.post('/forgot-password/sendOTP', otpControl.sendOTP)
authRouter.post('/forgot-password/verifyOTP', otpControl.verifyOTP)
authRouter.post('/forgot-password/reset', authentication.setNewPasswordAfterOTP)

authRouter.post('/reset-password', verifyToken, authentication.resetPassword)

export default authRouter
