import { authSessionRepository } from '../repositories/auth_sessions.repositories.js';
import { authSessionModel } from '../models/auth_sessions.model.js';
import { logger } from '../utils/logger.js';

const normalizeCreatePayload = (payload) => {
  return {
    userId: payload?.user_id,
    refreshToken: payload?.refresh_token,
    expiresAt: payload?.expires_at ? new Date(payload.expires_at) : new Date(),
    ipAddress: payload?.ip_address?.trim() || null,
    userAgent: payload?.user_agent?.trim() || null,
  };
};

const normalizeUpdatePayload = (payload) => {
  const data = {};
  if (payload?.refresh_token !== undefined) {
    data.refreshToken = payload.refresh_token;
  }
  if (payload?.expires_at !== undefined) {
    data.expiresAt = payload.expires_at ? new Date(payload.expires_at) : null;
  }
  if (payload?.ip_address !== undefined) {
    data.ipAddress = payload.ip_address?.trim() || null;
  }
  if (payload?.user_agent !== undefined) {
    data.userAgent = payload.user_agent?.trim() || null;
  }
  return data;
};

export const authSessionService = {
  async createAuthSession(payload) {
    logger.info('AuthSession create requested');
    const data = normalizeCreatePayload(payload);
    const authSession = await authSessionRepository.create(data);
    logger.info('AuthSession created', { id: authSession.id });
    return authSessionModel.toPublic(authSession);
  },

  async listAuthSessions() {
    logger.info('AuthSession list requested');
    const authSessions = await authSessionRepository.findMany();
    logger.info('AuthSession list completed', { count: authSessions.length });
    return authSessions.map(authSessionModel.toPublic);
  },

  async getAuthSessionById(id) {
    logger.info('AuthSession get requested', { id });
    const authSession = await authSessionRepository.findById(id);
    if (!authSession) {
      const error = new Error('AuthSession not found');
      error.status = 404;
      throw error;
    }
    logger.info('AuthSession found', { id });
    return authSessionModel.toPublic(authSession);
  },

  async getAuthSessionsByUserId(userId) {
    logger.info('AuthSession list by userId requested', { userId });
    const authSessions = await authSessionRepository.findByUserId(userId);
    logger.info('AuthSession list by userId completed', { userId, count: authSessions.length });
    return authSessions.map(authSessionModel.toPublic);
  },

  async updateAuthSession(id, payload) {
    logger.info('AuthSession update requested', { id });
    const data = normalizeUpdatePayload(payload);
    if (Object.keys(data).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }
    const authSession = await authSessionRepository.updateById(id, data);
    logger.info('AuthSession updated', { id });
    return authSessionModel.toPublic(authSession);
  },

  async deleteAuthSession(id) {
    logger.info('AuthSession delete requested', { id });
    const authSession = await authSessionRepository.deleteById(id);
    logger.info('AuthSession deleted', { id });
    return authSessionModel.toPublic(authSession);
  },

  async deleteAuthSessionsByUserId(userId) {
    logger.info('AuthSession delete by userId requested', { userId });
    await authSessionRepository.deleteByUserId(userId);
    logger.info('AuthSession deleted by userId', { userId });
    return { message: 'All sessions deleted for user' };
  },
};
