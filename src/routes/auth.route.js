import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { asyncHandler } from '../middlewares/error-handler.middleware.js';
import {
  loginSchema,
  signupSchema,
  refreshSchema,
  logoutSchema,
  validateSchema,
} from '../validators/auth.validator.js';

export const authRouter = Router();

authRouter.post('/signup', validateBody(signupSchema), asyncHandler(authController.signup));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(authController.login));
authRouter.post('/refresh', validateBody(refreshSchema), asyncHandler(authController.refresh));
authRouter.post('/logout', validateBody(logoutSchema), asyncHandler(authController.logout));
authRouter.post('/validate', validateBody(validateSchema), asyncHandler(authController.validate));

