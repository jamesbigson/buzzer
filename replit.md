# BuzzR - Real-Time Buzzer Application

## Overview

BuzzR is a real-time buzzer application designed for interactive game shows, quizzes, or competitive events. The application allows hosts to create rooms where multiple players can join and compete to buzz in first. Built with modern web technologies, it provides a seamless real-time experience with WebSocket communication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Context API with custom BuzzerContext
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Real-time Communication**: WebSocket server using the 'ws' library
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with fallback to database persistence
- **Development**: Hot module replacement (HMR) via Vite integration

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared schemas and types
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Real-time Communication
- **WebSocket Implementation**: Custom WebSocket server running on `/ws` path
- **Message Types**: Connection establishment, room management, buzzer events, player updates
- **Broadcasting**: Room-based message broadcasting to connected clients
- **Connection Management**: Automatic cleanup of disconnected players

### Room Management
- **Room Creation**: Hosts can create rooms with unique 6-character codes
- **Player Joining**: Players join rooms using room codes and display names
- **State Synchronization**: Real-time updates of player lists and buzzer states

### Buzzer System
- **Timer Mechanism**: Precise timing using `Date.now()` for buzz measurements
- **State Management**: Centralized buzzer state (locked/released) controlled by host
- **Result Tracking**: Chronological ordering of buzz-ins with millisecond precision
- **Reset Functionality**: Host can reset buzzer state for new rounds

### Data Storage
- **Primary Storage**: In-memory storage for development and immediate state
- **Database Schema**: PostgreSQL tables for users, rooms, players, and buzz results
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Persistence**: Room and player data persisted to database for reliability

## Data Flow

1. **Room Creation Flow**:
   - Host creates room → Server generates unique code → Room stored in memory/DB → Host redirected to host interface

2. **Player Join Flow**:
   - Player enters room code → Server validates room → Player added to room → Real-time update to all participants

3. **Buzzer Flow**:
   - Host releases buzzers → Timer starts → Players can buzz → First buzz locks buzzers → Results displayed in real-time

4. **WebSocket Message Flow**:
   - Client events → WebSocket server → State updates → Broadcast to room participants → UI updates

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS for processing
- **Icons**: Lucide React for consistent iconography
- **Utilities**: Class variance authority, clsx for conditional styling
- **Date Handling**: date-fns for time formatting

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **WebSockets**: ws library for WebSocket server implementation
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Schema Validation**: Drizzle-zod for runtime type validation

### Development Dependencies
- **Build Tools**: Vite, esbuild for bundling and compilation
- **Type Checking**: TypeScript with strict configuration
- **Development**: tsx for TypeScript execution, nodemon alternative

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Development**: NODE_ENV=development enables Vite middleware
- **Production**: NODE_ENV=production serves static files from dist

### Hosting Requirements
- **Node.js**: Runtime environment for Express server
- **PostgreSQL**: Database instance (Neon DB compatible)
- **WebSocket Support**: Server must support WebSocket connections
- **Static File Serving**: Express serves built React application

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 3, 2025
- **Fixed Timing Accuracy**: Resolved timing mismatch between player and host displays by implementing server-side timing calculation
- **Added Player Kick Feature**: Hosts can now remove players from rooms with confirmation dialog
- **Enhanced WebSocket Communication**: Improved message handling for kick events and server timing
- **Updated UI Components**: ConnectedPlayers component now shows kick buttons for hosts with improved player identification

### Key Features Implemented
- Server-side buzz timing for consistent results across all clients
- Host ability to kick players with real-time updates
- Enhanced player list UI with role indicators
- Improved error handling and user feedback

## Changelog

Changelog:
- July 05, 2025. Initial setup
- January 3, 2025. Fixed timing issues and added player kick functionality