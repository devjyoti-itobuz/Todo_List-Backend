// import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../model/userModel.js'
import TokenGenerator from '../services/tokenGenerator.js'
import { sendOTPToEmail } from './otpController.js'

const tokenGenerator = new TokenGenerator()

dotenv.config()

const refreshTokens = []

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const hashedPass = await bcrypt.hash(password, 10)
      //   console.log(username, password, hashedPass)

      const user = new User({ email, password: hashedPass })
      await user.save()

      const otp = await sendOTPToEmail(email)

      res.status(201).json({
        success: true,
        message: 'User registered. OTP sent to email.',
        user,
        otp,
      })
    } catch (error) {
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
        res.status(404)
        throw new Error('User not found!')
      }

      const passwordMatched = await bcrypt.compare(password, user.password)

      if (!passwordMatched) {
        res.status(401)
        throw new Error('Authentication failed, password not matched')
      }

      const accessToken = tokenGenerator.generateAccessToken(
        { userId: user._id },
        secretKey
      )

      const refreshToken = tokenGenerator.generateRefreshToken(
        { userId: user._id },
        refreshSecretKey
      )

      refreshTokens.push(refreshToken)
      await user.save()

      res.status(200).json({ accessToken, refreshToken, user })
    } catch (error) {
      next(error)
    }
  }

  //   refreshToken = async (req, res, next) => {
  //     try {
  //       const { refreshToken } = req.body
  //       const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY

  //       if (!refreshToken) {
  //         res.status(401)
  //         throw new Error('Refresh token is required')
  //       }

  //       const payload = jwt.verify(refreshToken, refreshSecretKey)

  //       const user = await User.findById(payload.userId)

  //       if (!user || user.refreshToken !== refreshToken) {
  //         res.status(403)
  //         throw new Error('Invalid refresh token')
  //       }

  //       const accessToken = jwt.sign(
  //         { userId: user._id },
  //         process.env.JWT_SECRET_KEY,
  //         {
  //           expiresIn: '1h',
  //         }
  //       )

  //       res.status(200).json({ accessToken })
  //     } catch (error) {
  //       next(error)
  //     }
  //   }

  logoutUser = async (req, res, next) => {
    try {
      const { userId } = req.body

      const user = await User.findById(userId)

      if (!user) {
        res.status(404)
        throw new Error('User not found')
      }

      // Delete the user from the database
      await user.deleteOne()

      res
        .status(200)
        .json({ message: 'User logged out and deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}
