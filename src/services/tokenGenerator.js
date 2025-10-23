import jwt from 'jsonwebtoken'

export default class TokenGenerator {
  generateToken(userId, secretKey, expiresIn) {
    return jwt.sign(userId, secretKey, expiresIn)
  }
}
