import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../model/userModel.js'

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
      next(error)
    }
  }

  loginUser = async (req, res, next) => {
    try {
      const secretKey = process.env.JWT_SECRET_KEY
      const { email, password } = req.body
      //console.log(req.body);
      const user = await User.findOne({ email })

      if (!user) {
        res.status(404)
        throw new Error('User not found! ❌')
      }

      const passwordMatched = await bcrypt.compare(password, user.password)

      if (!passwordMatched) {
        res.status(401)
        throw new Error('Authentication failed, password not matched')
      }

      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: '1h',
      })
    //   delete user._doc.password

      res.status(200).json({ token, user })
    } catch (error) {
      next(error)
    }
  }
}
