import Joi from 'joi';

const createExerciseSchema = Joi.object({
  description: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Description is required',
    }),
  duration: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'Duration must be a number',
      'number.positive': 'Duration must be greater than zero'
    }),

  date: Joi.date()
    .max('now')
    .iso()
    .optional()
    .messages({
      'date.format': 'Date must be a valid ISO date string (YYYY-MM-DD)',
      'date.max': 'Date cannot be in the future'
    })
});

export { createExerciseSchema };