import * as yup from 'yup'

export const taskCreateSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .required('Title is required'),
  tags: yup.array().of(yup.string()).default([]),
  isImportant: yup.string().default(''),
  isCompleted: yup.boolean().default(false),
})

export const taskUpdateSchema = yup.object({
  title: yup.string().trim().min(3),
  tags: yup.array().of(yup.string()),
  isImportant: yup.string(),
  isCompleted: yup.boolean(),
})
