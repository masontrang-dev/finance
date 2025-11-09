import Joi from 'joi';

// Validation schema for creating a deposit
const createDepositSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  depositDate: Joi.date().required().messages({
    'date.base': 'Deposit date must be a valid date',
    'any.required': 'Deposit date is required',
  }),
  description: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
});

// Validation schema for updating a deposit
const updateDepositSchema = Joi.object({
  amount: Joi.number().positive().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
  }),
  depositDate: Joi.date().messages({
    'date.base': 'Deposit date must be a valid date',
  }),
  description: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
}).min(1);

// Validation middleware
export const validateCreateDeposit = (req, res, next) => {
  const { error } = createDepositSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors });
  }
  next();
};

export const validateUpdateDeposit = (req, res, next) => {
  const { error } = updateDepositSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors });
  }
  next();
};
