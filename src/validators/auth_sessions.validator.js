import Joi from 'joi';

const uuidSchema = Joi.string().guid({
  version: ['uuidv1', 'uuidv2', 'uuidv3', 'uuidv4', 'uuidv5'],
});

export const createAuthSessionSchema = Joi.object({
  user_id: uuidSchema.required(),
  refresh_token: Joi.string().required().min(1),
  expires_at: Joi.date().iso().required(),
  ip_address: Joi.string().trim().max(45).empty('').allow(null),
  user_agent: Joi.string().trim().empty('').allow(null),
});

export const updateAuthSessionSchema = Joi.object({
  refresh_token: Joi.string().min(1),
  expires_at: Joi.date().iso().allow(null),
  ip_address: Joi.string().trim().max(45).empty('').allow(null),
  user_agent: Joi.string().trim().empty('').allow(null),
}).min(1);
