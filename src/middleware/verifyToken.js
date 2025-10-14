import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// export const authenticateToken = (req, res, next) => {
//   const secretKey = process.env.JWT_SECRET_KEY
//   const authHeader = req.headers['authorization']
//   const accessToken = authHeader && authHeader.split(' ')[1]

//   if (!accessToken) {
//     return res.status(401).json({ message: 'Access token required' })
//   }

//   jwt.verify(accessToken, secretKey, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' })
//     }
//     req.user = user
//     next()
//   })
// }

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
      console.log(decoded)
      req.user = decoded
      return next()
    } catch (error) {
      return res.status(403).json({
        message: `Invalid or expired access token. ${error}`,
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error. ${error}`,
    })
  }
}