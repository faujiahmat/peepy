import { type TodoType } from '@/type/todo';
import { type UserType } from '@/type/user';
import joi from 'joi';

export const registerUserValidation = (
  payload: UserType
): joi.ValidationResult<UserType> => {
  const schema = joi.object({
    id: joi.string().trim().allow(null, ''),
    email: joi.string().trim().required().email().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    name: joi.string().trim().required().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required',
    }),
    password: joi.string().min(8).max(15).required().messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password must be at most 15 characters',
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(payload);
};

export const updateUserValidation = (
  payload: Partial<UserType>
): joi.ValidationResult<Partial<UserType>> => {
  const schema = joi.object({
    id: joi.string().trim().allow(null, ''),
    email: joi.string().trim().email().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    name: joi.string().trim().messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required',
    }),
    password: joi.string().min(8).max(15).messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password must be at most 15 characters',
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(payload);
};

export const loginUserValidation = (
  payload: UserType
): joi.ValidationResult<UserType> => {
  const schema = joi.object({
    email: joi.string().trim().required().email().messages({
      'string.base': 'Email must be a string',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: joi.string().required().messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(payload);
};

export const createTodoValidation = (
  payload: TodoType
): joi.ValidationResult<TodoType> => {
  const schema = joi.object({
    title: joi.string().required().messages({
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required',
    }),
    description: joi.string().allow(null, '').optional(),
    status: joi
      .string()
      .valid('PENDING', 'COMPLETED')
      .default('PENDING')
      .messages({
        'any.only': 'Status must be either PENDING or COMPLETED',
      }),
  });
  return schema.validate(payload);
};
