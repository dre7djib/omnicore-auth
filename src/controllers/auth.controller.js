import { authService } from '../services/auth.service.js';

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }
  return null;
};

export const authController = {
  async signup(req, res) {
    const { email, password, countryId } = req.body;
    const result = await authService.signup({ email, password, countryId });
    res.status(201).json(result);
  },

  async login(req, res) {
    const { email, password } = req.body;
    const result = await authService.login({
      email,
      password,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    res.json(result);
  },

  async refresh(req, res) {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.json(result);
  },

  async logout(req, res) {
    const { refreshToken } = req.body;
    const result = await authService.logout(refreshToken);
    res.json(result);
  },

  async validate(req, res) {
    const token = req.body.token || getTokenFromRequest(req);
    if (!token) {
      const error = new Error('Token is required');
      error.status = 400;
      throw error;
    }
    const result = await authService.validate(token);
    res.json(result);
  },
};

