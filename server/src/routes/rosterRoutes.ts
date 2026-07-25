import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/authMiddleware';
import { emitToUser, emitToAll } from '../sockets/socketHandler';

const router = Router();

// GET /api/rosters
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { nurseId, departmentId, startDate, endDate, date } = req.query;

    const where: any = {};
    if (nurseId) where.nurseId = String(nurseId);
    if (departmentId) where.departmentId = String(departmentId);
    if (date) where.date = String(date);
    if (startDate && endDate) {
      where.date = {
        gte: String(startDate),
        lte: String(endDate),
      };
    }

    const rosters = await prisma.roster.findMany({
      where,
      include: {
        nurse: {
          select: { id: true, name: true, email: true, employeeId: true, avatar: true },
        },
        shift: true,
        department: true,
      },
      orderBy: { date: 'asc' },
    });

    return res.json(rosters);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/rosters/:id
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const roster = await prisma.roster.findUnique({
      where: { id: req.params.id },
      include: {
        nurse: true,
        shift: true,
        department: true,
      },
    });

    if (!roster) return res.status(404).json({ error: 'Roster item not found' });
    return res.json(roster);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/rosters (Admin only - Batch or single creation)
router.post('/', authenticateToken, requireRole(['ADMIN', 'HEAD_NURSE']), async (req: AuthRequest, res: Response) => {
  try {
    const { assignments, departmentId, date } = req.body; // array of { nurseId, shiftId, notes } or single

    if (Array.isArray(assignments)) {
      // Bulk roster creation
      const createdRosters = [];
      const conflicts = [];

      for (const item of assignments) {
        // Validate double booking for nurse on date
        const existing = await prisma.roster.findFirst({
          where: {
            nurseId: item.nurseId,
            date: date || item.date,
          },
          include: { nurse: true },
        });

        if (existing) {
          conflicts.push(`Nurse ${existing.nurse.name} is already assigned on ${date || item.date}`);
          continue;
        }

        const roster = await prisma.roster.create({
          data: {
            nurseId: item.nurseId,
            shiftId: item.shiftId,
            departmentId: departmentId || item.departmentId,
            date: date || item.date,
            notes: item.notes || null,
            createdBy: req.user!.userId,
            status: item.status || 'SCHEDULED',
          },
          include: { nurse: true, shift: true, department: true },
        });

        createdRosters.push(roster);

        // Create notification for nurse
        await prisma.notification.create({
          data: {
            userId: item.nurseId,
            title: 'Roster Updated',
            message: `Your schedule for ${date || item.date} has been set to ${roster.shift.name}.`,
            type: 'ROSTER',
          },
        });

        emitToUser(item.nurseId, 'roster:updated', roster);
        emitToUser(item.nurseId, 'notification:new', {
          title: 'Roster Updated',
          message: `Your schedule for ${date || item.date} has been set to ${roster.shift.name}.`,
        });
      }

      return res.status(201).json({
        message: 'Roster processed successfully',
        created: createdRosters,
        conflicts,
      });
    } else {
      // Single assignment
      const { nurseId, shiftId, departmentId: singleDept, date: singleDate, notes } = req.body;

      const existing = await prisma.roster.findFirst({
        where: { nurseId, date: singleDate },
        include: { nurse: true },
      });

      if (existing) {
        return res.status(400).json({ error: `Nurse ${existing.nurse.name} is already assigned on ${singleDate}` });
      }

      const roster = await prisma.roster.create({
        data: {
          nurseId,
          shiftId,
          departmentId: singleDept,
          date: singleDate,
          notes: notes || null,
          createdBy: req.user!.userId,
          status: 'SCHEDULED',
        },
        include: { nurse: true, shift: true, department: true },
      });

      await prisma.notification.create({
        data: {
          userId: nurseId,
          title: 'Roster Updated',
          message: `Your roster has been updated for ${singleDate}.`,
          type: 'ROSTER',
        },
      });

      emitToUser(nurseId, 'roster:updated', roster);
      emitToUser(nurseId, 'notification:new', {
        title: 'Roster Updated',
        message: `Your roster has been updated for ${singleDate}.`,
      });

      return res.status(201).json(roster);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/rosters/:id (Nurse can update notes, Admin can update full shift)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { notes, shiftId, status } = req.body;
    const rosterId = req.params.id;

    const roster = await prisma.roster.findUnique({ where: { id: rosterId } });
    if (!roster) return res.status(404).json({ error: 'Roster not found' });

    // Authorization check
    if (req.user!.role === 'NURSE' && roster.nurseId !== req.user!.userId) {
      return res.status(403).json({ error: 'Cannot modify another nurse\'s roster notes' });
    }

    const updated = await prisma.roster.update({
      where: { id: rosterId },
      data: {
        ...(notes !== undefined && { notes }),
        ...(shiftId && req.user!.role !== 'NURSE' && { shiftId }),
        ...(status && req.user!.role !== 'NURSE' && { status }),
      },
      include: { nurse: true, shift: true, department: true },
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
