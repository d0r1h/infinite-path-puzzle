/**
 * Core types for the Infinite Path Puzzle game
 */

export interface Position {
    row: number;
    col: number;
}

export interface Cell {
    position: Position;
    isPath: boolean;
    isVisited: boolean;
    waypoint?: number; // If this cell has a numbered waypoint
    isBlocked?: boolean; // If this cell is blocked and cannot be visited
}

export interface GameState {
    grid: Cell[][];
    gridSize: number;
    path: Position[]; // The correct path through the grid
    waypoints: Map<number, Position>; // Map of waypoint number to position
    playerPath: Position[]; // The path the player has drawn
    currentWaypoint: number; // Next waypoint the player needs to hit
    stage: number;
    isComplete: boolean;
    difficulty: DifficultyConfig;
}

export interface DifficultyConfig {
    gridSize: number;
    waypointCount: number;
    pathPattern: 'spiral' | 'serpentine' | 'zigzag' | 'random';
    hasObstacles: boolean;
    blockerCount: number; // Number of blocked cells
}

export type Direction = 'up' | 'down' | 'left' | 'right';
