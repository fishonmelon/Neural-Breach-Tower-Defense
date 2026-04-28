import { GameState, Difficulty, GameMode, WAVE_COUNTS, Player, Enemy, Tower, Projectile } from './types';
import { INITIAL_BITS, INITIAL_HEALTH, DIFFICULTY_MODIFIERS } from './constants';

/**
 * Initialize a new game state
 */
export function createGameState(
  id: string,
  mode: GameMode,
  difficulty: Difficulty,
  players: Player[]
): GameState {
  return {
    id,
    mode,
    difficulty,
    waveCount: WAVE_COUNTS[difficulty],
    currentWave: 0,
    isWaveActive: false,
    isPaused: false,
    isGameOver: false,
    playerHealth: INITIAL_HEALTH,
    playerBits: INITIAL_GOLD,
    players,
    towers: [],
    enemies: [],
    projectiles: [],
    gameTime: 0,
    timestamp: Date.now(),
  };
}

/**
 * Create a new player
 */
export function createPlayer(id: string, username: string): Player {
  return {
    id,
    username,
    bits: INITIAL_BITS,
    health: INITIAL_HEALTH,
    lives: 3,
    score: 0,
    isAlive: true,
  };
}

/**
 * Get difficulty modifier for current difficulty
 */
export function getDifficultyModifier(difficulty: Difficulty) {
  return DIFFICULTY_MODIFIERS[difficulty as keyof typeof DIFFICULTY_MODIFIERS];
}

/**
 * Check if game is over
 */
export function isGameOver(state: GameState): boolean {
  return state.playerHealth <= 0 || state.isGameOver;
}

/**
 * Check if all waves are complete
 */
export function isWaveComplete(state: GameState): boolean {
  const waveCount = state.waveCount;

  // Sandbox mode never ends
  if (waveCount === null) return false;

  // Check if current wave exceeds total wave count
  return state.currentWave > waveCount;
}

/**
 * Get wave progress percentage
 */
export function getWaveProgress(state: GameState): number {
  if (state.waveCount === null) return 0; // Sandbox
  return (state.currentWave / state.waveCount) * 100;
}nt) * 100;
}
