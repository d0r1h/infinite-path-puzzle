import React, { useState, useEffect } from 'react';

interface TimerProps {
    isRunning: boolean;
    onReset?: () => void;
}

/**
 * Timer Component
 * Displays elapsed time for the current level
 */
export const Timer: React.FC<TimerProps> = ({ isRunning }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: number | null = null;

        if (isRunning) {
            interval = window.setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);

    // Format time as MM:SS
    const formatTime = (totalSeconds: number): string => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center justify-center gap-2 bg-gray-700 rounded-lg px-3 py-2 mb-2">
            <span className="text-gray-400 text-xs">⏱️ Time:</span>
            <span className="text-white text-sm font-mono font-bold">
                {formatTime(seconds)}
            </span>
        </div>
    );
};

