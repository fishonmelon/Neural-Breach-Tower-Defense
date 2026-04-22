# Neural Breach Tower Defense 🎮

A cooperative and single-player tower defense web game built with modern web technologies.

## Features
- **Game Modes:**
  - Single Player
  - Co-op (Real-time multiplayer)
  
- **Difficulties:**
  - 🥉 Bronze (Easy) - 35 waves
  - 🔷 Cobalt (Medium) - 45 waves
  - ⬛ Obsidian (Hard) - 50 waves
  - ∞ Singularity (Endless) - 175 waves
  - 🎨 Sandbox (Creative)

## Tech Stack
- **Frontend:** Svelte + SvelteKit + TypeScript + Canvas/PixiJS
- **Backend:** Node.js + Express + Socket.io
- **Database:** MongoDB
- **Assets:** Cloudinary
- **Deployment:** Render + GitHub

## Project Structure
```
Neural-Breach-Tower-Defense/
├── frontend/          # Svelte app
├── backend/           # Node.js server
├── shared/            # Shared types & constants
└── README.md
```

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Run frontend: `npm run dev -w frontend`
4. Run backend: `npm run dev -w backend`

## Game Loop
- 60 FPS game tick
- Wave-based progression
- Real-time player synchronization
- Tower placement & upgrade system

---
Made with ❤️ by fishonmelon
