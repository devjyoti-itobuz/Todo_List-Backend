import User from '../model/userModel.js'

export default async function isVerified(req, res, next) {
  try {
    const { email } = req.body
    const userExists = await User.findOne({ email })
    
    if (userExists.verified) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered and verified',
      })

    }
    next()
  } catch (error) {
    next(error)
  }
}
