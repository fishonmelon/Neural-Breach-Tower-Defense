export type GameMode = 'single' | 'coop';
export type Difficulty = 'bronze' | 'cobalt' | 'obsidian' | 'singularity' | 'sandbox';

export interface GameConfig {
  difficulty: Difficulty;
  gameMode: GameMode;
  waves: number;
  maxPlayers: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { waves: number | null; multiplier: number }> = {
  bronze:      { waves: 35,   multiplier: 1.0 },
  cobalt:      { waves: 45,   multiplier: 1.0 },
  obsidian:    { waves: 50,   multiplier: 1.0 },
  singularity: { waves: 175,  multiplier: 1.0 },
  sandbox:     { waves: null, multiplier: 1.0 }, // null = endless
};

export const WAVE_COUNTS: Record<Difficulty, number | null> = {
  bronze:      35,
  cobalt:      45,
  obsidian:    50,
  singularity: 175,
  sandbox:     null, // endless
};

export interface Player {
  id: string;
  username: string;
  health: number;
  bits: number;
  lives: number;
  score: number;
  isAlive: boolean;
}

export interface Tower {
  id: string;
  type: string;
  x: number;
  y: number;
  level: number;
  damage: number;
  range: number;
  fireRate: number;
}

export interface Enemy {
  id: string;
  type: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  pathProgress: number;
}

export interface Projectile {
  id: string;
  towerId: string;
  enemyId: string;
  x: number;
  y: number;
  speed: number;
  damage: number;
}

export interface GameState {
  id: string;
  mode: GameMode;
  difficulty: Difficulty;
  /** Total waves for this difficulty. null = endless (sandbox). */
  waveCount: number | null;
  currentWave: number;
  isWaveActive: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  playerHealth: number;
  playerBits: number;
  players: Player[];
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  gameTime: number;
  timestamp: number;
}
