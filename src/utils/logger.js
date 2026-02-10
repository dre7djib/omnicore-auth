const ECS_VERSION = '8.11.0';
const SERVICE_NAME = 'omnicore-auth';

const buildEcsLog = (level, message, meta = {}) => {
  return {
    '@timestamp': new Date().toISOString(),
    'log.level': level,
    message,
    'ecs.version': ECS_VERSION,
    service: {
      name: SERVICE_NAME,
    },
    ...meta,
  };
};

export const logger = {
  info(message, meta) {
    console.log(JSON.stringify(buildEcsLog('info', message, meta)));
  },
  warn(message, meta) {
    console.warn(JSON.stringify(buildEcsLog('warn', message, meta)));
  },
  error(message, meta) {
    console.error(JSON.stringify(buildEcsLog('error', message, meta)));
  },
};

