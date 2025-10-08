import { taskCreateSchema, taskUpdateSchema } from '../schema/schema.js'

const validateRequest = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false, // return all validation errors
      stripUnknown: true, // remove unexpected fields
    })
    next()
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400
    }
    next(err)
  }
}

export const validateCreateTodo = validateRequest(taskCreateSchema)
export const validateUpdateTodo = validateRequest(taskUpdateSchema)
