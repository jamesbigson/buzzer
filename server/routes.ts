import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import { storage } from "./storage";

// Function to generate a random room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper function to broadcast to all clients in a room
function broadcastToRoom(
  wss: WebSocketServer, 
  roomCode: string, 
  message: any,
  excludeSocketId?: string
) {
  wss.clients.forEach((client) => {
    const socketId = (client as any).socketId;
    if (client.readyState === WebSocket.OPEN && 
        (client as any).roomCode === roomCode && 
        (!excludeSocketId || socketId !== excludeSocketId)) {
      client.send(JSON.stringify(message));
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server on a different path than Vite's HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket connection handler
  wss.on('connection', async (ws) => {
    const socketId = Math.random().toString(36).substring(2, 15);
    (ws as any).socketId = socketId;
    console.log(`WebSocket connected: ${socketId}`);

    // Welcome message
    ws.send(JSON.stringify({ 
      type: 'connection_established', 
      socketId 
    }));

    // Message handler
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Received message from ${socketId}:`, data.type);

        switch (data.type) {
          case 'create_room': {
            const { hostName } = data;
            const roomCode = generateRoomCode();
            
            // Store room in memory
            await storage.createRoom({
              code: roomCode,
              hostId: socketId,
              hostName
            });
            
            // Update socket with room info
            (ws as any).roomCode = roomCode;
            (ws as any).isHost = true;
            
            // Add host as a player too
            await storage.addPlayer({
              socketId,
              name: hostName,
              roomCode
            });
            
            // Respond with room info
            ws.send(JSON.stringify({
              type: 'room_created',
              roomCode,
              hostName
            }));
            break;
          }
          
          case 'join_room': {
            const { playerName, roomCode } = data;
            
            // Check if room exists
            const room = await storage.getRoomByCode(roomCode);
            if (!room) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Room not found'
              }));
              break;
            }
            
            // Update socket with room info
            (ws as any).roomCode = roomCode;
            (ws as any).isHost = false;
            
            // Add player to memory
            const player = await storage.addPlayer({
              socketId,
              name: playerName,
              roomCode
            });
            
            // Respond to the player
            ws.send(JSON.stringify({
              type: 'room_joined',
              roomCode,
              playerName
            }));
            
            // Notify host about new player
            const players = await storage.getPlayersByRoomCode(roomCode);
            broadcastToRoom(wss, roomCode, {
              type: 'player_joined',
              player: { 
                id: socketId, 
                name: playerName 
              },
              players: players.map(p => ({ 
                id: p.socketId, 
                name: p.name 
              }))
            }, socketId);
            break;
          }
          
          case 'release_buzzers': {
            const { roomCode } = data;
            
            // Check if sender is host
            if (!(ws as any).isHost) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Only host can release buzzers'
              }));
              break;
            }
            
            // Clear previous buzz results
            await storage.clearBuzzResultsByRoomCode(roomCode);
            
            // Broadcast buzzer release to everyone in the room
            broadcastToRoom(wss, roomCode, {
              type: 'buzzers_released',
              timestamp: Date.now()
            });
            break;
          }
          
          case 'reset_buzzers': {
            const { roomCode } = data;
            
            // Check if sender is host
            if (!(ws as any).isHost) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Only host can reset buzzers'
              }));
              break;
            }
            
            // Clear buzz results
            await storage.clearBuzzResultsByRoomCode(roomCode);
            
            // Broadcast buzzer reset to everyone in the room
            broadcastToRoom(wss, roomCode, {
              type: 'buzzers_reset'
            });
            
            // Send cleared results to host
            ws.send(JSON.stringify({
              type: 'buzz_results',
              results: []
            }));
            break;
          }
          
          case 'buzz_in': {
            const { time, roomCode } = data;
            
            // Get player info
            const player = await storage.getPlayerBySocketId(socketId);
            if (!player) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Player not found'
              }));
              break;
            }
            
            // Record buzz result
            const result = await storage.addBuzzResult({
              roomCode,
              playerId: socketId,
              playerName: player.name,
              time
            });
            
            // Acknowledge to the player
            ws.send(JSON.stringify({
              type: 'buzz_acknowledged',
              time
            }));
            
            // Get all results for the room and broadcast to host
            const results = await storage.getBuzzResultsByRoomCode(roomCode);
            
            // Send to host only
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN && 
                  (client as any).roomCode === roomCode && 
                  (client as any).isHost) {
                client.send(JSON.stringify({
                  type: 'buzz_results',
                  results: results.map(r => ({
                    playerId: r.playerId,
                    playerName: r.playerName,
                    time: r.time
                  }))
                }));
              }
            });
            break;
          }
          
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Error processing message'
        }));
      }
    });

    // Handle disconnections
    ws.on('close', async () => {
      console.log(`WebSocket disconnected: ${socketId}`);
      
      // Get player info before removing
      const player = await storage.getPlayerBySocketId(socketId);
      
      if (player) {
        const { roomCode } = player;
        
        // Remove player from storage
        await storage.removePlayer(socketId);
        
        // Notify others in the room that player left
        const remainingPlayers = await storage.getPlayersByRoomCode(roomCode);
        broadcastToRoom(wss, roomCode, {
          type: 'player_left',
          playerId: socketId,
          players: remainingPlayers.map(p => ({ 
            id: p.socketId, 
            name: p.name 
          }))
        });
      }
    });
  });

  // Define API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return httpServer;
}
