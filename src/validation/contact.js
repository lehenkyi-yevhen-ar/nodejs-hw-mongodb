import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .min(10)
    .max(13)
    .required()
    .messages({ 'string.min': 'Number should be at least 10-digits long' }),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal').required()
});

export const replaceContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().pattern(
    /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
  ),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal')
});
