import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Gamepad2,
  RotateCcw,
  Clock,
  Award,
  Sparkles,
  Trophy,
  BrainCircuit,
  Bot,
  User,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { NurseGameScore } from '../types';

type BoardState = (string | null)[];

export const TicTacToeGamePage: React.FC = () => {
  const navigate = useNavigate();

  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [userSymbol, setUserSymbol] = useState<'X' | 'O'>('X');
  const [aiSymbol, setAiSymbol] = useState<'X' | 'O'>('O');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'UNBEATABLE'>('MEDIUM');

  const [isNurseTurn, setIsNurseTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null); // 'X', 'O', 'DRAW', or null
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const [score, setScore] = useState<NurseGameScore>({
    userId: 'sarah',
    gameType: 'TIC_TAC_TOE',
    nurseWins: 0,
    aiWins: 0,
    draws: 0,
    pointsEarned: 0,
  });

  const [thinking, setThinking] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // 10-minute break countdown
  useEffect(() => {
    const timer = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial scores
  useEffect(() => {
    const fetchScore = async () => {
      try {
        const data = await api.getTicTacToeScore();
        if (data) setScore(data);
      } catch (err) {
        console.warn('Error loading scores:', err);
      }
    };
    fetchScore();
  }, []);

  // Winning lines combinations
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinnerClient = (currentBoard: BoardState) => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        setWinningLine(pattern);
        return currentBoard[a];
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return 'DRAW';
    }
    return null;
  };

  const handleCellClick = async (index: number) => {
    if (board[index] !== null || winner || !isNurseTurn || thinking) return;

    // 1. Nurse move
    const newBoard = [...board];
    newBoard[index] = userSymbol;
    setBoard(newBoard);

    const result = checkWinnerClient(newBoard);
    if (result) {
      handleGameOver(result);
      return;
    }

    // 2. AI Turn
    setIsNurseTurn(false);
    setThinking(true);

    try {
      const res = await api.getTicTacToeAIMove({
        board: newBoard,
        aiSymbol,
        userSymbol,
        difficulty,
      });

      if (res.aiMoveIndex !== -1 && res.aiMoveIndex !== undefined) {
        const aiBoard = [...newBoard];
        aiBoard[res.aiMoveIndex] = aiSymbol;
        setBoard(aiBoard);

        const aiResult = checkWinnerClient(aiBoard);
        if (aiResult) {
          handleGameOver(aiResult);
        } else {
          setIsNurseTurn(true);
        }
      } else {
        setIsNurseTurn(true);
      }
    } catch (err) {
      console.warn('Error fetching AI move, using local fallback:', err);
      // Fallback local AI move
      const emptyIndices = newBoard
        .map((v, i) => (v === null ? i : null))
        .filter((v): v is number => v !== null);

      if (emptyIndices.length > 0) {
        const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const fallbackBoard = [...newBoard];
        fallbackBoard[randomIdx] = aiSymbol;
        setBoard(fallbackBoard);

        const fbResult = checkWinnerClient(fallbackBoard);
        if (fbResult) {
          handleGameOver(fbResult);
        } else {
          setIsNurseTurn(true);
        }
      }
    } finally {
      setThinking(false);
    }
  };

  const handleGameOver = async (gameWinner: string) => {
    setWinner(gameWinner);

    let outcome: 'NURSE_WIN' | 'AI_WIN' | 'DRAW' = 'DRAW';
    if (gameWinner === userSymbol) outcome = 'NURSE_WIN';
    else if (gameWinner === aiSymbol) outcome = 'AI_WIN';

    try {
      const updatedScore = await api.saveTicTacToeScore(outcome);
      setScore(updatedScore);
    } catch (err) {
      console.warn('Error saving score:', err);
      setScore((prev) => ({
        ...prev,
        nurseWins: prev.nurseWins + (outcome === 'NURSE_WIN' ? 1 : 0),
        aiWins: prev.aiWins + (outcome === 'AI_WIN' ? 1 : 0),
        draws: prev.draws + (outcome === 'DRAW' ? 1 : 0),
        pointsEarned: prev.pointsEarned + (outcome === 'NURSE_WIN' ? 50 : outcome === 'DRAW' ? 20 : 10),
      }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setIsNurseTurn(true);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#5142C5] via-[#3D2DA8] to-[#16162A] text-white p-6 md:p-8 rounded-card shadow-nurse-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#EDE9FE] text-xs font-bold border border-white/20">
            <Gamepad2 size={16} className="text-[#FACC15]" /> Nurse Break Relaxation Lounge
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            AI Tick & Cross (Tic-Tac-Toe ❌⭕)
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed font-medium">
            Challenge **Gemma 4 AI** during your 10-minute shift break to refresh your focus!
          </p>
        </div>

        {/* 10-Minute Break Timer Badge */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0 shadow-lg">
          <Clock size={20} className="text-[#FACC15]" />
          <div>
            <span className="text-[10px] text-purple-200 uppercase font-bold block">Shift Break Timer</span>
            <span className="text-xl font-black text-white">{formatTimer(timerSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Game Board & Sidebar Controls */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 3x3 Tic-Tac-Toe Board */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-6 shadow-nurse-md flex flex-col items-center justify-center">
            {/* Status Announcement Banner */}
            <div className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-black shadow-sm transition-all duration-300 bg-[#F7F7FB] border border-[#E7E7F0]">
              {winner ? (
                winner === userSymbol ? (
                  <span className="text-emerald-600 flex items-center justify-center gap-1.5 text-sm">
                    <Trophy size={18} /> 🎉 Nurse Victory! +50 Wellness Points
                  </span>
                ) : winner === aiSymbol ? (
                  <span className="text-rose-600 flex items-center justify-center gap-1.5 text-sm">
                    <Bot size={18} /> 🤖 Gemma 4 AI Won! Keep Practicing
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center justify-center gap-1.5 text-sm">
                    🤝 Game Draw! Well Played
                  </span>
                )
              ) : thinking ? (
                <span className="text-[#5142C5] flex items-center justify-center gap-1.5 animate-pulse">
                  <BrainCircuit size={16} /> Gemma 4 AI is thinking...
                </span>
              ) : (
                <span className="text-[#16162A]">
                  Your Turn: Place your <strong className="text-[#5142C5]">{userSymbol}</strong> on the grid
                </span>
              )}
            </div>

            {/* 3x3 Grid Board */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] aspect-square p-2 bg-[#F7F7FB] border-2 border-[#E7E7F0] rounded-3xl relative">
              {board.map((cell, idx) => {
                const isWinningCell = winningLine?.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCellClick(idx)}
                    disabled={!!cell || !!winner || !isNurseTurn || thinking}
                    className={`rounded-2xl font-black text-3xl sm:text-4xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                      cell === null
                        ? 'bg-white hover:bg-[#EDE9FE]/50 hover:border-[#5142C5] cursor-pointer border border-[#E7E7F0]'
                        : cell === 'X'
                        ? 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-nurse-sm'
                        : 'bg-gradient-to-tr from-[#5142C5] to-[#3D2DA8] text-white shadow-nurse-sm'
                    } ${isWinningCell ? 'ring-4 ring-[#FACC15] scale-105 z-10' : ''}`}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>

            {/* Reset / Play Again Button */}
            <Button
              onClick={resetGame}
              icon={<RotateCcw size={16} />}
              className="w-full max-w-[340px] bg-[#5142C5] hover:bg-[#3D2DA8] text-white font-bold py-3 text-xs shadow-nurse-sm"
            >
              {winner ? 'Play Next Match' : 'Reset Grid'}
            </Button>
          </Card>
        </div>

        {/* Right Column: Difficulty Selector & Scoreboard */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-6 shadow-nurse-md">
            <h3 className="font-extrabold text-base text-[#16162A] border-b border-[#E7E7F0] pb-3">
              Configure Game
            </h3>

            {/* AI Difficulty Radio Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#707080] uppercase tracking-wider">
                Gemma 4 AI Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'UNBEATABLE'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-[10px] font-extrabold transition-all ${
                      difficulty === diff
                        ? diff === 'EASY'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : diff === 'MEDIUM'
                          ? 'bg-[#5142C5] text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm'
                        : 'bg-[#F7F7FB] text-[#707080] hover:text-[#16162A] border border-[#E7E7F0]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Symbol */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#707080] uppercase tracking-wider">
                Select Your Symbol
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUserSymbol('X');
                    setAiSymbol('O');
                    resetGame();
                  }}
                  className={`py-2.5 rounded-2xl font-black text-sm transition-all border ${
                    userSymbol === 'X'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-400/30'
                      : 'bg-white border-[#E7E7F0] text-[#707080]'
                  }`}
                >
                  ❌ Play as X
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserSymbol('O');
                    setAiSymbol('X');
                    resetGame();
                  }}
                  className={`py-2.5 rounded-2xl font-black text-sm transition-all border ${
                    userSymbol === 'O'
                      ? 'bg-purple-50 border-[#5142C5] text-[#5142C5] ring-2 ring-purple-400/30'
                      : 'bg-white border-[#E7E7F0] text-[#707080]'
                  }`}
                >
                  ⭕ Play as O
                </button>
              </div>
            </div>
          </Card>

          {/* Break Scoreboard */}
          <Card className="p-6 space-y-4 shadow-nurse-md">
            <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-3">
              <h3 className="font-extrabold text-base text-[#16162A]">Break Scoreboard</h3>
              <Badge variant="approved">{score.pointsEarned} Wellness Pts</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase block">Nurse Wins</span>
                <span className="text-2xl font-black text-emerald-700">{score.nurseWins}</span>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                <span className="text-[10px] text-[#5142C5] font-extrabold uppercase block">Draws</span>
                <span className="text-2xl font-black text-[#5142C5]">{score.draws}</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                <span className="text-[10px] text-rose-800 font-extrabold uppercase block">AI Wins</span>
                <span className="text-2xl font-black text-rose-700">{score.aiWins}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
