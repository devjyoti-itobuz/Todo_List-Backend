import OTP from '../model/otpModel.js'
import mailSender from '../utils/mailSender.js'
import otpSchema from '../model/otpModel.js'

export async function validateOtp(email, otp) {
  const userOtpEntry = await otpSchema.findOne({ email })

  if (!userOtpEntry || userOtpEntry.otps.length === 0) {
    const error = new Error('No OTP found for this email.')
    error.status = 404
    throw error
  }

  const latestOtp = userOtpEntry.otps[userOtpEntry.otps.length - 1]

  if (latestOtp.otp !== otp) {
    const error = new Error('Invalid OTP.')
    error.status = 401
    throw error
  }

  if (new Date() > new Date(latestOtp.expiryOtp)) {
    const error = new Error('OTP has expired.')
    error.status = 403
    throw error
  }

  return true
}

export async function createAndSendOtp(email, otpValue) {
  try {

    await mailSender(
      email,
      'Your OTP Code',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4CAF50;">🔐 One-Time Password (OTP)</h2>
          <p>Hello,</p>
          <p>Use the following One-Time Password (OTP) to complete your verification. This code is valid for the next 5 minutes:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f2f2f2; padding: 10px; text-align: center; border-radius: 5px; margin: 20px 0;">
            ${otpValue}
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <p style="color: #555;">Thanks,<br/>From Todo</p>
        </div>
        `
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
