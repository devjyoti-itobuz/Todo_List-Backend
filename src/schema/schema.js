import * as yup from 'yup'
// import { v4 as uuidv4 } from 'uuid'
import { getISTLocalizedTime } from '../utils/utils.js'

export const taskCreateSchema = yup.object({
  // id: yup.string().default(() => uuidv4()),
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .required('Title is required'),
  tags: yup.array().of(yup.string()).default([]),
  isImportant: yup.string().default(''),
  isCompleted: yup.boolean().default(false),
  createdAt: yup.string().default(() => getISTLocalizedTime()),
  updatedAt: yup.string().default(() => getISTLocalizedTime()),
})

export const taskUpdateSchema = yup.object({
  title: yup.string().trim().min(3),
  tags: yup.array().of(yup.string()),
  isImportant: yup.string(),
  isCompleted: yup.boolean(),
})
