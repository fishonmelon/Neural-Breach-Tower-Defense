import { GameEngine } from './gameEngine';

const TICK_RATE = 60;
const TICK_INTERVAL = 1000 / TICK_RATE; // ~16.67ms

export class ServerGameLoop {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private lastTick = 0;

  constructor(
    private engine: GameEngine,
    private onTick: (state: ReturnType<GameEngine['getGameState']>) => void
  ) {}

  start(): void {
    if (this.intervalId !== null) return; // already running
    this.lastTick = Date.now();

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - this.lastTick) / 1000; // seconds
      this.lastTick = now;

      this.engine.update(deltaTime);
      this.onTick(this.engine.getGameState());
    }, TICK_INTERVAL);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
