import { Router } from 'express';
import { users } from '../data/users.js';

const router = Router();

// POST /api/auth/login
// Accepts any email/password combo (mock auth).
// If userId is provided in the body, returns that specific user (dev quick-login).
router.post('/login', (req, res) => {
  const { userId } = req.body as { userId?: string };

  const user = userId ? users.find((u) => u.id === userId) : users[0];

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user, token: 'mock-jwt-token' });
});

export default router;
