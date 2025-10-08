export const validateRequest = async (schema, data, next) => {
  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false, // return all validation errors
      stripUnknown: true, // remove unexpected fields
    })
    return validatedData
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400
    }
    next(err)
  }
}