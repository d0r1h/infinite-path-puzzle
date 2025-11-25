import React from 'react';

interface ControlsProps {
    onUndo: () => void;
    onRestart: () => void;
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
    onNextLevel,
    canUndo,
    isComplete,
}) => {
    return (
        <div className="flex flex-wrap gap-2 justify-center items-center p-1 sm:p-2">
            <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-white text-xs sm:text-sm transition-all duration-200 ${canUndo
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 hover:shadow-lg hover:scale-105'
                    : 'bg-gray-800 opacity-50 cursor-not-allowed'
                    }`}
            >
                ↶ Undo
            </button>

            <button
                onClick={onRestart}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-white text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
                ⟲ Restart
            </button>



            {isComplete && (
                <button
                    onClick={onNextLevel}
                    className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-xl hover:scale-110 transition-all duration-200 animate-pulse"
                >
                    ➜ Next Level
                </button>
            )}
        </div>
    );
};
