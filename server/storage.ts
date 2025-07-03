import { 
  type User, 
  type InsertUser,
  type Room,
  type InsertRoom,
  type Player,
  type InsertPlayer,
  type BuzzResult,
  type InsertBuzzResult,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Room methods
  createRoom(room: InsertRoom): Promise<Room>;
  getRoomByCode(code: string): Promise<Room | undefined>;
  
  // Player methods
  addPlayer(player: InsertPlayer): Promise<Player>;
  getPlayersByRoomCode(roomCode: string): Promise<Player[]>;
  getPlayerBySocketId(socketId: string): Promise<Player | undefined>;
  removePlayer(socketId: string): Promise<boolean>;
  
  // Buzz results methods
  addBuzzResult(result: InsertBuzzResult): Promise<BuzzResult>;
  getBuzzResultsByRoomCode(roomCode: string): Promise<BuzzResult[]>;
  clearBuzzResultsByRoomCode(roomCode: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rooms: Map<string, Room>;
  private players: Map<string, Player>;
  private buzzResults: Map<string, BuzzResult[]>;
  private currentUserId: number;
  private currentRoomId: number;
  private currentPlayerId: number;
  private currentBuzzResultId: number;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.players = new Map();
    this.buzzResults = new Map();
    this.currentUserId = 1;
    this.currentRoomId = 1;
    this.currentPlayerId = 1;
    this.currentBuzzResultId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const now = new Date();
    const room: Room = { 
      ...insertRoom, 
      id, 
      active: true,
      created: now 
    };
    this.rooms.set(room.code, room);
    return room;
  }

  async getRoomByCode(code: string): Promise<Room | undefined> {
    return this.rooms.get(code);
  }

  async addPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const player: Player = { ...insertPlayer, id };
    this.players.set(player.socketId, player);
    return player;
  }

  async getPlayersByRoomCode(roomCode: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(
      (player) => player.roomCode === roomCode,
    );
  }

  async getPlayerBySocketId(socketId: string): Promise<Player | undefined> {
    return this.players.get(socketId);
  }

  async removePlayer(socketId: string): Promise<boolean> {
    return this.players.delete(socketId);
  }

  async addBuzzResult(insertResult: InsertBuzzResult): Promise<BuzzResult> {
    const id = this.currentBuzzResultId++;
    const now = new Date();
    const result: BuzzResult = { 
      ...insertResult, 
      id, 
      timestamp: now
    };
    
    // Initialize the room results array if it doesn't exist
    if (!this.buzzResults.has(result.roomCode)) {
      this.buzzResults.set(result.roomCode, []);
    }
    
    const roomResults = this.buzzResults.get(result.roomCode);
    if (roomResults) {
      roomResults.push(result);
      // Sort by time (fastest first)
      roomResults.sort((a, b) => a.time - b.time);
    }
    
    return result;
  }

  async getBuzzResultsByRoomCode(roomCode: string): Promise<BuzzResult[]> {
    return this.buzzResults.get(roomCode) || [];
  }

  async clearBuzzResultsByRoomCode(roomCode: string): Promise<boolean> {
    if (this.buzzResults.has(roomCode)) {
      this.buzzResults.set(roomCode, []);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
