import Joi from 'joi';

const uuidSchema = Joi.string().guid({
  version: ['uuidv1', 'uuidv2', 'uuidv3', 'uuidv4', 'uuidv5'],
});

const emailSchema = Joi.string().email().trim().lowercase().max(255);

export const createAuthUserSchema = Joi.object({
  email: emailSchema.required(),
  password_hash: Joi.string().required().min(1),
  country_id: uuidSchema.allow(null),
  is_active: Joi.boolean(),
  email_verified: Joi.boolean(),
});

export const updateAuthUserSchema = Joi.object({
  email: emailSchema,
  password_hash: Joi.string().min(1),
  country_id: uuidSchema.allow(null),
  is_active: Joi.boolean(),
  email_verified: Joi.boolean(),
  last_login_at: Joi.date().iso().allow(null),
}).min(1);
