import * as yup from 'yup'

export const userValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),

  password: yup
    .string()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),

  verified: yup.boolean().default(false),
})

export const passwordValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(4, 'Password must be at least 4 characters')
})