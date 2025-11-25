import { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { StageInfo } from './components/StageInfo';
import { Confetti } from './components/Confetti';
import { Timer } from './components/Timer';
import { useGame } from './hooks/useGame';

/**
 * Main App Component
 * Orchestrates the entire game UI and logic
 */
function App() {
    const {
        gameState,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleUndo,
        handleRestart,
        handleNextLevel,
    } = useGame();

    const [showConfetti, setShowConfetti] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);



    // Trigger confetti when level is complete and stop timer
    useEffect(() => {
        if (gameState.isComplete) {
            setShowConfetti(true);
            setIsTimerRunning(false);
            // Hide confetti after 4 seconds
            setTimeout(() => {
                setShowConfetti(false);
            }, 4000);
        }
    }, [gameState.isComplete]);

    // Reset timer when stage changes
    useEffect(() => {
        setTimerKey((prev) => prev + 1);
        setIsTimerRunning(true);
    }, [gameState.stage]);

    const handleRestartWithTimer = () => {
        handleRestart();
        setTimerKey((prev) => prev + 1);
        setIsTimerRunning(true);
    };

    const handleNextLevelWithTimer = () => {
        handleNextLevel();
        setTimerKey((prev) => prev + 1);
        setIsTimerRunning(true);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            {/* Confetti celebration */}
            {showConfetti && <Confetti />}
            {/* Header */}
            <header className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mb-1">
                    Infinite Path Puzzle
                </h1>
                <p className="text-gray-400 text-center text-xs">
                    Draw. Connect. Conquer. • Master the infinite maze!
                </p>
            </header>

            {/* Stage Info */}
            <StageInfo gameState={gameState} />

            {/* Game Board */}
            <div className="bg-gray-800 rounded-xl shadow-2xl p-2 sm:p-3 mb-2 sm:mb-3 w-full max-w-xl">
                {/* Timer */}
                <Timer key={timerKey} isRunning={isTimerRunning} />

                <GameBoard
                    gameState={gameState}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                />
            </div>

            {/* Controls */}
            <Controls
                onUndo={handleUndo}
                onRestart={handleRestartWithTimer}
                onNextLevel={handleNextLevelWithTimer}
                canUndo={gameState.playerPath.length > 0}
                isComplete={gameState.isComplete}
            />

            {/* Instructions */}
            <div className="mt-2 sm:mt-3 max-w-md text-center px-2">
                <details className="bg-gray-800 rounded-lg p-2 sm:p-3 cursor-pointer">
                    <summary className="text-white font-semibold text-xs sm:text-sm mb-1">
                        How to Play
                    </summary>
                    <div className="text-gray-300 text-xs space-y-1 text-left">
                        <p>🎯 <strong>Goal:</strong> Connect all numbered dots in order (1→2→3...) by drawing a path.</p>
                        <p>✏️ <strong>Draw:</strong> Click/tap and drag to draw your path through the grid.</p>
                        <p>↩️ <strong>Backtrack:</strong> Drag backwards over your path to undo moves - no button needed!</p>
                        <p>📍 <strong>Rules:</strong> You must hit each numbered waypoint in sequence.</p>
                        <p>✅ <strong>Win:</strong> Complete the level by hitting all waypoints in order.</p>
                        <p className="hidden sm:block">🎮 <strong>Difficulty:</strong> Grids get larger and patterns get more complex as you advance!</p>
                    </div>
                </details>
            </div>

            {/* Footer */}
            <footer className="mt-2 sm:mt-3 text-gray-500 text-xs text-center px-2">
                <div>
                    © 2025 Infinite Path Puzzle — A product by{' '}
                    <a
                        href="https://x.com/d0r1h"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors underline"
                    >
                        Pawan
                    </a>
                    . All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default App;
