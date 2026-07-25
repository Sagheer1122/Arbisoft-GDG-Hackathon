import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/authMiddleware';
import { emitToUser, emitToRole } from '../sockets/socketHandler';

const router = Router();

// GET /api/leave-requests (All or for logged in user)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { nurseId, status } = req.query;

    const where: any = {};
    if (req.user!.role === 'NURSE') {
      where.nurseId = req.user!.userId;
    } else if (nurseId) {
      where.nurseId = String(nurseId);
    }

    if (status) where.status = String(status);

    const requests = await prisma.leaveRequest.findMany({
      where,
      include: {
        nurse: {
          select: { id: true, name: true, email: true, employeeId: true, avatar: true, department: true },
        },
        reviewer: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(requests);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/leave-requests (Submit Leave Request)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { leaveType, fromDate, toDate, reason, attachment } = req.body;
    const nurseId = req.user!.userId;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ error: 'Leave type, dates, and reason are required' });
    }

    // Validate dates
    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ error: 'From Date cannot be after To Date' });
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        nurseId,
        leaveType,
        fromDate,
        toDate,
        reason,
        attachment: attachment || null,
        status: 'PENDING',
      },
      include: {
        nurse: {
          select: { id: true, name: true, email: true, employeeId: true, avatar: true },
        },
      },
    });

    // Notify admins of new pending request
    emitToRole('ADMIN', 'leave:new', leaveRequest);
    emitToRole('HEAD_NURSE', 'leave:new', leaveRequest);

    return res.status(201).json(leaveRequest);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/leave-requests/:id/approve
router.patch('/:id/approve', authenticateToken, requireRole(['ADMIN', 'HEAD_NURSE']), async (req: AuthRequest, res: Response) => {
  try {
    const requestId = req.params.id;

    const request = await prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { nurse: true },
    });

    if (!request) return res.status(404).json({ error: 'Leave request not found' });

    const updated = await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      },
      include: {
        nurse: true,
        reviewer: true,
      },
    });

    // 1. Create Notification
    const notif = await prisma.notification.create({
      data: {
        userId: request.nurseId,
        title: 'Leave Approved',
        message: `Your ${request.leaveType} request for ${request.fromDate} to ${request.toDate} has been approved.`,
        type: 'LEAVE',
      },
    });

    // 2. Emit Socket.IO Events for Real-Time UI updates
    emitToUser(request.nurseId, 'leave:approved', updated);
    emitToUser(request.nurseId, 'notification:new', notif);

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/leave-requests/:id/reject
router.patch('/:id/reject', authenticateToken, requireRole(['ADMIN', 'HEAD_NURSE']), async (req: AuthRequest, res: Response) => {
  try {
    const requestId = req.params.id;

    const request = await prisma.leaveRequest.findUnique({
      where: { id: requestId },
      include: { nurse: true },
    });

    if (!request) return res.status(404).json({ error: 'Leave request not found' });

    const updated = await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      },
      include: {
        nurse: true,
        reviewer: true,
      },
    });

    // 1. Create Notification
    const notif = await prisma.notification.create({
      data: {
        userId: request.nurseId,
        title: 'Leave Rejected',
        message: `Your ${request.leaveType} request for ${request.fromDate} to ${request.toDate} has been rejected.`,
        type: 'LEAVE',
      },
    });

    // 2. Real-Time Socket.IO
    emitToUser(request.nurseId, 'leave:rejected', updated);
    emitToUser(request.nurseId, 'notification:new', notif);

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
