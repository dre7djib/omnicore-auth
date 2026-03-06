import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { authRouter } from './routes/auth.route.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(requestLoggerMiddleware);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @swagger
   * /health:
   *   get:
   *     tags: [Health]
   *     summary: Vérification de l'état du service
   *     responses:
   *       200:
   *         description: Service opérationnel
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   */
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter);

  app.use(errorHandlerMiddleware);

  return app;
};

