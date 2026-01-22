import { getPrisma } from '../config/database.js';

export const authUserRepository = {
  create(data) {
    const prisma = getPrisma();
    return prisma.authUser.create({ data });
  },

  findMany() {
    const prisma = getPrisma();
    return prisma.authUser.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id) {
    const prisma = getPrisma();
    return prisma.authUser.findUnique({ where: { id } });
  },

  findByEmail(email) {
    const prisma = getPrisma();
    return prisma.authUser.findUnique({ where: { email } });
  },

  updateById(id, data) {
    const prisma = getPrisma();
    return prisma.authUser.update({ where: { id }, data });
  },

  deleteById(id) {
    const prisma = getPrisma();
    return prisma.authUser.delete({ where: { id } });
  },
};
