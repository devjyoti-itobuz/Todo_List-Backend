import { Router } from 'express'
import AuthenticationController from '../controller/AuthenticationController.js'
import OtpControllerFunctions from '../controller/OtpController.js'
import { validateUserSchema } from '../middleware/validator/userValidation.js'
import verifiedUser from '../middleware/verifiedUser.js'
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

authRouter.post('/send-otp', verifiedUser, otpControl.sendOtp)
authRouter.post('/verify-otp', verifiedUser, otpControl.verifyOtp)

authRouter.post('/forgot-password/send-otp', otpControl.sendOtp)
// authRouter.post('/forgot-password/verify-otp', otpControl.verifyOtp)
authRouter.post('/forgot-password/reset', authentication.setNewPasswordAfterOtp)

authRouter.post('/reset-password', verifyToken, authentication.resetPassword)

export default authRouter
