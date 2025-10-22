import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../model/userModel.js'
// import otpSchema from '../model/otpModel.js'
import { validateOtp } from '../services/otpService.js'
import TokenGenerator from '../services/tokenGenerator.js'

const tokenGenerator = new TokenGenerator()

dotenv.config()

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const existingUser = await User.findOne({ email })

      if (existingUser) {
        const error = new Error('User already exists')
        error.status = 409
        return next(error)
      }

      const hashedPass = await bcrypt.hash(password, 10)
      //   console.log(username, password, hashedPass)
      const user = new User({ email, password: hashedPass })

      await user.save()

      res
        .status(201)
        .json({
          success: true,
          user,
          message: 'User registered successfully.',
        })

    } catch (error) {
      // error.status = error.status || 400
      next(error)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY
      const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY
      const { email, password } = req.body
      const user = await User.findOne({ email })

       if (!user) {
         const error = new Error('User not found!')
         error.status = 404
         return next(error)
       }

       const passwordMatched = await bcrypt.compare(password, user.password)

       if (!passwordMatched) {
         const error = new Error('Password not matched.')
         error.status = 401
         return next(error)
       }

       if (!user.verified) {
         const error = new Error('Email not verified')
         error.status = 403
         return next(error)
       }

      const accessToken = tokenGenerator.generateAccessToken(
        { userId: user._id },
        secretKey
      )

      const refreshToken = tokenGenerator.generateRefreshToken(
        { userId: user._id },
        refreshSecretKey
      )

      res
        .status(200)
        .json({
          accessToken,
          refreshToken,
          user,
          message: 'User login successfully.',
        })

    } catch (error) {
      next(error)
    }
  }

  setNewPasswordAfterOtp = async (req, res, next) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      const error = new Error('Email and new password are required.')
      error.status = 400
      return next(error)
    }

    try {
      // const userOtpEntry = await otpSchema.findOne({ email })

      // if (!userOtpEntry || userOtpEntry.otps.length === 0) {
      //   const error = new Error('No OTP found for this email.')
      //   error.status = 404
      //   return next(error)
      // }

      // const latestOtp = userOtpEntry.otps[userOtpEntry.otps.length - 1]

      // if (latestOtp.otp !== otp) {
      //   const error = new Error('Invalid OTP.')
      //   error.status = 401
      //   return next(error)
      // }

      // if (new Date() > new Date(latestOtp.expiryOtp)) {
      //   const error = new Error('OTP has expired.')
      //   error.status = 410
      //   return next(error)
      // }

      await validateOtp(email, otp)

      const user = await User.findOne({ email })

      if (!user) {
        const error = new Error('User not found.')
        error.status = 404
        return next(error)
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword

      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      })

    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req, res, next) => {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body
    console.log(userId)

    if (!currentPassword || !newPassword) {
      const error = new Error('Current password and new password are required.')
      error.status = 400
      return next(error)
    }

    try {
      const user = await User.findById(userId)

      if (!user) {
        const error = new Error('User not found.')
        error.status = 404
        return next(error)
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)

      if (!isMatch) {
        const error = new Error('Current password is incorrect.')
        error.status = 401
        return next(error)
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully.',
      })
      
    } catch (error) {
      // error.status=400
      next(error)
    }
  }

  refreshAccessToken = (req, res, next) => {
    const refreshToken = req.headers['refresh_token']

    if (!refreshToken) {
      const error = new Error('Refresh Token is required')
      error.status = 401
      return next(error)
    }

    try {
      console.log(refreshToken)
      const refreshPayload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY
      )

      console.log(refreshPayload)

      const newAccessToken = tokenGenerator.generateAccessToken(
        { userId: refreshPayload.userId },
        process.env.JWT_SECRET_KEY
      )

      const newRefreshToken = tokenGenerator.generateRefreshToken(
        { userId: refreshPayload.userId},
        process.env.JWT_REFRESH_SECRET_KEY
      )

      console.log(newAccessToken, newRefreshToken)

      return res.status(200).json({
        message: 'New Access and Refresh Tokens generated successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })

    } catch (error) {
      // error.status = 401
      next(error)
    }
  }
}
