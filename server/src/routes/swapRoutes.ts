import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/authMiddleware';
import { emitToUser, emitToRole } from '../sockets/socketHandler';

const router = Router();

// GET /api/shift-swaps
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (req.user!.role === 'NURSE') {
      where.OR = [
        { requesterId: req.user!.userId },
        { targetNurseId: req.user!.userId },
      ];
    }

    if (status) where.status = String(status);

    const swaps = await prisma.shiftSwapRequest.findMany({
      where,
      include: {
        requester: { select: { id: true, name: true, employeeId: true, avatar: true, department: true } },
        targetNurse: { select: { id: true, name: true, employeeId: true, avatar: true, department: true } },
        originalShift: true,
        reviewer: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(swaps);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/shift-swaps
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { targetNurseId, originalShiftId, requestedDate, reason } = req.body;
    const requesterId = req.user!.userId;

    if (!targetNurseId || !originalShiftId || !requestedDate || !reason) {
      return res.status(400).json({ error: 'Target nurse, shift, date, and reason are required' });
    }

    if (requesterId === targetNurseId) {
      return res.status(400).json({ error: 'You cannot swap a shift with yourself' });
    }

    // Validate duplicate pending swap
    const existing = await prisma.shiftSwapRequest.findFirst({
      where: {
        requesterId,
        requestedDate,
        status: 'PENDING',
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending shift swap request for this date' });
    }

    const swapRequest = await prisma.shiftSwapRequest.create({
      data: {
        requesterId,
        targetNurseId,
        originalShiftId,
        requestedDate,
        reason,
        status: 'PENDING',
      },
      include: {
        requester: true,
        targetNurse: true,
        originalShift: true,
      },
    });

    // Notify target nurse & admins
    const notifTarget = await prisma.notification.create({
      data: {
        userId: targetNurseId,
        title: 'Shift Swap Request',
        message: `${swapRequest.requester.name} requested to swap a shift with you on ${requestedDate}.`,
        type: 'SWAP',
      },
    });

    emitToUser(targetNurseId, 'shift-swap:updated', swapRequest);
    emitToUser(targetNurseId, 'notification:new', notifTarget);
    emitToRole('ADMIN', 'shift-swap:new', swapRequest);

    return res.status(201).json(swapRequest);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/shift-swaps/:id/approve
router.patch('/:id/approve', authenticateToken, requireRole(['ADMIN', 'HEAD_NURSE']), async (req: AuthRequest, res: Response) => {
  try {
    const swapId = req.params.id;

    const swap = await prisma.shiftSwapRequest.findUnique({
      where: { id: swapId },
      include: { requester: true, targetNurse: true, originalShift: true },
    });

    if (!swap) return res.status(404).json({ error: 'Shift swap request not found' });

    const updated = await prisma.shiftSwapRequest.update({
      where: { id: swapId },
      data: {
        status: 'APPROVED',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      },
      include: {
        requester: true,
        targetNurse: true,
        originalShift: true,
      },
    });

    // Notify both nurses
    const notifReq = await prisma.notification.create({
      data: {
        userId: swap.requesterId,
        title: 'Shift Swap Approved',
        message: `Your shift swap with ${swap.targetNurse.name} for ${swap.requestedDate} was approved.`,
        type: 'SWAP',
      },
    });

    emitToUser(swap.requesterId, 'shift-swap:updated', updated);
    emitToUser(swap.requesterId, 'notification:new', notifReq);

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /api/shift-swaps/:id/reject
router.patch('/:id/reject', authenticateToken, requireRole(['ADMIN', 'HEAD_NURSE']), async (req: AuthRequest, res: Response) => {
  try {
    const swapId = req.params.id;

    const swap = await prisma.shiftSwapRequest.findUnique({
      where: { id: swapId },
      include: { requester: true, targetNurse: true },
    });

    if (!swap) return res.status(404).json({ error: 'Shift swap request not found' });

    const updated = await prisma.shiftSwapRequest.update({
      where: { id: swapId },
      data: {
        status: 'REJECTED',
        reviewedBy: req.user!.userId,
        reviewedAt: new Date(),
      },
      include: {
        requester: true,
        targetNurse: true,
      },
    });

    const notifReq = await prisma.notification.create({
      data: {
        userId: swap.requesterId,
        title: 'Shift Swap Rejected',
        message: `Your shift swap with ${swap.targetNurse.name} for ${swap.requestedDate} was rejected.`,
        type: 'SWAP',
      },
    });

    emitToUser(swap.requesterId, 'shift-swap:updated', updated);
    emitToUser(swap.requesterId, 'notification:new', notifReq);

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
