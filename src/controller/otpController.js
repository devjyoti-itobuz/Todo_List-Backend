import otpGenerator from 'otp-generator'
import OTP from '../model/otpModel.js'
import User from '../model/userModel.js'
import { createAndSendOTP } from '../services/otpService.js'

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    const userExists = await User.findOne({ email })
    if (userExists.verified) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered and verified',
      })
    } else {
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
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: error.message })
  }
}

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and OTP are required.' })
  }

  try {
    const userOTPEntry = await OTP.findOne({ email })

    if (!userOTPEntry || userOTPEntry.otps.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No OTP found for this email.' })
    }

    const latestOTP = userOTPEntry.otps[userOTPEntry.otps.length - 1]

    if (latestOTP.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP.' })
    }

    if (new Date() > new Date(latestOTP.expiryOTP)) {
      return res
        .status(410)
        .json({ success: false, message: 'OTP has expired.' })
    }

    return res.status(200).json({ success: true, message: 'OTP is valid.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred during OTP verification.',
    })
  }
}