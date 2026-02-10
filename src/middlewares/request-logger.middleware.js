import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

const getDurationNs = (startTime) => {
  const diff = process.hrtime.bigint() - startTime;
  return Number(diff);
};

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip;
};

const REDACTED_VALUE = '[REDACTED]';
const SENSITIVE_KEY_REGEX = /(authorization|password|token|tokens)/i;

const redactValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(redactValue);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, child]) => {
      if (SENSITIVE_KEY_REGEX.test(key)) {
        acc[key] = REDACTED_VALUE;
      } else {
        acc[key] = redactValue(child);
      }
      return acc;
    }, {});
  }
  return value;
};

export const requestLoggerMiddleware = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  const requestId = randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const statusCode = res.statusCode;
    const outcome = statusCode >= 400 ? 'failure' : 'success';
    const contentLength = req.headers['content-length'];
    const bodyBytes =
      typeof contentLength === 'string' ? Number.parseInt(contentLength, 10) : undefined;

    const redactedHeaders = redactValue(req.headers);
    const redactedBody = redactValue(req.body);
    const redactedQuery = redactValue(req.query);
    const redactedParams = redactValue(req.params);

    const meta = {
      event: {
        dataset: 'http.server',
        category: ['web'],
        action: 'request',
        kind: 'event',
        outcome,
        duration: getDurationNs(startTime),
      },
      http: {
        request: {
          method: req.method,
          body: {
            bytes: bodyBytes !== undefined && !Number.isNaN(bodyBytes) ? bodyBytes : undefined,
            content: redactedBody,
          },
          headers: redactedHeaders,
          referrer: redactedHeaders.referer || redactedHeaders.referrer,
        },
        response: {
          status_code: statusCode,
        },
        version: req.httpVersion,
      },
      url: {
        path: req.path,
        original: req.originalUrl,
        scheme: req.protocol,
        domain: req.hostname,
      },
      client: {
        ip: getClientIp(req),
      },
      source: {
        address: req.socket?.remoteAddress,
        port: req.socket?.remotePort,
      },
      user_agent: {
        original: req.headers['user-agent'],
      },
      trace: {
        id: requestId,
      },
      request: {
        id: requestId,
      },
    };

    if (redactedQuery && Object.keys(redactedQuery).length > 0) {
      meta.url.query = redactedQuery;
    }

    if (redactedParams && Object.keys(redactedParams).length > 0) {
      meta.url.params = redactedParams;
    }

    logger.info('HTTP request', meta);
  });

  next();
};

