import { useState, useCallback, useEffect } from 'react';
import { GameState, Position } from '../types';
import { PathGenerator, getDifficultyForStage } from '../logic/PathGenerator';

const STORAGE_KEY = 'infinite-path-puzzle-stage';

/**
 * Load saved stage from localStorage
 */
function loadSavedStage(): number {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const stage = parseInt(saved, 10);
            return stage > 0 ? stage : 1;
        }
    } catch (error) {
        console.error('Failed to load saved stage:', error);
    }
    return 1;
}

/**
 * Save current stage to localStorage
 */
function saveStage(stage: number): void {
    try {
        localStorage.setItem(STORAGE_KEY, stage.toString());
    } catch (error) {
        console.error('Failed to save stage:', error);
    }
}

/**
 * Custom hook for managing game state
 * Handles level generation, player input, validation, and progression
 */
export function useGame() {
    const [gameState, setGameState] = useState<GameState>(() => initializeLevel(loadSavedStage()));
    const [isDragging, setIsDragging] = useState(false);

    // Save stage whenever it changes
    useEffect(() => {
        saveStage(gameState.stage);
    }, [gameState.stage]);

    /**
     * Initialize a new level based on stage number
     */
    function initializeLevel(stage: number): GameState {
        const difficulty = getDifficultyForStage(stage);
        const generator = new PathGenerator(difficulty.gridSize);
        const path = generator.generatePath(difficulty.pathPattern);
        const waypoints = PathGenerator.placeWaypoints(path, difficulty.waypointCount);

        // Generate blockers for stages 5+
        const blockedCells = PathGenerator.generateBlockers(
            path,
            waypoints,
            difficulty.blockerCount
        );

        console.log('🔴 Blocker Debug:', {
            stage,
            blockerCount: difficulty.blockerCount,
            generatedBlockers: blockedCells.length,
            blockerPositions: blockedCells.map(p => `(${p.row},${p.col})`),
            waypointPositions: Array.from(waypoints.values()).map(p => `(${p.row},${p.col})`)
        });

        const grid = PathGenerator.createGrid(difficulty.gridSize, path, blockedCells);

        // Add waypoints to grid cells and ensure they're not blocked
        waypoints.forEach((pos, waypointNum) => {
            if (grid[pos.row] && grid[pos.row][pos.col]) {
                const wasBlocked = grid[pos.row][pos.col].isBlocked;
                grid[pos.row][pos.col].waypoint = waypointNum;
                grid[pos.row][pos.col].isBlocked = false; // Ensure waypoints are never blocked

                if (wasBlocked) {
                    console.warn(`⚠️ Waypoint ${waypointNum} at (${pos.row},${pos.col}) was blocked - now cleared`);
                }
            }
        });

        return {
            grid,
            gridSize: difficulty.gridSize,
            path,
            waypoints,
            playerPath: [],
            currentWaypoint: 1,
            stage,
            isComplete: false,
            difficulty,
        };
    }

    /**
     * Check if two positions are the same
     */
    const isSamePosition = (pos1: Position, pos2: Position): boolean => {
        return pos1.row === pos2.row && pos1.col === pos2.col;
    };

    /**
     * Check if two positions are adjacent (for path continuity)
     */
    const areAdjacent = (pos1: Position, pos2: Position): boolean => {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    };

    /**
     * Handle cell selection (mouse/touch)
     * Now supports backtracking by dragging backwards over visited cells
     */
    const handleCellSelect = useCallback((position: Position) => {
        setGameState((prev) => {
            // Don't allow moves if game is complete
            if (prev.isComplete) return prev;

            const cell = prev.grid[position.row][position.col];

            // Cell must be on the path and not blocked
            if (!cell.isPath || cell.isBlocked) return prev;

            // If this is the first cell, just add it
            if (prev.playerPath.length === 0) {
                const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));
                newGrid[position.row][position.col].isVisited = true;

                // Check if this cell has the first waypoint
                let newCurrentWaypoint = prev.currentWaypoint;
                if (cell.waypoint === prev.currentWaypoint) {
                    newCurrentWaypoint++;
                }

                // Check if level is complete (all waypoints hit)
                const isComplete = newCurrentWaypoint > prev.waypoints.size;

                return {
                    ...prev,
                    grid: newGrid,
                    playerPath: [position],
                    currentWaypoint: newCurrentWaypoint,
                    isComplete,
                };
            }

            // BACKTRACKING: Check if cell is already in the path
            const visitedIndex = prev.playerPath.findIndex(p => isSamePosition(p, position));

            if (visitedIndex !== -1) {
                // Cell is already visited - check if it's adjacent to current position
                const lastPosition = prev.playerPath[prev.playerPath.length - 1];

                // If we're dragging back to an adjacent cell that's already in the path,
                // remove all cells after it (backtrack)
                if (areAdjacent(lastPosition, position) && visitedIndex < prev.playerPath.length - 1) {
                    // Backtrack: keep path up to and including this cell
                    const newPlayerPath = prev.playerPath.slice(0, visitedIndex + 1);
                    const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));

                    // Reset all visited states
                    newGrid.forEach(row => row.forEach(cell => cell.isVisited = false));

                    // Mark cells in new player path as visited
                    newPlayerPath.forEach(pos => {
                        newGrid[pos.row][pos.col].isVisited = true;
                    });

                    // Recalculate current waypoint
                    let newCurrentWaypoint = 1;
                    for (const pos of newPlayerPath) {
                        const pathCell = newGrid[pos.row][pos.col];
                        if (pathCell.waypoint === newCurrentWaypoint) {
                            newCurrentWaypoint++;
                        }
                    }

                    return {
                        ...prev,
                        grid: newGrid,
                        playerPath: newPlayerPath,
                        currentWaypoint: newCurrentWaypoint,
                        isComplete: false,
                    };
                }

                // If it's the same cell we're already on, ignore
                return prev;
            }

            // Check if cell is adjacent to the last cell in player path
            const lastPosition = prev.playerPath[prev.playerPath.length - 1];
            if (!areAdjacent(lastPosition, position)) return prev;

            // Valid move - add to path
            const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));
            newGrid[position.row][position.col].isVisited = true;

            const newPlayerPath = [...prev.playerPath, position];
            let newCurrentWaypoint = prev.currentWaypoint;

            // Check if this cell has the next waypoint
            if (cell.waypoint === prev.currentWaypoint) {
                newCurrentWaypoint++;
            }

            // Win condition - only check if all waypoints are hit
            const isComplete = newCurrentWaypoint > prev.waypoints.size;

            return {
                ...prev,
                grid: newGrid,
                playerPath: newPlayerPath,
                currentWaypoint: newCurrentWaypoint,
                isComplete,
            };
        });
    }, []);

    /**
     * Start dragging
     */
    const handleDragStart = useCallback((position: Position) => {
        setIsDragging(true);
        handleCellSelect(position);
    }, [handleCellSelect]);

    /**
     * Continue dragging
     */
    const handleDragMove = useCallback((position: Position) => {
        if (isDragging) {
            handleCellSelect(position);
        }
    }, [isDragging, handleCellSelect]);

    /**
     * End dragging
     */
    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    /**
     * Undo last move
     */
    const handleUndo = useCallback(() => {
        setGameState((prev) => {
            if (prev.playerPath.length === 0) return prev;

            const newPlayerPath = prev.playerPath.slice(0, -1);
            const newGrid = prev.grid.map(row => row.map(c => ({ ...c })));

            // Reset all visited states
            newGrid.forEach(row => row.forEach(cell => cell.isVisited = false));

            // Mark cells in new player path as visited
            newPlayerPath.forEach(pos => {
                newGrid[pos.row][pos.col].isVisited = true;
            });

            // Recalculate current waypoint
            let newCurrentWaypoint = 1;
            for (const pos of newPlayerPath) {
                const cell = newGrid[pos.row][pos.col];
                if (cell.waypoint === newCurrentWaypoint) {
                    newCurrentWaypoint++;
                }
            }

            return {
                ...prev,
                grid: newGrid,
                playerPath: newPlayerPath,
                currentWaypoint: newCurrentWaypoint,
                isComplete: false,
            };
        });
    }, []);

    /**
     * Restart current level
     */
    const handleRestart = useCallback(() => {
        setGameState(initializeLevel(gameState.stage));
    }, [gameState.stage]);

    /**
     * Go to next level
     */
    const handleNextLevel = useCallback(() => {
        setGameState(initializeLevel(gameState.stage + 1));
    }, [gameState.stage]);

    /**
     * Get hint (highlight next valid cells)
     */
    const getHint = useCallback((): Position[] => {
        if (gameState.playerPath.length === 0) {
            // Hint: show the first few cells of the path
            return gameState.path.slice(0, 3);
        }

        const lastPos = gameState.playerPath[gameState.playerPath.length - 1];
        const nextPathCells: Position[] = [];

        // Find adjacent path cells that haven't been visited
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
        ];

        for (const dir of directions) {
            const newRow = lastPos.row + dir.row;
            const newCol = lastPos.col + dir.col;

            if (newRow >= 0 && newRow < gameState.gridSize &&
                newCol >= 0 && newCol < gameState.gridSize) {
                const cell = gameState.grid[newRow][newCol];
                if (cell.isPath && !cell.isVisited) {
                    nextPathCells.push({ row: newRow, col: newCol });
                }
            }
        }

        return nextPathCells;
    }, [gameState]);

    return {
        gameState,
        isDragging,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        handleUndo,
        handleRestart,
        handleNextLevel,
        getHint,
    };
}
