type Board = (string | null)[];

export class GemmaTicTacToeService {
  /**
   * Calculates the optimal AI move for Tic-Tac-Toe based on difficulty.
   */
  static getAIMove(
    board: Board,
    aiSymbol: 'X' | 'O' = 'O',
    userSymbol: 'X' | 'O' = 'X',
    difficulty: 'EASY' | 'MEDIUM' | 'UNBEATABLE' = 'MEDIUM'
  ): number {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (emptyIndices.length === 0) return -1;

    // 1. Easy mode: Random move
    if (difficulty === 'EASY') {
      const randomIndex = Math.floor(Math.random() * emptyIndices.length);
      return emptyIndices[randomIndex];
    }

    // 2. Medium mode: 50% optimal, 50% random
    if (difficulty === 'MEDIUM' && Math.random() < 0.4) {
      const randomIndex = Math.floor(Math.random() * emptyIndices.length);
      return emptyIndices[randomIndex];
    }

    // 3. Check for immediate winning move or block move
    const winningMove = this.findWinningMove(board, aiSymbol);
    if (winningMove !== -1) return winningMove;

    const blockMove = this.findWinningMove(board, userSymbol);
    if (blockMove !== -1) return blockMove;

    // 4. Center control preference
    if (board[4] === null) return 4;

    // 5. Minimax for Unbeatable / Smart move
    let bestScore = -Infinity;
    let bestMove = emptyIndices[0];

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const score = this.minimax(board, 0, false, aiSymbol, userSymbol);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  private static findWinningMove(board: Board, symbol: 'X' | 'O'): number {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const vals = [board[a], board[b], board[c]];
      const symbolCount = vals.filter((v) => v === symbol).length;
      const nullCount = vals.filter((v) => v === null).length;

      if (symbolCount === 2 && nullCount === 1) {
        if (board[a] === null) return a;
        if (board[b] === null) return b;
        if (board[c] === null) return c;
      }
    }

    return -1;
  }

  private static minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    aiSymbol: 'X' | 'O',
    userSymbol: 'X' | 'O'
  ): number {
    const result = this.checkWinner(board, aiSymbol, userSymbol);
    if (result !== null) {
      if (result === aiSymbol) return 10 - depth;
      if (result === userSymbol) return depth - 10;
      if (result === 'DRAW') return 0;
    }

    if (depth >= 6) return 0; // Depth limit for performance

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = aiSymbol;
          const score = this.minimax(board, depth + 1, false, aiSymbol, userSymbol);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = userSymbol;
          const score = this.minimax(board, depth + 1, true, aiSymbol, userSymbol);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  static checkWinner(board: Board, aiSymbol: 'X' | 'O', userSymbol: 'X' | 'O'): string | null {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of winPatterns) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== null)) {
      return 'DRAW';
    }

    return null;
  }
}
