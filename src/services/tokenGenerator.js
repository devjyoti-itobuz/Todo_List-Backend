import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default class TokenGenerator {
  
  generateAccessToken(userId, secretKey) {
    return jwt.sign(userId, secretKey, {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    })
  }

  generateRefreshToken(userId, secretKey) {
    return jwt.sign(userId, secretKey, {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    })
  }
}
