import express, { Request, Response as ExResponse } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { GemmaCommunicationService } from '../services/GemmaCommunicationService';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to get userId from AuthRequest safely
const getUserId = (req: AuthRequest): string => {
  return (req.user as any)?.id || req.user?.userId || '';
};

// 1. Get available scenarios
router.get('/scenarios', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const scenarios = await prisma.communicationScenario.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(scenarios);
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Failed to load communication scenarios' });
  }
});

// 2. Start a new simulation session
router.post('/sessions', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const { scenarioId, characterRole, difficulty } = req.body;
    const userId = getUserId(req);

    const scenario = await prisma.communicationScenario.findUnique({
      where: { id: scenarioId },
    });

    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    // Create session
    const session = await prisma.communicationSession.create({
      data: {
        userId,
        scenarioId,
        characterRole: characterRole || scenario.characterRole,
        difficulty: difficulty || scenario.difficulty,
        status: 'ACTIVE',
      },
    });

    // Create opening roleplay message from AI Patient Character
    let initialGreeting = `I've been waiting for over an hour. Nobody is explaining anything to me!`;
    if (scenario.title.includes('Anxious')) {
      initialGreeting = `Nurse, I'm really scared about these upcoming tests... Can you tell me what's going to happen?`;
    } else if (scenario.title.includes('Angry')) {
      initialGreeting = `This is ridiculous! My mother has been calling for assistance for 45 minutes! Why is nobody responding?`;
    } else if (scenario.title.includes('Confused')) {
      initialGreeting = `Excuse me... where are my shoes? I need to get home to take care of my garden.`;
    } else if (scenario.title.includes('Medication')) {
      initialGreeting = `I'm not taking these pills. The last time I took them I felt dizzy and nauseous all day.`;
    }

    await prisma.communicationMessage.create({
      data: {
        sessionId: session.id,
        role: 'PATIENT',
        content: initialGreeting,
        emotion: scenario.personality || 'Worried',
      },
    });

    const fullSession = await prisma.communicationSession.findUnique({
      where: { id: session.id },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    res.status(201).json(fullSession);
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Failed to start simulation session' });
  }
});

// 3. Get session details and chat history
router.get('/sessions/:id', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const session = await prisma.communicationSession.findUnique({
      where: { id: req.params.id },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
        analysis: true,
      },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const currentUserId = getUserId(req);

    // Auth guard: User can only access their own session
    if (session.userId !== currentUserId && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error loading session:', error);
    res.status(500).json({ error: 'Failed to load session' });
  }
});

// 4. Send nurse response and receive Gemma 4 roleplay reply
router.post('/sessions/:id/messages', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const { content } = req.body;
    const sessionId = req.params.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const result = await GemmaCommunicationService.generateRoleplayReply(sessionId, content);
    res.json(result);
  } catch (error: any) {
    console.error('Error in simulation message:', error);
    res.status(500).json({ error: error.message || 'Failed to process roleplay reply' });
  }
});

// 5. End simulation and trigger AI performance analysis
router.post('/sessions/:id/end', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const sessionId = req.params.id;
    const analysis = await GemmaCommunicationService.analyzeSession(sessionId);
    res.json({ message: 'Simulation analyzed successfully', analysis });
  } catch (error: any) {
    console.error('Error ending simulation:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze simulation' });
  }
});

// 6. Get simulation results report
router.get('/sessions/:id/results', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const session = await prisma.communicationSession.findUnique({
      where: { id: req.params.id },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
        analysis: true,
      },
    });

    if (!session || !session.analysis) {
      return res.status(404).json({ error: 'Results not ready or session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to load simulation results' });
  }
});

// 7. Get user personal progress history
router.get('/progress', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const userId = getUserId(req);

    const completedSessions = await prisma.communicationSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      include: {
        scenario: true,
        analysis: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(completedSessions);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to load progress trends' });
  }
});

export default router;
