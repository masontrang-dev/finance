import Joi from 'joi';

/**
 * Validation schema for creating a payment
 */
export const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  paymentDate: Joi.date().required().messages({
    'date.base': 'Payment date must be a valid date',
    'any.required': 'Payment date is required',
  }),
  notes: Joi.string().allow('').max(500).messages({
    'string.max': 'Notes cannot exceed 500 characters',
  }),
});

/**
 * Middleware to validate payment creation
 */
export const validateCreatePayment = (req, res, next) => {
  const { error } = createPaymentSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
