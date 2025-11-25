import React, { useState, useRef } from 'react';
import { GameState, Position } from '../types';

interface GameBoardProps {
    gameState: GameState;
    onDragStart: (position: Position) => void;
    onDragMove: (position: Position) => void;
    onDragEnd: () => void;
}

/**
 * GameBoard Component
 * Renders the puzzle grid with SVG for smooth visuals
 */
export const GameBoard: React.FC<GameBoardProps> = ({
    gameState,
    onDragStart,
    onDragMove,
    onDragEnd,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const cellSize = 45; // Base size for each cell
    const cellGap = 6;
    const cellRadius = 10;
    const boardSize = gameState.gridSize * (cellSize + cellGap) - cellGap;



    /**
     * Get cell position from pointer coordinates
     */
    const getCellFromPointer = (e: React.PointerEvent<SVGSVGElement>): Position | null => {
        if (!svgRef.current) return null;

        const svg = svgRef.current;
        const rect = svg.getBoundingClientRect();

        // Calculate scale factor
        // This maps the client coordinates (relative to the SVG's rendered size)
        // back to the SVG's internal viewBox coordinates.
        const scaleX = boardSize / rect.width;
        const scaleY = boardSize / rect.height;

        // Get coordinates relative to SVG
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        // Calculate which cell the pointer is over
        const col = Math.floor(x / (cellSize + cellGap));
        const row = Math.floor(y / (cellSize + cellGap));

        if (row >= 0 && row < gameState.gridSize && col >= 0 && col < gameState.gridSize) {
            return { row, col };
        }

        return null;
    };

    const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>, row?: number, col?: number) => {
        e.preventDefault();
        setIsDragging(true);

        // If row and col are provided, use them (from direct cell click)
        if (row !== undefined && col !== undefined) {
            onDragStart({ row, col });
        } else {
            // Otherwise, calculate from pointer position
            const cell = getCellFromPointer(e);
            if (cell) {
                onDragStart(cell);
            }
        }
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!isDragging) return;

        e.preventDefault();
        const cell = getCellFromPointer(e);
        if (cell) {
            onDragMove(cell);
        }
    };

    const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
        e.preventDefault();
        setIsDragging(false);
        onDragEnd();
    };

    const handlePointerLeave = (e: React.PointerEvent<SVGSVGElement>) => {
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
            onDragEnd();
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${boardSize} ${boardSize}`}
                className="touch-none select-none w-full h-auto max-w-full"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                style={{ maxHeight: '70vh' }}
            >
                {/* Render grid cells */}
                {gameState.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const x = colIndex * (cellSize + cellGap);
                        const y = rowIndex * (cellSize + cellGap);

                        if (!cell.isPath) return null;

                        return (
                            <g key={`${rowIndex}-${colIndex}`}>
                                {/* Cell background */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={cellSize}
                                    height={cellSize}
                                    rx={cellRadius}
                                    ry={cellRadius}
                                    fill={cell.isBlocked ? '#8B0000' : cell.isVisited ? '#1E90FF' : '#2C3E50'}
                                    className={`transition-all duration-200 ${cell.isVisited ? 'glow' : ''}`}
                                    style={{ cursor: cell.isBlocked ? 'not-allowed' : 'pointer' }}
                                />

                                {/* Blocked cell indicator (X pattern) */}
                                {cell.isBlocked && (
                                    <>
                                        <line
                                            x1={x + 8}
                                            y1={y + 8}
                                            x2={x + cellSize - 8}
                                            y2={y + cellSize - 8}
                                            stroke="#FFFFFF"
                                            strokeWidth={3}
                                            opacity={0.6}
                                        />
                                        <line
                                            x1={x + cellSize - 8}
                                            y1={y + 8}
                                            x2={x + 8}
                                            y2={y + cellSize - 8}
                                            stroke="#FFFFFF"
                                            strokeWidth={3}
                                            opacity={0.6}
                                        />
                                    </>
                                )}

                                {/* Waypoint number */}
                                {cell.waypoint && (
                                    <>
                                        <circle
                                            cx={x + cellSize / 2}
                                            cy={y + cellSize / 2}
                                            r={18}
                                            fill="#000000"
                                            stroke="#FFFFFF"
                                            strokeWidth={2}
                                        />
                                        <text
                                            x={x + cellSize / 2}
                                            y={y + cellSize / 2}
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#FFFFFF"
                                            fontSize="16"
                                            fontWeight="bold"
                                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                                        >
                                            {cell.waypoint}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })
                )}

                {/* Draw connecting lines between visited cells */}
                {gameState.playerPath.length > 1 && (
                    <path
                        d={gameState.playerPath
                            .map((pos, index) => {
                                const x = pos.col * (cellSize + cellGap) + cellSize / 2;
                                const y = pos.row * (cellSize + cellGap) + cellSize / 2;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            })
                            .join(' ')}
                        stroke="#4DA6FF"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ pointerEvents: 'none' }}
                    />
                )}
            </svg>
        </div>
    );
};
