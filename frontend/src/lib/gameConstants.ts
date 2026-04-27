import { DIFFICULTY_CONFIG } from '$shared/types';

export const GAME_CANVAS_WIDTH = 800;
export const GAME_CANVAS_HEIGHT = 600;
export const GRID_SIZE = 40;

export const GRID_COLS = Math.floor(GAME_CANVAS_WIDTH / GRID_SIZE);
export const GRID_ROWS = Math.floor(GAME_CANVAS_HEIGHT / GRID_SIZE);

export const WAVE_DELAY = 3000; // ms between waves
export const GAME_TICK_RATE = 60; // FPS

export const DIFFICULTY_LABELS: Record<string, string> = {
  bronze: 'Bronze (Easy)',
  cobalt: 'Cobalt (Medium)',
  obsidian: 'Obsidian (Hard)',
  singularity: 'Singularity (Endless)',
  sandbox: 'Sandbox (Creative)',
};

export { DIFFICULTY_CONFIG };
