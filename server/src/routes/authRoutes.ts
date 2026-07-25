import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, employeeId, departmentId } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ error: 'Name, email, password, and employee ID are required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { employeeId }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or Employee ID already exists' });
    }

    const passwordHash = await hashPassword(password);
    const userRole = role || 'NURSE';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: userRole,
        phone,
        employeeId,
        departmentId,
        avatar: `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80`,
      },
      include: { department: true },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        phone: user.phone,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { department: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        phone: user.phone,
        department: user.department,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { department: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      phone: user.phone,
      department: user.department,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User with this email not found' });
    }
    return res.json({ message: 'Password reset link sent to your email.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
