export const authUserModel = {
  toPublic(authUser) {
    if (!authUser) {
      return null;
    }
    return {
      id: authUser.id,
      email: authUser.email,
      country_id: authUser.countryId,
      is_active: authUser.isActive,
      email_verified: authUser.emailVerified,
      last_login_at: authUser.lastLoginAt,
      created_at: authUser.createdAt,
      updated_at: authUser.updatedAt,
    };
  },
};
