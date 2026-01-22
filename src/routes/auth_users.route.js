import { Router } from 'express';
import { authUserController } from '../controllers/auth_users.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { asyncHandler } from '../middlewares/error-handler.middleware.js';
import { createAuthUserSchema, updateAuthUserSchema } from '../validators/auth_users.validator.js';

export const authUserRouter = Router();

authUserRouter.post('/', validateBody(createAuthUserSchema), asyncHandler(authUserController.create));
authUserRouter.get('/', asyncHandler(authUserController.list));
authUserRouter.get('/:id', asyncHandler(authUserController.getById));
authUserRouter.put('/:id', validateBody(updateAuthUserSchema), asyncHandler(authUserController.update));
authUserRouter.delete('/:id', asyncHandler(authUserController.remove));
