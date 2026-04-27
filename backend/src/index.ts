import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameMode, Difficulty, GameState, Tower } from '../../shared/types';
import { createGameState, createPlayer } from '../../shared/gameUtils';
import { GameEngine } from './gameEngine';
import { ServerGameLoop } from './gameLoop';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// One entry per active game room
interface GameRoom {
  engine: GameEngine;
  loop: ServerGameLoop;
  state: GameState;
}

const rooms = new Map<string, GameRoom>();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // --- Create game ---
  socket.on(
    'create_game',
    (
      data: { username: string; gameMode: GameMode; difficulty: Difficulty },
      callback: (res: { success: boolean; gameId?: string; error?: string }) => void
    ) => {
      try {
        const gameId = uuidv4();
        const player = createPlayer(socket.id, data.username);
        const state = createGameState(gameId, data.gameMode, data.difficulty, [player]);
        const engine = new GameEngine(state);

        const loop = new ServerGameLoop(engine, (updatedState) => {
          io.to(gameId).emit('game_state_update', updatedState);
        });

        rooms.set(gameId, { engine, loop, state });
        socket.join(gameId);
        socket.emit('game_created', { gameId, state });

        console.log(`Game created: ${gameId} by ${data.username}`);
        callback({ success: true, gameId });
      } catch (err) {
        console.error('Error creating game:', err);
        callback({ success: false, error: 'Failed to create game' });
      }
    }
  );

  // --- Join game ---
  socket.on(
    'join_game',
    (
      data: { gameId: string; username: string },
      callback: (res: { success: boolean; state?: GameState; error?: string }) => void
    ) => {
      try {
        const room = rooms.get(data.gameId);
        if (!room) return callback({ success: false, error: 'Game not found' });

        const player = createPlayer(socket.id, data.username);
        room.state.players.push(player);
        socket.join(data.gameId);
        io.to(data.gameId).emit('player_joined', {
          player,
          totalPlayers: room.state.players.length,
        });

        console.log(`${data.username} joined game ${data.gameId}`);
        callback({ success: true, state: room.state });
      } catch (err) {
        console.error('Error joining game:', err);
        callback({ success: false, error: 'Failed to join game' });
      }
    }
  );

  // --- Start game (kicks off the server loop) ---
  socket.on(
    'start_game',
    (
      data: { gameId: string },
      callback: (res: { success: boolean; error?: string }) => void
    ) => {
      try {
        const room = rooms.get(data.gameId);
        if (!room) return callback({ success: false, error: 'Game not found' });

        room.engine.startWave();
        room.loop.start();

        io.to(data.gameId).emit('game_started', { state: room.state });
        console.log(`Game ${data.gameId} started`);
        callback({ success: true });
      } catch (err) {
        console.error('Error starting game:', err);
        callback({ success: false, error: 'Failed to start game' });
      }
    }
  );

  // --- Player places a tower ---
  socket.on('place_tower', (data: { gameId: string; tower: Tower }) => {
    const room = rooms.get(data.gameId);
    if (!room) return;
    room.engine.addTower(data.tower);
  });

  // --- Player removes a tower ---
  socket.on('remove_tower', (data: { gameId: string; towerId: string }) => {
    const room = rooms.get(data.gameId);
    if (!room) return;
    room.engine.removeTower(data.towerId);
  });

  // --- Pause / resume ---
  socket.on('pause_game', (data: { gameId: string }) => {
    const room = rooms.get(data.gameId);
    if (!room) return;
    room.state.isPaused = true;
    io.to(data.gameId).emit('game_paused');
  });

  socket.on('resume_game', (data: { gameId: string }) => {
    const room = rooms.get(data.gameId);
    if (!room) return;
    room.state.isPaused = false;
    io.to(data.gameId).emit('game_resumed');
  });

  // --- Disconnect cleanup ---
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);

    rooms.forEach((room, gameId) => {
      const idx = room.state.players.findIndex((p) => p.id === socket.id);
      if (idx === -1) return;

      room.state.players.splice(idx, 1);
      io.to(gameId).emit('player_left', { playerId: socket.id });

      if (room.state.players.length === 0) {
        room.loop.stop();
        rooms.delete(gameId);
        console.log(`Game ${gameId} cleaned up (empty)`);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🎮 Neural Breach TD server running on port ${PORT}`);
});
