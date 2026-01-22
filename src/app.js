import express from 'express';
import cors from 'cors';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import { authUserRouter } from './routes/auth_users.route.js';
import { authSessionRouter } from './routes/auth_sessions.route.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(requestLoggerMiddleware);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Routes
  app.use('/api/auth-users', authUserRouter);
  app.use('/api/auth-sessions', authSessionRouter);

  app.use(errorHandlerMiddleware);

  return app;
};
