import otpGenerator from 'otp-generator'
import otpSchema from '../model/otpModel.js'
import User from '../model/userModel.js'
import { createAndSendOTP } from '../services/otpService.js'

export default class OtpControllerFunctions {
  sendOTP = async (req, res, next) => {
    try {
      const { email } = req.body

      const userExists = await User.findOne({ email })

      if (!userExists) {
        const error = new Error('User not found')
        error.status = 404
        return next(error)
      }

      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })

      await createAndSendOTP(email, otp)

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp,
      })

    } catch (error) {
      error.status = 500
      next(error)
    }
  }

  verifyOTP = async (req, res, next) => {
    const { email, otp } = req.body

    if (!email || !otp) {
      const error = new Error('Email and OTP are required.')
      error.status = 400
      return next(error)
    }

    try {
      const userOTPEntry = await otpSchema.findOne({ email })

      if (!userOTPEntry || userOTPEntry.otps.length === 0) {
        const error = new Error('No OTP found for this email.')
        error.status = 404
        return next(error)
      }

      const latestOTP = userOTPEntry.otps[userOTPEntry.otps.length - 1]

      if (latestOTP.otp !== otp) {
        const error = new Error('Invalid OTP.')
        error.status = 401
        return next(error)
      }

      if (new Date() > new Date(latestOTP.expiryOTP)) {
        const error = new Error('OTP has expired.')
        error.status = 410
        return next(error)
      }

      const userExists = await User.findOne({ email })

      if (userExists) {
        userExists.verified = true

        await userExists.save()
      }

      return res.status(200).json({ success: true, message: 'OTP is valid.' })
      
    } catch (error) {
      error.status = 500
      next(error)
    }
  }
}
