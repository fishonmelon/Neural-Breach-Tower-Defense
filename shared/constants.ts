// Game Constants
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const GRID_SIZE = 40; // 40x40 pixel grid for tower placement
export const FPS = 60;
export const FRAME_TIME = 1000 / FPS; // ~16.67ms per frame

// Game Balance
export const INITIAL_GOLD = 500;
export const INITIAL_HEALTH = 100;
export const GOLD_PER_KILL = 50;

// Tower Constants
export const TOWER_RADIUS_MULTIPLIER = 1.5; // Visual radius = range * this
export const MAX_TOWER_LEVEL = 5;

// Enemy Constants
export const BASE_ENEMY_SPEED = 100; // pixels per second
export const HEALTH_PENALTY_PER_ENEMY = 1; // Health lost when enemy reaches end

// Difficulty Modifiers
export const DIFFICULTY_MODIFIERS = {
  bronze: { enemySpeedMultiplier: 0.8, enemyHealthMultiplier: 0.9, goldMultiplier: 1.2 },
  cobalt: { enemySpeedMultiplier: 1.0, enemyHealthMultiplier: 1.0, goldMultiplier: 1.0 },
  obsidian: { enemySpeedMultiplier: 1.2, enemyHealthMultiplier: 1.3, goldMultiplier: 0.8 },
  singularity: { enemySpeedMultiplier: 1.5, enemyHealthMultiplier: 1.8, goldMultiplier: 0.6 },
};