import mongoose from 'mongoose'

const otpSubSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    //   expires: 60 * 5,
    },
  },
  { _id: false }
)

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  otps: [otpSubSchema],
})

const OTP = mongoose.model('OTP', otpSchema)

export default OTP
