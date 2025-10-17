import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../model/userModel.js'
import TokenGenerator from '../services/tokenGenerator.js'

const tokenGenerator = new TokenGenerator()

dotenv.config()

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const hashedPass = await bcrypt.hash(password, 10)
      //   console.log(username, password, hashedPass)
      const user = new User({ email, password: hashedPass })

      await user.save()

      res.status(201).json({ success: true, user })

    } catch (error) {
      error.status = 404
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
         return res.status(404).json({ message: 'User not found!' })
       }

       const passwordMatched = await bcrypt.compare(password, user.password)

       if (!passwordMatched) {
         return res
           .status(401)
           .json({ message: 'Authentication failed, password not matched' })
       }

       if (!user.verified) {
         return res.status(403).json({ message: 'Email not verified' })
       }

      const accessToken = tokenGenerator.generateAccessToken(
        { userId: user._id },
        secretKey
      )

      const refreshToken = tokenGenerator.generateRefreshToken(
        { userId: user._id },
        refreshSecretKey
      )

      res.status(200).json({ accessToken, refreshToken, user })

    } catch (error) {
      next(error)
    }
  }

  setNewPasswordAfterOTP = async (req, res, next) => {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required.',
      })
    }

    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' })
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
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      })
    }

    try {
      const user = await User.findById(userId)

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Current password is incorrect.' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
      
      await user.save()

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully.',
      })
      
    } catch (error) {
      error.status=400
      next(error)
    }
  }

  refreshAccessToken = (req, res, next) => {
    const refreshToken = req.headers['refresh-token']

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh Token is required' })
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
      next(error)
    }
  }
}
