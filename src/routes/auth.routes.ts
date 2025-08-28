import { Router } from 'express';
const r = Router();

// /auth/register
r.post('/register', async (req, res) => {
  // body: RegisterRequest
  // TODO: valida input (se non usi EOV qui), crea user, bcrypt.hash, ecc.
  // return 201 { AuthUser }
  return res.status(201).json({ user: {}, accessToken: '', refreshToken: '' });
});

// /auth/login
r.post('/login', async (req, res) => {
  // body: LoginRequest
  // TODO: verifica credenziali, genera JWT e refresh
  return res.status(200).json({ accessToken: '', refreshToken: '', expiresIn: 3600 });
});

// /auth/refresh
r.post('/refresh', async (req, res) => {
  // body: RefreshRequest
  // TODO: valida refresh token, restituisci nuovo access token
  return res.status(200).json({ accessToken: '', refreshToken: '', expiresIn: 3600 });
});

export default r;
