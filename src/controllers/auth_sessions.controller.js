import { authSessionService } from '../services/auth_sessions.service.js';

const parseAuthSessionId = (value) => {
  if (!value) {
    const error = new Error('Invalid auth session id');
    error.status = 400;
    throw error;
  }
  return value;
};

const parseUserId = (value) => {
  if (!value) {
    const error = new Error('Invalid user id');
    error.status = 400;
    throw error;
  }
  return value;
};

export const authSessionController = {
  async create(req, res) {
    const authSession = await authSessionService.createAuthSession(req.body);
    res.status(201).json(authSession);
  },

  async list(req, res) {
    const authSessions = await authSessionService.listAuthSessions();
    res.json(authSessions);
  },

  async getById(req, res) {
    const id = parseAuthSessionId(req.params.id);
    const authSession = await authSessionService.getAuthSessionById(id);
    res.json(authSession);
  },

  async getByUserId(req, res) {
    const userId = parseUserId(req.params.userId);
    const authSessions = await authSessionService.getAuthSessionsByUserId(userId);
    res.json(authSessions);
  },

  async update(req, res) {
    const id = parseAuthSessionId(req.params.id);
    const authSession = await authSessionService.updateAuthSession(id, req.body);
    res.json(authSession);
  },

  async remove(req, res) {
    const id = parseAuthSessionId(req.params.id);
    const authSession = await authSessionService.deleteAuthSession(id);
    res.json(authSession);
  },
};
