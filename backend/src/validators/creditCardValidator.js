import Joi from 'joi';

/**
 * Validation schema for creating a credit card
 */
export const createCreditCardSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Card name is required',
    'string.max': 'Card name must not exceed 100 characters',
    'any.required': 'Card name is required',
  }),
  currentBalance: Joi.number().min(0).required().messages({
    'number.base': 'Current balance must be a number',
    'number.min': 'Current balance cannot be negative',
    'any.required': 'Current balance is required',
  }),
  totalBalance: Joi.number().min(0).required().messages({
    'number.base': 'Total balance must be a number',
    'number.min': 'Total balance cannot be negative',
    'any.required': 'Total balance is required',
  }),
  dueDate: Joi.date().iso().required().messages({
    'date.base': 'Due date must be a valid date',
    'date.format': 'Due date must be in ISO format',
    'any.required': 'Due date is required',
  }),
}).custom((value, helpers) => {
  // Validate that totalBalance >= currentBalance
  if (value.totalBalance < value.currentBalance) {
    return helpers.message('Total balance must be greater than or equal to current balance');
  }
  return value;
});

/**
 * Validation schema for updating a credit card
 */
export const updateCreditCardSchema = Joi.object({
  name: Joi.string().min(1).max(100).messages({
    'string.empty': 'Card name cannot be empty',
    'string.max': 'Card name must not exceed 100 characters',
  }),
  currentBalance: Joi.number().min(0).messages({
    'number.base': 'Current balance must be a number',
    'number.min': 'Current balance cannot be negative',
  }),
  totalBalance: Joi.number().min(0).messages({
    'number.base': 'Total balance must be a number',
    'number.min': 'Total balance cannot be negative',
  }),
  dueDate: Joi.date().iso().messages({
    'date.base': 'Due date must be a valid date',
    'date.format': 'Due date must be in ISO format',
  }),
})
  .min(1)
  .custom((value, helpers) => {
    // Validate that totalBalance >= currentBalance if both are provided
    if (
      value.totalBalance !== undefined &&
      value.currentBalance !== undefined &&
      value.totalBalance < value.currentBalance
    ) {
      return helpers.message('Total balance must be greater than or equal to current balance');
    }
    return value;
  });

/**
 * Middleware to validate request body against a schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.validatedData = value;
    next();
  };
};
