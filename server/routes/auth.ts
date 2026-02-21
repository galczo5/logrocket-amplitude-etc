import { Router } from "express";
import { mockUser } from "../data/users.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (_req, res) => {
  // Accept any credentials — always returns the mock user
  res.json({ user: mockUser, token: "mock-jwt-token" });
});

export default router;
