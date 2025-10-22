import { Router } from 'express'
import AuthenticationController from '../controller/authController.js'
import OtpControllerFunctions from '../controller/otpController.js'
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

authRouter.post('/sendOTP', verifiedUser, otpControl.sendOtp)
authRouter.post('/verifyOTP', verifiedUser, otpControl.verifyOtp)

authRouter.post('/forgot-password/sendOTP', otpControl.sendOtp)
// authRouter.post('/forgot-password/verifyOTP', otpControl.verifyOtp)
authRouter.post('/forgot-password/reset', authentication.setNewPasswordAfterOtp)

authRouter.post('/reset-password', verifyToken, authentication.resetPassword)

export default authRouter
