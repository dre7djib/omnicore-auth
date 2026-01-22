export const authSessionModel = {
  toPublic(authSession) {
    if (!authSession) {
      return null;
    }
    return {
      id: authSession.id,
      user_id: authSession.userId,
      refresh_token: authSession.refreshToken,
      expires_at: authSession.expiresAt,
      ip_address: authSession.ipAddress,
      user_agent: authSession.userAgent,
      created_at: authSession.createdAt,
    };
  },
};
