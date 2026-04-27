import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameMode, Difficulty, GameState } from '../../shared/types';
import { createGameState, createPlayer } from '../../shared/gameUtils';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());

// Store active games
const games = new Map<string, GameState>();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new game
  socket.on('create_game', (data: { username: string; gameMode: GameMode; difficulty: Difficulty }, callback) => {
    try {
      const gameId = uuidv4();
      const player = createPlayer(socket.id, data.username);
      const gameState = createGameState(gameId, data.gameMode, data.difficulty, [player]);

      games.set(gameId, gameState);
      socket.join(gameId);
      socket.emit('game_created', { gameId, gameState });
      
      console.log(`Game created: ${gameId} by ${data.username} (${data.gameMode}/${data.difficulty})`);
      callback({ success: true, gameId });
    } catch (error) {
      console.error('Error creating game:', error);
      callback({ success: false, error: 'Failed to create game' });
    }
  });

  // Join an existing game
  socket.on('join_game', (data: { gameId: string; username: string }, callback) => {
    try {
      const gameState = games.get(data.gameId);
      if (!gameState) {
        return callback({ success: false, error: 'Game not found' });
      }

      const player = createPlayer(socket.id, data.username);
      gameState.players.push(player);
      socket.join(data.gameId);
      io.to(data.gameId).emit('player_joined', { player, totalPlayers: gameState.players.length });

      console.log(`Player ${data.username} joined game ${data.gameId}`);
      callback({ success: true, gameState });
    } catch (error) {
      console.error('Error joining game:', error);
      callback({ success: false, error: 'Failed to join game' });
    }
  });

  // Start game
  socket.on('start_game', (data: { gameId: string }, callback) => {
    try {
      const gameState = games.get(data.gameId);
      if (!gameState) {
        return callback({ success: false, error: 'Game not found' });
      }

      gameState.currentWave = 1;
      io.to(data.gameId).emit('game_started', { gameState });
      console.log(`Game ${data.gameId} started`);
      callback({ success: true });
    } catch (error) {
      console.error('Error starting game:', error);
      callback({ success: false, error: 'Failed to start game' });
    }
  });

  // Player disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Clean up player from all games
    games.forEach((gameState, gameId) => {
      const playerIndex = gameState.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        gameState.players.splice(playerIndex, 1);
        io.to(gameId).emit('player_left', { playerId: socket.id });
        
        // Clean up empty games
        if (gameState.players.length === 0) {
          games.delete(gameId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🎮 Neural Breach Tower Defense server running on port ${PORT}`);
});
