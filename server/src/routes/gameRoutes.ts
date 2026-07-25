import express, { Response as ExResponse } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';
import { GemmaTicTacToeService } from '../services/GemmaTicTacToeService';

const router = express.Router();
const prisma = new PrismaClient();

// Helper to access nurseGameScore safely on Prisma instance
const getGameScoreDelegate = () => (prisma as any).nurseGameScore;

const getUserId = (req: AuthRequest): string => {
  return (req.user as any)?.id || req.user?.userId || '';
};

// 1. Calculate Gemma 4 AI move
router.post('/tic-tac-toe/move', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const { board, aiSymbol = 'O', userSymbol = 'X', difficulty = 'MEDIUM' } = req.body;

    if (!Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Invalid 3x3 board state' });
    }

    const aiMoveIndex = GemmaTicTacToeService.getAIMove(board, aiSymbol, userSymbol, difficulty);
    const updatedBoard = [...board];
    if (aiMoveIndex !== -1) {
      updatedBoard[aiMoveIndex] = aiSymbol;
    }

    const winner = GemmaTicTacToeService.checkWinner(updatedBoard, aiSymbol, userSymbol);

    res.json({
      aiMoveIndex,
      updatedBoard,
      winner,
    });
  } catch (error) {
    console.error('Error calculating AI move:', error);
    res.status(500).json({ error: 'Failed to compute AI move' });
  }
});

// 2. Update nurse game score & wellness points
router.post('/tic-tac-toe/score', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const userId = getUserId(req);
    const { outcome } = req.body; // 'NURSE_WIN' | 'AI_WIN' | 'DRAW'

    const scoreDelegate = getGameScoreDelegate();
    let existingScore = null;
    if (scoreDelegate) {
      existingScore = await scoreDelegate.findFirst({
        where: { userId, gameType: 'TIC_TAC_TOE' },
      });
    }

    const isNurseWin = outcome === 'NURSE_WIN';
    const isAiWin = outcome === 'AI_WIN';
    const isDraw = outcome === 'DRAW';

    const pointsToAdd = isNurseWin ? 50 : isDraw ? 20 : 10;

    let scoreRecord;
    if (existingScore && scoreDelegate) {
      scoreRecord = await scoreDelegate.update({
        where: { id: existingScore.id },
        data: {
          nurseWins: existingScore.nurseWins + (isNurseWin ? 1 : 0),
          aiWins: existingScore.aiWins + (isAiWin ? 1 : 0),
          draws: existingScore.draws + (isDraw ? 1 : 0),
          pointsEarned: existingScore.pointsEarned + pointsToAdd,
        },
      });
    } else if (scoreDelegate) {
      scoreRecord = await scoreDelegate.create({
        data: {
          userId,
          gameType: 'TIC_TAC_TOE',
          nurseWins: isNurseWin ? 1 : 0,
          aiWins: isAiWin ? 1 : 0,
          draws: isDraw ? 1 : 0,
          pointsEarned: pointsToAdd,
        },
      });
    } else {
      scoreRecord = {
        userId,
        gameType: 'TIC_TAC_TOE',
        nurseWins: isNurseWin ? 1 : 0,
        aiWins: isAiWin ? 1 : 0,
        draws: isDraw ? 1 : 0,
        pointsEarned: pointsToAdd,
      };
    }

    res.json(scoreRecord);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to record game score' });
  }
});

// 3. Get nurse game score
router.get('/tic-tac-toe/score', authenticateToken, async (req: AuthRequest, res: ExResponse) => {
  try {
    const userId = getUserId(req);
    const scoreDelegate = getGameScoreDelegate();
    let scoreRecord = null;
    if (scoreDelegate) {
      scoreRecord = await scoreDelegate.findFirst({
        where: { userId, gameType: 'TIC_TAC_TOE' },
      });
    }

    res.json(
      scoreRecord || {
        userId,
        gameType: 'TIC_TAC_TOE',
        nurseWins: 0,
        aiWins: 0,
        draws: 0,
        pointsEarned: 0,
      }
    );
  } catch (error) {
    console.error('Error fetching game score:', error);
    res.status(500).json({ error: 'Failed to fetch game score' });
  }
});

export default router;
