import jwt from 'jsonwebtoken'

export default class TokenGenerator {
  generateAccessToken(userId, secretKey) {
    return jwt.sign({ userId }, secretKey, {
      expiresIn: '1m',
    })
  }

  generateRefreshToken(userId, secretKey) {
    return jwt.sign({ userId }, secretKey, {
      expiresIn: '180d',
    })
  }
}
