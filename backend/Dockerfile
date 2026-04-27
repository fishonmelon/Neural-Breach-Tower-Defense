FROM node:20-alpine

WORKDIR /app

# Copy shared package first
COPY ../shared ./shared

# Copy backend
COPY package.json tsconfig.json ./
RUN npm install

COPY src/ ./src/
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
