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
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-2xl mb-4 sm:mb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Stage {gameState.stage}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        {gameState.difficulty.gridSize}×{gameState.difficulty.gridSize} Grid • {gameState.difficulty.pathPattern} pattern
                    </p>
                </div>

                {gameState.isComplete && (
                    <div className="text-green-400 text-lg sm:text-2xl font-bold animate-bounce">
                        ✓ Complete!
                    </div>
                )}
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-gray-700 rounded-lg p-2 sm:p-3">
                    <div className="text-gray-400 text-xs mb-1">Cells Filled</div>
                    <div className="text-white text-lg sm:text-xl font-bold">
                        {visitedCells} / {totalCells}
                    </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-2 sm:p-3">
                    <div className="text-gray-400 text-xs mb-1">Waypoints</div>
                    <div className="text-white text-lg sm:text-xl font-bold">
                        {hitWaypoints} / {totalWaypoints}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
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
