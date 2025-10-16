import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
// import { getUserById } from '../utils/utilFn.js'

dotenv.config()

export const verifyToken = async (req, res, next) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY
    const authHeader = req.header('Authorization')
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      })
    }

    try {
      const decoded = await jwt.verify(accessToken, secretKey)

      console.log('Decoded JWT:', decoded)
      req.user = decoded
      
      return next()

    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'jwt expired',
        })
      }

      return res.status(401).json({
        message: 'Invalid access token',
      })
    }
    
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error. ${error}`,
    })
  }
}