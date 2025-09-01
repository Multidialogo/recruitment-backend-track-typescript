import { Router } from 'express';
const authRouter = Router();
import { login } from '../controller/auth.controller.js';

// /auth/register
authRouter.post('/register', async (req, res) => {
  return res.status(201).json({ user: {}, accessToken: '', refreshToken: '' });
});

// /auth/login
authRouter.post('/login', login);

export default authRouter;
