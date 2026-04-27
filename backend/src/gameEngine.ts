import { GameState, Enemy, Tower, DIFFICULTY_CONFIG } from '../../shared/types';

export class GameEngine {
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  startWave(): void {
    const maxWaves = this.gameState.waveCount;
    // waveCount is null for sandbox (endless) — always allow starting
    if (maxWaves === null || this.gameState.currentWave < maxWaves) {
      this.gameState.isWaveActive = true;
      this.gameState.currentWave += 1;
      console.log(`Wave ${this.gameState.currentWave}/${maxWaves ?? '∞'} started!`);
    } else {
      this.endGame();
    }
  }

  endWave(): void {
    this.gameState.isWaveActive = false;
    const maxWaves = this.gameState.waveCount;
    if (maxWaves !== null && this.gameState.currentWave >= maxWaves) {
      this.endGame();
    }
  }

  endGame(): void {
    console.log('Game Over! All waves completed!');
    this.gameState.isWaveActive = false;
    this.gameState.isGameOver = true;
  }

  update(deltaTime: number): void {
    if (this.gameState.isPaused) return;

    this.gameState.gameTime += deltaTime;

    // Update enemies
    this.gameState.enemies.forEach((enemy) => {
      enemy.pathProgress += enemy.speed * deltaTime;
    });

    // Update towers (will add targeting logic later)
    // TODO: Implement tower fire logic

    // Remove dead enemies
    this.gameState.enemies = this.gameState.enemies.filter((e) => e.health > 0);
  }

  addTower(tower: Tower): void {
    this.gameState.towers.push(tower);
  }

  removeTower(towerId: string): void {
    this.gameState.towers = this.gameState.towers.filter((t) => t.id !== towerId);
  }

  spawnEnemy(enemy: Enemy): void {
    this.gameState.enemies.push(enemy);
  }

  damageEnemy(enemyId: string, damage: number): void {
    const enemy = this.gameState.enemies.find((e) => e.id === enemyId);
    if (enemy) {
      enemy.health -= damage;
    }
  }

  getGameState(): GameState {
    return this.gameState;
  }
}
  getGameState(): GameState {
    return this.gameState;
  }
}
