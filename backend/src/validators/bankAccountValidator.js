import Joi from 'joi';

/**
 * Validation schema for creating a bank account
 */
export const createBankAccountSchema = Joi.object({
  name: Joi.string().required().min(1).max(100).messages({
    'string.empty': 'Bank account name is required',
    'string.min': 'Bank account name must be at least 1 character',
    'string.max': 'Bank account name must not exceed 100 characters',
    'any.required': 'Bank account name is required',
  }),
  currentBalance: Joi.number().required().min(0).messages({
    'number.base': 'Current balance must be a number',
    'number.min': 'Current balance cannot be negative',
    'any.required': 'Current balance is required',
  }),
});

/**
 * Validation schema for updating a bank account
 */
export const updateBankAccountSchema = Joi.object({
  name: Joi.string().min(1).max(100).messages({
    'string.empty': 'Bank account name cannot be empty',
    'string.min': 'Bank account name must be at least 1 character',
    'string.max': 'Bank account name must not exceed 100 characters',
  }),
  currentBalance: Joi.number().min(0).messages({
    'number.base': 'Current balance must be a number',
    'number.min': 'Current balance cannot be negative',
  }),
}).min(1);

/**
 * Middleware to validate request body against a schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};
