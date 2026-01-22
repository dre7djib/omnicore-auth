import { getPrisma } from '../config/database.js';

export const authSessionRepository = {
  create(data) {
    const prisma = getPrisma();
    return prisma.authSession.create({ data });
  },

  findMany() {
    const prisma = getPrisma();
    return prisma.authSession.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id) {
    const prisma = getPrisma();
    return prisma.authSession.findUnique({ where: { id } });
  },

  findByUserId(userId) {
    const prisma = getPrisma();
    return prisma.authSession.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  },

  findByRefreshToken(refreshToken) {
    const prisma = getPrisma();
    return prisma.authSession.findFirst({ where: { refreshToken } });
  },

  updateById(id, data) {
    const prisma = getPrisma();
    return prisma.authSession.update({ where: { id }, data });
  },

  deleteById(id) {
    const prisma = getPrisma();
    return prisma.authSession.delete({ where: { id } });
  },

  deleteByUserId(userId) {
    const prisma = getPrisma();
    return prisma.authSession.deleteMany({ where: { userId } });
  },

  deleteExpired() {
    const prisma = getPrisma();
    return prisma.authSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  },
};
