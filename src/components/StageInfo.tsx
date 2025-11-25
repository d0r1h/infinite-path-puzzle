import React from 'react';
import { GameState } from '../types';

interface StageInfoProps {
    gameState: GameState;
}

/**
 * StageInfo Component
 * Displays current stage information and progress
 */
export const StageInfo: React.FC<StageInfoProps> = ({ gameState }) => {
    const totalCells = gameState.path.length;
    const visitedCells = gameState.playerPath.length;
    const progress = totalCells > 0 ? (visitedCells / totalCells) * 100 : 0;

    const totalWaypoints = gameState.waypoints.size;
    const hitWaypoints = gameState.currentWaypoint - 1;

    return (
        <div className="w-full max-w-xl mx-auto p-2 sm:p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-2xl mb-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                        Stage {gameState.stage}
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                        {gameState.difficulty.gridSize}×{gameState.difficulty.gridSize} Grid • {gameState.difficulty.pathPattern} pattern
                    </p>
                </div>

                {gameState.isComplete && (
                    <div className="text-green-400 text-base sm:text-lg font-bold animate-bounce">
                        ✓ Complete!
                    </div>
                )}
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-gray-700 rounded-lg p-2">
                    <div className="text-gray-400 text-xs mb-1">Cells Filled</div>
                    <div className="text-white text-base sm:text-lg font-bold">
                        {visitedCells} / {totalCells}
                    </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-2">
                    <div className="text-gray-400 text-xs mb-1">Waypoints</div>
                    <div className="text-white text-base sm:text-lg font-bold">
                        {hitWaypoints} / {totalWaypoints}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-right text-gray-400 text-xs mt-1">
                {progress.toFixed(0)}% Complete
            </div>
        </div>
    );
};
