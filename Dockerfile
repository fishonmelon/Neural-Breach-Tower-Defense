FROM node:20-alpine

WORKDIR /app

# Copy shared
COPY shared/ ./shared/

# Copy backend
COPY backend/package.json ./backend/
COPY backend/tsconfig.json ./backend/
COPY backend/src/ ./backend/src/

# Copy root workspace config
COPY package.json ./

# Install & build
RUN npm install
WORKDIR /app/backend
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
