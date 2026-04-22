import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

// Helper to generate food coordinates
const getRandomFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const lastDirection = useRef<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Focus the game area on mount
  useEffect(() => {
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirection.current = INITIAL_DIRECTION;
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDirection.current.y !== 1) {
            setDirection({ x: 0, y: -1 });
            setHasStarted(true);
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDirection.current.y !== -1) {
            setDirection({ x: 0, y: 1 });
            setHasStarted(true);
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDirection.current.x !== 1) {
            setDirection({ x: -1, y: 0 });
            setHasStarted(true);
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDirection.current.x !== -1) {
            setDirection({ x: 1, y: 0 });
            setHasStarted(true);
          }
          break;
        case ' ':
          // start the game if hasn't
          if (!hasStarted) {
             setHasStarted(true);
          } else {
             setIsPaused((prev) => !prev);
          }
          break;
      }
    },
    [direction, gameOver, hasStarted]
  );

  useEffect(() => {
    if (gameOver || !hasStarted || isPaused) return;

    const moveSnake = () => {
      lastDirection.current = direction;
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, 120);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, hasStarted, isPaused, highScore]);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="flex flex-col items-end w-full mb-8">
        <div className="text-[10px] tracking-[0.2em] font-bold text-cyan-400 uppercase mb-1">Current Protocol Score</div>
        <div className="text-5xl md:text-6xl font-mono leading-none tracking-tighter text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
           {String(score).padStart(6, '0')}
        </div>
        <div className="text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase mt-2">
           HIGH: {String(highScore).padStart(6, '0')}
        </div>
      </div>

      <div className="relative p-2 border-2 border-zinc-800 rounded-sm">
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-30"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-30"></div>
        
        <div
          ref={gameAreaRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative bg-[#0c0c0e] shadow-[0_0_50px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-1 focus:ring-amber-400/50"
          style={{
            width: 'clamp(280px, 100vw, 400px)',
            height: 'clamp(280px, 100vw, 400px)',
            aspectRatio: '1 / 1',
          }}
        >
          {/* Grid Background Lines (Optional visual touch) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
              backgroundSize: `calc(100% / ${GRID_SIZE}) calc(100% / ${GRID_SIZE})`,
            }}
          />

          {/* Food */}
          <div
            className="absolute bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24] animate-pulse"
            style={{
              width: `calc(100% / ${GRID_SIZE})`,
              height: `calc(100% / ${GRID_SIZE})`,
              left: `${(food.x * 100) / GRID_SIZE}%`,
              top: `${(food.y * 100) / GRID_SIZE}%`,
              transition: 'all 0.1s linear',
            }}
          />

          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className="absolute bg-fuchsia-500 rounded-sm"
              style={{
                width: `calc(100% / ${GRID_SIZE})`,
                height: `calc(100% / ${GRID_SIZE})`,
                left: `${(segment.x * 100) / GRID_SIZE}%`,
                top: `${(segment.y * 100) / GRID_SIZE}%`,
                opacity: Math.max(0.4, 1 - i * 0.08),
                boxShadow: i === 0 ? '0 0 10px #f472b6' : 'none',
                zIndex: 10,
              }}
            />
          ))}

          {/* Overlay States */}
          {!hasStarted && !gameOver && (
            <div className="absolute inset-0 bg-[#0c0c0e]/90 flex flex-col items-center justify-center p-6 text-center z-20">
              <h3 className="text-2xl font-black text-white tracking-[0.3em] mb-2">
                NEON_SNAKE.EXE
              </h3>
              <p className="text-[10px] font-mono text-zinc-500 mt-2 tracking-widest uppercase">Press Space to Initialize</p>
            </div>
          )}

          {isPaused && hasStarted && !gameOver && (
            <div className="absolute inset-0 bg-[#0c0c0e]/80 flex items-center justify-center p-6 z-20 text-cyan-400 font-bold text-2xl animate-pulse tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              SYSTEM_PAUSED
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-[#050505]/95 border-2 border-red-900/50 flex flex-col items-center justify-center p-6 text-center z-20">
              <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 mb-2">
                PROTOCOL_FAILED
              </h3>
              <p className="text-zinc-400 mb-6 font-mono text-[10px] uppercase tracking-widest">Final Logs Evaluated</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-transparent border border-zinc-700 text-white font-bold tracking-[0.2em] text-[10px] uppercase rounded hover:bg-white hover:text-black hover:border-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                REBOOT_SYSTEM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
