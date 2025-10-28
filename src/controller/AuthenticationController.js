import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config/constants.js'
import User from '../model/userModel.js'
import { validateOtp } from '../services/otpService.js'
import TokenGenerator from '../services/TokenGenerator.js'
import { generateOtp } from '../services/otpService.js'
import { createAndSendOtp } from '../services/otpService.js'

const tokenGenerator = new TokenGenerator()

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

      res.status(201).json({
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
      const { email, password } = req.body
      const user = await User.findOne({ email })

      if (!user) {
        const error = new Error('User not found! Sign up.')
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

      const accessToken = tokenGenerator.generateToken(
        { userId: user._id },
        config.JWT_SECRET_KEY,
        { expiresIn: config.ACCESS_TOKEN_TIME }
      )

      const refreshToken = tokenGenerator.generateToken(
        { userId: user._id },
        config.JWT_REFRESH_SECRET_KEY,
        { expiresIn: config.REFRESH_TOKEN_TIME }
      )

      res.status(200).json({
        accessToken,
        refreshToken,
        user,
        message: 'User login successfully.',
      })
    } catch (error) {
      next(error)
    }
  }

  sendOtp = async (req, res, next) => {
    try {
      const { email } = req.body

      const userExists = await User.findOne({ email })

      if (!userExists) {
        const error = new Error('User not found')
        error.status = 404
        return next(error)
      }

      const otp = generateOtp()

      await createAndSendOtp(email, otp)

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        // otp,
      })
    } catch (error) {
      // error.status = 500
      next(error)
    }
  }

  verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body

    if (!email || !otp) {
      const error = new Error('Email and OTP are required.')
      error.status = 400
      return next(error)
    }

    try {
      await validateOtp(email, otp)

      const userExists = await User.findOne({ email })

      if (userExists) {
        userExists.verified = true

        await userExists.save()
      }

      return res
        .status(200)
        .json({ success: true, message: 'OTP is valid. Log in now.' })
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
      // console.log(refreshToken)
      const refreshPayload = jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET_KEY
      )

      // console.log(refreshPayload)

      const newAccessToken = tokenGenerator.generateToken(
        { userId: refreshPayload.userId },
        config.JWT_SECRET_KEY,
        { expiresIn: config.ACCESS_TOKEN_TIME }
      )

      const newRefreshToken = tokenGenerator.generateToken(
        { userId: refreshPayload.userId },
        config.JWT_REFRESH_SECRET_KEY,
        { expiresIn: config.ACCESS_TOKEN_TIME }
      )

      // console.log(newAccessToken, newRefreshToken)

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

  async getUser(req, res) {
    const userId = req.user.userId
    const details = await User.find({ _id: userId }).select(
      'name email profileImage'
    )
    console.log(userId)

    res.json({ success: true, details })
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.user.userId
      const { name, profileImage } = req.body

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, profileImage },
        { new: true }
      ).select('name email profileImage')

      if (!updatedUser) {
        const error = new Error('User not found')
        error.status = 404
        return next(error)
      }

      res.json({ success: true, user: updatedUser })
    } catch (err) {
      next(err)
    }
  }
}
