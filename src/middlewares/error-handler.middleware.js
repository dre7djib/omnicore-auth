import { logger } from '../utils/logger.js';

/**
 * Wrapper pour les handlers async qui capture automatiquement les erreurs
 * et les passe au middleware d'erreur via next()
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

const handlePrismaError = (error) => {
  if (error.code === 'P2002') {
    const target = error.meta?.target || [];
    const field = target[0] || 'field';
    return {
      status: 409,
      message: `${field} already exists`,
    };
  }

  if (error.code === 'P2025') {
    return {
      status: 404,
      message: error.meta?.cause || 'Record not found',
    };
  }

  if (error.code === 'P2003') {
    return {
      status: 400,
      message: 'Invalid reference: related record does not exist',
    };
  }

  if (error.code === 'P2009') {
    return {
      status: 400,
      message: 'Validation error',
    };
  }

  return {
    status: 500,
    message: 'Database error',
  };
};

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = err.status || 500;
  let message = err.message || 'Unexpected error';
  let details = null;

  if (err.code && err.code.startsWith('P')) {
    const prismaError = handlePrismaError(err);
    status = prismaError.status;
    message = prismaError.message;
  }

  if (err.isJoi) {
    status = 400;
    message = 'Validation error';
    details = err.details?.map((detail) => ({
      message: detail.message,
      path: detail.path.join('.'),
    }));
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    status = 400;
    message = 'Invalid JSON format';
  }

  // Log de l'erreur avec le format ECS
  logger.error('Request failed', {
    error: {
      message: err.message || message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      code: err.code,
      name: err.name,
    },
    trace: {
      id: req.requestId,
    },
    http: {
      request: {
        method: req.method,
        path: req.path,
        headers: {
          'user-agent': req.get('user-agent'),
        },
      },
      response: {
        status_code: status,
      },
    },
  });

  const response = {
    message,
  };

  if (details) {
    response.details = details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.error = {
      name: err.name,
      code: err.code,
    };
  }

  res.status(status).json(response);
};
