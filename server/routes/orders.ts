import { Router } from "express";

const router = Router();

// POST /api/orders
router.post("/", (_req, res) => {
  const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  res.status(201).json({ orderId, status: "confirmed" });
});

export default router;
