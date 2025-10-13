import OTP from '../model/otpModel.js'
import mailSender from '../utils/mailSender.js'

export async function createAndSendOTP(email, otpValue) {
  try {
    await mailSender(
      email,
      'Your OTP Code',
      `<h1>Verification Code</h1><p>Your OTP is: <strong>${otpValue}</strong></p>`
    )

    await OTP.findOneAndUpdate(
      { email },
      {
        $push: {
          otps: {
            otp: otpValue,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    )

    console.log(`OTP saved and email sent to ${email}`)
  } catch (error) {
    console.error('Failed to create/send OTP:', error)
    throw error
  }
}