import jwt from 'jsonwebtoken'
import config from '../config/constants.js'

export const verifyToken = async (req, res, next) => {
  try {
    const secretKey = config.JWT_SECRET_KEY
    const authHeader = req.header('Authorization')
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) {
      throw { status: 401, message: 'Access denied. No token provided.' }
    }

    try {
      const decoded = jwt.verify(accessToken, secretKey)

      console.log('Decoded JWT:', decoded)
      req.user = decoded
      
      return next()

    } catch (error) {

      if (error.name === 'TokenExpiredError') {
        throw { status: 401, message: 'jwt expired' }
      }

      throw { status: 401, message: 'Invalid access token' }
    }
    
  } catch (error) {
    next(error)
  }
}