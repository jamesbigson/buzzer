# BuzzR Deployment Guide

## Quick Start

This is a production-ready build of BuzzR - a real-time buzzer application for interactive game shows and quizzes.

## What's Included

- `dist/` - Complete production build
- `package.json` - Dependencies and scripts
- `package-lock.json` - Exact dependency versions
- `replit.md` - Project documentation

## Deployment Options

### Option 1: Node.js Server (Recommended)

1. **Requirements:**
   - Node.js 18+ 
   - PostgreSQL database (optional - uses in-memory storage by default)

2. **Setup:**
   ```bash
   npm install --production
   npm start
   ```

3. **Environment Variables (Optional):**
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   PORT=5000
   ```

### Option 2: Static Hosting + Serverless

The `dist/public/` folder contains the frontend that can be deployed to:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront

The `dist/index.js` file can be deployed as a serverless function.

### Option 3: Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist/ ./dist/
EXPOSE 5000
CMD ["npm", "start"]
```

## Features

- **Real-time Multiplayer:** WebSocket-based instant communication
- **Room System:** Host creates rooms, players join with codes
- **Accurate Timing:** Server-side timing for fair competition
- **Mobile Responsive:** Works on all devices
- **No Database Required:** Uses in-memory storage (PostgreSQL support available)

## How to Use

1. **Host:** Create a room and share the room code
2. **Players:** Join using the room code
3. **Game:** Host releases buzzers, first to buzz wins
4. **Results:** View chronological rankings

## Technical Details

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express.js + WebSocket
- **Database:** In-memory storage (PostgreSQL optional)
- **Real-time:** WebSocket communication on `/ws` path

## Troubleshooting

- **Port Issues:** Change PORT environment variable
- **WebSocket Issues:** Ensure server supports WebSocket connections
- **Database Issues:** App works without database using in-memory storage

## License

This application is ready for production use.