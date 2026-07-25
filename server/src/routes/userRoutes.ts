import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// GET /api/users (Admin or Nurse)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { role, departmentId } = req.query;

    const whereClause: any = {};
    if (role) whereClause.role = String(role);
    if (departmentId) whereClause.departmentId = String(departmentId);

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        employeeId: true,
        avatar: true,
        department: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        employeeId: true,
        avatar: true,
        department: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, avatar } = req.body;
    const userId = req.user!.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
      },
      include: { department: true },
    });

    return res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      employeeId: updatedUser.employeeId,
      phone: updatedUser.phone,
      department: updatedUser.department,
      avatar: updatedUser.avatar,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
