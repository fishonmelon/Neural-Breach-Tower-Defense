import type { GameState } from '$shared/types';

export class ClientGameLoop {
  private animationFrameId: number | null = null;
  private latestState: GameState | null = null;

  constructor(private onRender: (state: GameState) => void) {}

  /** Called by the socket 'game_state_update' listener */
  updateState(state: GameState): void {
    this.latestState = state;
  }

  start(): void {
    const frame = () => {
      if (this.latestState) {
        this.onRender(this.latestState);
      }
      this.animationFrameId = requestAnimationFrame(frame);
    };
    this.animationFrameId = requestAnimationFrame(frame);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
}
