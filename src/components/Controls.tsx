import React from 'react';

interface ControlsProps {
    onUndo: () => void;
    onRestart: () => void;
    onHint: () => void;
    onNextLevel: () => void;
    canUndo: boolean;
    isComplete: boolean;
}

/**
 * Controls Component
 * Provides game control buttons with premium styling
 */
export const Controls: React.FC<ControlsProps> = ({
    onUndo,
    onRestart,
    onHint,
    onNextLevel,
    canUndo,
    isComplete,
}) => {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center p-2 sm:p-4">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-200 ${canUndo
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 hover:shadow-lg hover:scale-105'
                        : 'bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
            >
                ↶ Undo
            </button>

            <button
                onClick={onRestart}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
                ⟲ Restart
            </button>

            <button
                onClick={onHint}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold text-white text-sm sm:text-base bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
                💡 Hint
            </button>

            {isComplete && (
                <button
                    onClick={onNextLevel}
                    className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-white text-sm sm:text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-xl hover:scale-110 transition-all duration-200 animate-pulse"
                >
                    ➜ Next Level
                </button>
            )}
        </div>
    );
};
