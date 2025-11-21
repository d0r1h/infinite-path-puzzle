import React, { useState, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { StageInfo } from './components/StageInfo';
import { Confetti } from './components/Confetti';
import { useGame } from './hooks/useGame';
import { Position } from './types';

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
        getHint,
    } = useGame();

    const [hintCells, setHintCells] = useState<Position[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleHintClick = () => {
        const hints = getHint();
        setHintCells(hints);

        // Clear hints after 2 seconds
        setTimeout(() => {
            setHintCells([]);
        }, 2000);
    };

    // Trigger confetti when level is complete
    useEffect(() => {
        if (gameState.isComplete) {
            setShowConfetti(true);
            // Hide confetti after 4 seconds
            setTimeout(() => {
                setShowConfetti(false);
            }, 4000);
        }
    }, [gameState.isComplete]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            {/* Confetti celebration */}
            {showConfetti && <Confetti />}
            {/* Header */}
            <header className="mb-6">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mb-2">
                    Infinite Path Puzzle
                </h1>
                <p className="text-gray-400 text-center text-sm">
                    Draw. Connect. Conquer. • Master the infinite maze!
                </p>
            </header>

            {/* Stage Info */}
            <StageInfo gameState={gameState} />

            {/* Game Board */}
            <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 mb-6">
                <GameBoard
                    gameState={gameState}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    hintCells={hintCells}
                />
            </div>

            {/* Controls */}
            <Controls
                onUndo={handleUndo}
                onRestart={handleRestart}
                onHint={handleHintClick}
                onNextLevel={handleNextLevel}
                canUndo={gameState.playerPath.length > 0}
                isComplete={gameState.isComplete}
            />

            {/* Instructions */}
            <div className="mt-8 max-w-md text-center">
                <details className="bg-gray-800 rounded-xl p-4 cursor-pointer">
                    <summary className="text-white font-semibold mb-2">
                        How to Play
                    </summary>
                    <div className="text-gray-300 text-sm space-y-2 text-left">
                        <p>🎯 <strong>Goal:</strong> Connect all numbered dots in order (1→2→3...) by drawing a path.</p>
                        <p>✏️ <strong>Draw:</strong> Click/tap and drag to draw your path through the grid.</p>
                        <p>↩️ <strong>Backtrack:</strong> Drag backwards over your path to undo moves - no button needed!</p>
                        <p>📍 <strong>Rules:</strong> You must hit each numbered waypoint in sequence.</p>
                        <p>✅ <strong>Win:</strong> Complete the level by hitting all waypoints in order.</p>
                        <p>💡 <strong>Hint:</strong> Shows you the next valid cells to help you progress.</p>
                        <p>🎮 <strong>Difficulty:</strong> Grids get larger and patterns get more complex as you advance!</p>
                    </div>
                </details>
            </div>

            {/* Footer */}
            <footer className="mt-8 text-gray-500 text-xs text-center">
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
