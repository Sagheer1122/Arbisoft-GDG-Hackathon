import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// GET /api/shifts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany();
    return res.json(shifts);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
