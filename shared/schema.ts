import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  hostId: text("host_id").notNull(),
  hostName: text("host_name").notNull(),
  active: boolean("active").default(true),
  created: timestamp("created").defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  socketId: text("socket_id").notNull().unique(),
  name: text("name").notNull(),
  roomCode: text("room_code").notNull(),
});

export const buzzResults = pgTable("buzz_results", {
  id: serial("id").primaryKey(),
  roomCode: text("room_code").notNull(),
  playerId: text("player_id").notNull(),
  playerName: text("player_name").notNull(),
  time: real("time").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRoomSchema = createInsertSchema(rooms).pick({
  code: true,
  hostId: true,
  hostName: true,
});

export const insertPlayerSchema = createInsertSchema(players).pick({
  socketId: true,
  name: true,
  roomCode: true,
});

export const insertBuzzResultSchema = createInsertSchema(buzzResults).pick({
  roomCode: true,
  playerId: true,
  playerName: true,
  time: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export type InsertBuzzResult = z.infer<typeof insertBuzzResultSchema>;
export type BuzzResult = typeof buzzResults.$inferSelect;
