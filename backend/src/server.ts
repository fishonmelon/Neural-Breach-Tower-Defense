import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { GameEngine } from './gameEngine';
import { GameState, DIFFICULTY_CONFIG } from '../../shared/types';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*' },
});

app.use(express.json());

const games = new Map<string, { engine: GameEngine; state: GameState }>();

app.post('/api/game/start', (req, res) => {
  const { gameMode, difficulty } = req.body;
  const gameId = `game-${Date.now()}`;
  const config = DIFFICULTY_CONFIG[difficulty];

  const gameState: GameState = {
    currentWave: 0,
    maxWaves: config.waves,
    isWaveActive: false,
    players: [],
    towers: [],
    enemies: [],
    difficulty,
    gameMode,
    isPaused: false,
    gameTime: 0,
  };

  const engine = new GameEngine(gameState);
  games.set(gameId, { engine, state: gameState });

  res.json({ gameId, config });
});

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('join-game', (gameId: string) => {
    socket.join(gameId);
    const game = games.get(gameId);
    if (game) {
      socket.emit('game-state', game.state);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});