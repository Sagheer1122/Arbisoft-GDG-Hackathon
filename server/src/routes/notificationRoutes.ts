import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/authMiddleware';
import { emitToAll } from '../sockets/socketHandler';

const router = Router();

// GET /api/notifications
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(notifications);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      data: { isRead: true },
    });
    return res.json({ success: true, notification });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId },
      data: { isRead: true },
    });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/notifications/send-alert (Admin emergency alert)
router.post('/send-alert', authenticateToken, requireRole(['ADMIN', 'HEAD_NURSE']), async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const allUsers = await prisma.user.findMany({ select: { id: true } });

    await prisma.notification.createMany({
      data: allUsers.map((u) => ({
        userId: u.id,
        title: title || 'Emergency Alert',
        message,
        type: 'ALERT',
      })),
    });

    emitToAll('emergency:alert', { title, message, createdAt: new Date() });

    return res.status(201).json({ message: 'Emergency alert dispatched to all staff' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
