import { authUserRepository } from '../repositories/auth_users.repositories.js';
import { authUserModel } from '../models/auth_users.model.js';
import { logger } from '../utils/logger.js';

const normalizeCreatePayload = (payload) => {
  return {
    email: payload?.email?.trim().toLowerCase(),
    passwordHash: payload?.password_hash,
    countryId: payload?.country_id || null,
    isActive: payload?.is_active !== undefined ? payload.is_active : true,
    emailVerified: payload?.email_verified !== undefined ? payload.email_verified : false,
  };
};

const normalizeUpdatePayload = (payload) => {
  const data = {};
  if (payload?.email !== undefined) {
    data.email = payload.email?.trim().toLowerCase();
  }
  if (payload?.password_hash !== undefined) {
    data.passwordHash = payload.password_hash;
  }
  if (payload?.country_id !== undefined) {
    data.countryId = payload.country_id || null;
  }
  if (payload?.is_active !== undefined) {
    data.isActive = payload.is_active;
  }
  if (payload?.email_verified !== undefined) {
    data.emailVerified = payload.email_verified;
  }
  if (payload?.last_login_at !== undefined) {
    data.lastLoginAt = payload.last_login_at ? new Date(payload.last_login_at) : null;
  }
  return data;
};

export const authUserService = {
  async listAuthUsers() {
    logger.info('AuthUser list requested');
    const authUsers = await authUserRepository.findMany();
    logger.info('AuthUser list completed', { count: authUsers.length });
    return authUsers.map(authUserModel.toPublic);
  },

  async getAuthUserById(id) {
    logger.info('AuthUser get requested', { id });
    const authUser = await authUserRepository.findById(id);
    if (!authUser) {
      const error = new Error('AuthUser not found');
      error.status = 404;
      throw error;
    }
    logger.info('AuthUser found', { id });
    return authUserModel.toPublic(authUser);
  },

  async updateAuthUser(id, payload) {
    logger.info('AuthUser update requested', { id });
    const data = normalizeUpdatePayload(payload);
    if (Object.keys(data).length === 0) {
      const error = new Error('No fields to update');
      error.status = 400;
      throw error;
    }
    const authUser = await authUserRepository.updateById(id, data);
    logger.info('AuthUser updated', { id });
    return authUserModel.toPublic(authUser);
  },

  async deleteAuthUser(id) {
    logger.info('AuthUser delete requested', { id });
    const authUser = await authUserRepository.deleteById(id);
    logger.info('AuthUser deleted', { id });
    return authUserModel.toPublic(authUser);
  },
};
