import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.route.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(requestLoggerMiddleware);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter);

  app.use(errorHandlerMiddleware);

  return app;
};

