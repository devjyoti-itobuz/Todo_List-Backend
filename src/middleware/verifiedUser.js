import User from '../model/userModel.js'

export default async function verifiedUser(req, res, next) {
  try {
    const { email } = req.body
    const userExists = await User.findOne({ email })
    
    if (!userExists) {
      throw { status: 404, message: 'User not found' }
    }

    if (userExists.verified) {
      throw { status: 401, message: 'User is already registered and verified' }
    }

    next()
    
  } catch (error) {
    next(error)
  }
}
