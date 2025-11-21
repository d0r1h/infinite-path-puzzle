import { Position, Cell, DifficultyConfig, Direction } from '../types';

/**
 * PathGenerator - Procedurally generates non-intersecting paths for the puzzle
 * 
 * This class implements various path generation algorithms:
 * - Spiral: Creates a spiral pattern from outside to inside
 * - Serpentine: Snake-like pattern going back and forth
 * - Hamiltonian: Attempts to visit every cell exactly once
 */

export class PathGenerator {
    private size: number;

    constructor(size: number) {
        this.size = size;
    }

    /**
     * Generate a path based on the difficulty configuration
     */
    generatePath(pattern: DifficultyConfig['pathPattern']): Position[] {
        switch (pattern) {
            case 'spiral':
                return this.generateSpiral();
            case 'serpentine':
                return this.generateSerpentine();
            case 'zigzag':
                return this.generateZigZag();
            case 'random':
                return this.generateRandomWalk();
            default:
                return this.generateSpiral();
        }
    }

    /**
     * Generate a spiral path from outside to inside
     */
    private generateSpiral(): Position[] {
        const path: Position[] = [];
        let top = 0, bottom = this.size - 1;
        let left = 0, right = this.size - 1;

        while (top <= bottom && left <= right) {
            // Move right
            for (let col = left; col <= right; col++) {
                path.push({ row: top, col });
            }
            top++;

            // Move down
            for (let row = top; row <= bottom; row++) {
                path.push({ row, col: right });
            }
            right--;

            // Move left
            if (top <= bottom) {
                for (let col = right; col >= left; col--) {
                    path.push({ row: bottom, col });
                }
                bottom--;
            }

            // Move up
            if (left <= right) {
                for (let row = bottom; row >= top; row--) {
                    path.push({ row, col: left });
                }
                left++;
            }
        }

        return path;
    }

    /**
     * Generate a serpentine (snake) path
     */
    private generateSerpentine(): Position[] {
        const path: Position[] = [];

        for (let row = 0; row < this.size; row++) {
            if (row % 2 === 0) {
                // Move right
                for (let col = 0; col < this.size; col++) {
                    path.push({ row, col });
                }
            } else {
                // Move left
                for (let col = this.size - 1; col >= 0; col--) {
                    path.push({ row, col });
                }
            }
        }

        return path;
    }

    /**
     * Generate a zigzag path
     */
    private generateZigZag(): Position[] {
        const path: Position[] = [];

        for (let col = 0; col < this.size; col++) {
            if (col % 2 === 0) {
                // Move down
                for (let row = 0; row < this.size; row++) {
                    path.push({ row, col });
                }
            } else {
                // Move up
                for (let row = this.size - 1; row >= 0; row--) {
                    path.push({ row, col });
                }
            }
        }

        return path;
    }

    /**
     * Generate a random walk path using backtracking
     * This creates a Hamiltonian-like path that visits many cells
     */
    private generateRandomWalk(): Position[] {
        const visited = Array(this.size).fill(null).map(() => Array(this.size).fill(false));
        const path: Position[] = [];

        // Start from a random position
        const startRow = Math.floor(Math.random() * this.size);
        const startCol = Math.floor(Math.random() * this.size);

        this.randomWalkHelper(startRow, startCol, visited, path);

        // If the path is too short, fall back to spiral
        if (path.length < this.size * this.size * 0.7) {
            return this.generateSpiral();
        }

        return path;
    }

    /**
     * Recursive helper for random walk with backtracking
     */
    private randomWalkHelper(
        row: number,
        col: number,
        visited: boolean[][],
        path: Position[]
    ): boolean {
        // Check bounds
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return false;
        }

        // Check if already visited
        if (visited[row][col]) {
            return false;
        }

        // Mark as visited and add to path
        visited[row][col] = true;
        path.push({ row, col });

        // If we've visited enough cells, we're done
        const targetCells = Math.floor(this.size * this.size * 0.8);
        if (path.length >= targetCells) {
            return true;
        }

        // Try all four directions in random order
        const directions: Direction[] = ['up', 'down', 'left', 'right'];
        this.shuffleArray(directions);

        for (const dir of directions) {
            let newRow = row;
            let newCol = col;

            switch (dir) {
                case 'up': newRow--; break;
                case 'down': newRow++; break;
                case 'left': newCol--; break;
                case 'right': newCol++; break;
            }

            if (this.randomWalkHelper(newRow, newCol, visited, path)) {
                return true;
            }
        }

        // Backtrack if no valid moves (but keep the cell in the path)
        return path.length >= targetCells;
    }

    /**
     * Shuffle an array in place (Fisher-Yates algorithm)
     */
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Place waypoints evenly along the path
     */
    static placeWaypoints(path: Position[], count: number): Map<number, Position> {
        const waypoints = new Map<number, Position>();

        if (path.length === 0 || count === 0) {
            return waypoints;
        }

        // Ensure we don't try to place more waypoints than path cells
        const actualCount = Math.min(count, path.length);
        const step = Math.floor(path.length / actualCount);

        for (let i = 0; i < actualCount; i++) {
            const index = Math.min(i * step, path.length - 1);
            waypoints.set(i + 1, path[index]);
        }

        return waypoints;
    }

    /**
     * Create a grid with the given path marked
     */
    static createGrid(size: number, path: Position[]): Cell[][] {
        const grid: Cell[][] = [];

        // Initialize empty grid
        for (let row = 0; row < size; row++) {
            grid[row] = [];
            for (let col = 0; col < size; col++) {
                grid[row][col] = {
                    position: { row, col },
                    isPath: false,
                    isVisited: false,
                };
            }
        }

        // Mark path cells
        for (const pos of path) {
            if (pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size) {
                grid[pos.row][pos.col].isPath = true;
            }
        }

        return grid;
    }
}

/**
 * Get difficulty configuration for a given stage
 * Modified to keep grids minimal (max 8x8) but increase difficulty through waypoints and patterns
 */
export function getDifficultyForStage(stage: number): DifficultyConfig {
    // Grid size progression - cap at 8x8 for better UX
    let gridSize = 6;
    if (stage >= 4 && stage <= 8) gridSize = 7;
    else if (stage >= 9) gridSize = 8; // Cap at 8x8

    // Waypoint count - increase more aggressively for difficulty
    let waypointCount = 6;
    if (stage >= 3) waypointCount = 8;
    if (stage >= 5) waypointCount = 10;
    if (stage >= 8) waypointCount = 12;
    if (stage >= 12) waypointCount = 14;
    if (stage >= 16) waypointCount = 16;
    if (stage >= 20) waypointCount = 18;
    if (stage >= 25) waypointCount = 20;

    // Path pattern - rotate through patterns for variety
    let pathPattern: DifficultyConfig['pathPattern'] = 'spiral';
    if (stage >= 3) pathPattern = 'serpentine';
    if (stage >= 5) pathPattern = 'zigzag';
    if (stage >= 8) pathPattern = 'random';

    // Cycle patterns for variety in later stages
    if (stage >= 12) {
        const patterns: DifficultyConfig['pathPattern'][] = ['spiral', 'serpentine', 'zigzag', 'random'];
        pathPattern = patterns[stage % 4];
    }

    // Obstacles (future feature)
    const hasObstacles = stage >= 15;

    return {
        gridSize,
        waypointCount,
        pathPattern,
        hasObstacles,
    };
}
