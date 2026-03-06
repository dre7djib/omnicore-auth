import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { getPrisma } from '../config/database.js';

const prisma = getPrisma();

const ensureJwtSecret = () => {
  if (!env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not set');
    error.status = 500;
    throw error;
  }
};

const createAuthError = (message, status = 401) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const sendUserCreatedEmail = async (email) => {
  try {
    const res = await fetch(`${env.OMNICORE_SMTP_URL}/mail/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      throw new Error(`Failed to send user created email: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

const parseDurationToMs = (value) => {
  const match = /^(\d+)([smhd])$/.exec(value || '');
  if (!match) {
    return 30 * 24 * 60 * 60 * 1000;
  }
  const amount = Number.parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * multipliers[unit];
};

const buildAccessToken = (user, roles) => {
  ensureJwtSecret();
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles,
      countryId: user.countryId || null,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const createRefreshSession = async ({ userId, ipAddress, userAgent }) => {
  const refreshToken = randomUUID();
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.REFRESH_EXPIRES_IN));

  const session = await prisma.authSession.create({
    data: {
      id: randomUUID(),
      userId,
      refreshToken,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return session;
};

const getUserRoles = (user) => {
  return user.userRoles?.map((userRole) => userRole.role?.name).filter(Boolean) || [];
};

export const authService = {
  async signup({ email, password, countryId }) {
    const existingUser = await prisma.authUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error('Email already exists');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.authUser.create({
      data: {
        id: randomUUID(),
        email,
        passwordHash,
        countryId: countryId || null,
      },
    });

    await sendUserCreatedEmail(email);

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  },

  async login({ email, password, ipAddress, userAgent }) {
    ensureJwtSecret();

    const user = await prisma.authUser.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw createAuthError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw createAuthError('Invalid credentials');
    }

    const roles = getUserRoles(user);
    const accessToken = buildAccessToken(user, roles);
    const session = await createRefreshSession({ userId: user.id, ipAddress, userAgent });

    await prisma.authUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken: session.refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
      refreshExpiresIn: env.REFRESH_EXPIRES_IN,
      user: {
        id: user.id,
        email: user.email,
        roles,
      },
    };
  },

  async refresh(refreshToken) {
    ensureJwtSecret();

    const session = await prisma.authSession.findFirst({
      where: { refreshToken },
    });

    if (!session) {
      throw createAuthError('Invalid refresh token');
    }

    if (session.expiresAt && session.expiresAt.getTime() <= Date.now()) {
      await prisma.authSession.deleteMany({ where: { refreshToken } });
      throw createAuthError('Refresh token expired');
    }

    const user = await prisma.authUser.findUnique({
      where: { id: session.userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw createAuthError('Invalid refresh token');
    }

    const roles = getUserRoles(user);
    const accessToken = buildAccessToken(user, roles);

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  },

  async logout(refreshToken) {
    await prisma.authSession.deleteMany({
      where: { refreshToken },
    });

    return { status: 'ok' };
  },

  async validate(token) {
    ensureJwtSecret();

    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      return {
        valid: true,
        payload,
      };
    } catch (error) {
      throw createAuthError('Invalid token', 401);
    }
  },
};

