import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import TokenGenerator from '../services/tokenGenerator.js'

const tokenGenerator = new TokenGenerator()

dotenv.config()

export const authenticateToken = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET_KEY
  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1]

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(accessToken, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

export const verifyToken = async (req, res, next) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY
    const authHeader = req.header('Authorization')
    const accessToken = authHeader && authHeader.split(' ')[1]
    const refreshToken = authHeader && authHeader.split(' ')[2]

    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      })
    }

    try {
      const decoded = jwt.verify(accessToken, secretKey)
      req.user = decoded
      return next()
    } catch (error) {
      if (error.name === 'TokenExpiredError' && refreshToken) {
        try {
          const refreshPayload = jwt.verify(refreshToken, refreshSecretKey)

          const newAccessToken = tokenGenerator.generateAccessToken(
            { userId: refreshPayload.userId },
            secretKey
          )
          console.log(newAccessToken)
          // res.setHeader('x-access-token', req.newAccessToken)

          req.user = refreshPayload
          // req.newAccessToken = newAccessToken
          // res.status(200).json({ accessToken: newAccessToken })
          return next()
        } catch (error) {
          return res.status(401).json({
            message: `Session expired. Please login again, ${error}`,
            // code: 'REFRESH_TOKEN_EXPIRED',
          })
        }
      }

      return res.status(403).json({
        message: 'Invalid access token',
      })
    }
  } catch (error) {
    next(error)
  }
}
