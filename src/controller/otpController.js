import otpGenerator from 'otp-generator'
// import OTP from '../model/otpModel.js'
import User from '../model/userModel.js'
import { createAndSendOTP } from '../services/otpService.js'

export const sendOTPToEmail = async (email) => {
  const userExists = await User.findOne({ email })

  if (userExists && userExists.verified) {
    throw new Error('User is already registered and verified')
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  })

  await createAndSendOTP(email, otp)

  return otp
}