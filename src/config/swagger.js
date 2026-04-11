import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Omnicore Auth Service API',
      version: '1.0.0',
      description: 'API d\'authentification pour Omnicore - Inscription, connexion, refresh token et validation JWT.',
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Serveur de développement',
      },
    ],
    components: {
      schemas: {
        SignupInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            countryId: { type: 'string', format: 'uuid', description: 'ID du pays (optionnel)' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        RefreshInput: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', description: 'Token de rafraîchissement' },
          },
        },
        LogoutInput: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string', description: 'Token de rafraîchissement' },
          },
        },
        ValidateInput: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Token JWT à valider (optionnel, peut être passé dans Authorization)' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'integer' },
            user: { type: 'object' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
