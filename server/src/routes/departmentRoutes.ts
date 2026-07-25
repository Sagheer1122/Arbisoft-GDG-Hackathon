import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// GET /api/departments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json(departments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
