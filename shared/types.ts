export type GameMode = 'single' | 'coop';
export type Difficulty = 'bronze' | 'cobalt' | 'obsidian' | 'singularity' | 'sandbox';

export interface GameConfig {
  difficulty: Difficulty;
  gameMode: GameMode;
  waves: number;
  maxPlayers: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { waves: number; multiplier: number }> = {
  bronze: { waves: 35, multiplier: 1 },
  cobalt: { waves: 45, multiplier: 1 },
  obsidian: { waves: 50, multiplier: 1 },
  singularity: { waves: 175, multiplier: 1 },
  sandbox: { waves: 999, multiplier: 1 },
};

export interface Player {
  id: string;
  username: string;
  health: number;
  gold: number;
  lives: number;
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
  waveCount: number | null;
  currentWave: number;
  maxWaves: number;
  isWaveActive: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  playerHealth: number;
  playerGold: number;
  players: Player[];
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  gameTime: number;
  timestamp: number;
}
