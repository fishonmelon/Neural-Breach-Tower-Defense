export class GameLoop {
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private deltaTime = 0;
  private targetFPS = 60;
  private frameTime = 1000 / this.targetFPS;

  constructor(private onTick: (deltaTime: number) => void) {}

  start(): void {
    const tick = (currentTime: number) => {
      if (this.lastFrameTime === 0) {
        this.lastFrameTime = currentTime;
      }

      this.deltaTime = currentTime - this.lastFrameTime;

      if (this.deltaTime >= this.frameTime) {
        this.onTick(this.deltaTime / 1000); // Convert to seconds
        this.lastFrameTime = currentTime;
      }

      this.animationFrameId = requestAnimationFrame(tick);
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  getDeltaTime(): number {
    return this.deltaTime / 1000;
  }
}