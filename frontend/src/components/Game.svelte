<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { io } from 'socket.io-client';
  import { ClientGameLoop } from '$lib/gameLoop';
  import type { GameState } from '$shared/types';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let loop: ClientGameLoop;
  let gameId: string;

  const socket = io();

  function render(state: GameState) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw enemies, towers, etc. from state
    // e.g. state.enemies.forEach(enemy => drawEnemy(ctx, enemy))
  }

  function startGame() {
    socket.emit(
      'create_game',
      { username: 'fishonmelon', gameMode: 'single', difficulty: 'bronze' },
      ({ success, gameId: id }) => {
        if (!success) return;
        gameId = id;

        loop = new ClientGameLoop(render);

        socket.on('game_state_update', (state: GameState) => {
          loop.updateState(state);
        });

        socket.on('game_started', () => loop.start());

        socket.emit('start_game', { gameId }, () => {
          console.log('Game started!');
        });
      }
    );
  }

  function placeTower(x: number, y: number) {
    socket.emit('place_tower', {
      gameId,
      tower: {
        id: crypto.randomUUID(),
        type: 'basic',
        x,
        y,
        level: 1,
        damage: 10,
        range: 100,
        fireRate: 1,
      },
    });
  }

  onMount(() => {
    ctx = canvas.getContext('2d')!;
  });

  onDestroy(() => {
    loop?.stop();
    socket.disconnect();
  });
</script>

<canvas
  bind:this={canvas}
  width={800}
  height={600}
  on:click={(e) => placeTower(e.offsetX, e.offsetY)}
/>

<button on:click={startGame}>Start Game</button>
