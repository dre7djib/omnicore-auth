import { Router } from 'express';
import { authSessionController } from '../controllers/auth_sessions.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { asyncHandler } from '../middlewares/error-handler.middleware.js';
import { createAuthSessionSchema, updateAuthSessionSchema } from '../validators/auth_sessions.validator.js';

export const authSessionRouter = Router();

authSessionRouter.post('/', validateBody(createAuthSessionSchema), asyncHandler(authSessionController.create));
authSessionRouter.get('/', asyncHandler(authSessionController.list));
authSessionRouter.get('/:id', asyncHandler(authSessionController.getById));
authSessionRouter.get('/user/:userId', asyncHandler(authSessionController.getByUserId));
authSessionRouter.put('/:id', validateBody(updateAuthSessionSchema), asyncHandler(authSessionController.update));
authSessionRouter.delete('/:id', asyncHandler(authSessionController.remove));
