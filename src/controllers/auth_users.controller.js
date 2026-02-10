import { authUserService } from '../services/auth_users.service.js';

const parseAuthUserId = (value) => {
  if (!value) {
    const error = new Error('Invalid auth user id');
    error.status = 400;
    throw error;
  }
  return value;
};

export const authUserController = {

  async list(req, res) {
    const authUsers = await authUserService.listAuthUsers();
    res.json(authUsers);
  },

  async getById(req, res) {
    const id = parseAuthUserId(req.params.id);
    const authUser = await authUserService.getAuthUserById(id);
    res.json(authUser);
  },

  async update(req, res) {
    const id = parseAuthUserId(req.params.id);
    const authUser = await authUserService.updateAuthUser(id, req.body);
    res.json(authUser);
  },

  async remove(req, res) {
    const id = parseAuthUserId(req.params.id);
    const authUser = await authUserService.deleteAuthUser(id);
    res.json(authUser);
  },
};
