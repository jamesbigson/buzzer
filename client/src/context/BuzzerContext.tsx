import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import connectWebSocket from "../lib/socket";
import { useToast } from "@/hooks/use-toast";

interface Player {
  id: string;
  name: string;
}

interface BuzzResult {
  playerId: string;
  playerName: string;
  time: number;
}

interface BuzzerContextType {
  socket: WebSocket | null;
  socketId: string | null;
  isConnected: boolean;
  isHost: boolean;
  playerName: string;
  roomCode: string;
  players: Player[];
  buzzerReleased: boolean;
  userHasBuzzed: boolean;
  timerStart: number | null;
  buzzResults: BuzzResult[];
  
  // Methods
  createRoom: (hostName: string) => void;
  joinRoom: (playerName: string, roomCode: string) => void;
  releaseBuzzers: () => void;
  resetBuzzers: () => void;
  buzzIn: () => void;
}

const BuzzerContext = createContext<BuzzerContextType | undefined>(undefined);

export function BuzzerProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [buzzerReleased, setBuzzerReleased] = useState(false);
  const [userHasBuzzed, setUserHasBuzzed] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [buzzResults, setBuzzResults] = useState<BuzzResult[]>([]);
  
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Initialize socket connection
  useEffect(() => {
    console.log("Initializing WebSocket connection");
    const newSocket = connectWebSocket();
    setSocket(newSocket);

    newSocket.addEventListener("open", () => {
      console.log("WebSocket connection open handler called");
      setIsConnected(true);
      try {
        toast({
          title: "Connected",
          description: "WebSocket connection established",
        });
      } catch (error) {
        console.error("Error showing toast on connection:", error);
      }
    });

    newSocket.addEventListener("close", () => {
      console.log("WebSocket connection close handler called");
      setIsConnected(false);
      try {
        toast({
          title: "Disconnected",
          description: "WebSocket connection closed",
          variant: "destructive",
        });
      } catch (error) {
        console.error("Error showing toast on disconnection:", error);
      }
    });

    return () => {
      console.log("Cleaning up WebSocket connection");
      newSocket.close();
    };
  }, [toast]);

  // Handle socket messages
  useEffect(() => {
    if (!socket) {
      console.log("Socket not available yet, skipping message handler setup");
      return;
    }

    console.log("Setting up WebSocket message handler");
    
    const handleMessage = (event: MessageEvent) => {
      console.log("Raw message received:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed message:", data);

        switch (data.type) {
          case "connection_established":
            console.log("Setting socket ID:", data.socketId);
            setSocketId(data.socketId);
            break;

          case "room_created":
            console.log("Room created:", data.roomCode);
            setRoomCode(data.roomCode);
            setIsHost(true);
            navigate("/host");
            break;

          case "room_joined":
            console.log("Room joined:", data.roomCode);
            setRoomCode(data.roomCode);
            navigate("/player");
            break;

          case "player_joined":
            console.log("Player joined event received");
            if (isHost) {
              setPlayers(data.players || []);
              try {
                toast({
                  title: "Player joined",
                  description: data.player?.name ? `${data.player.name} has joined the room` : "A new player has joined",
                });
              } catch (error) {
                console.error("Error showing toast for player joined:", error);
              }
            }
            break;

          case "player_left":
            console.log("Player left event received");
            if (isHost) {
              setPlayers(data.players || []);
              try {
                toast({
                  title: "Player left",
                  description: "A player has left the room",
                });
              } catch (error) {
                console.error("Error showing toast for player left:", error);
              }
            }
            break;

          case "buzzers_released":
            console.log("Buzzers released at timestamp:", data.timestamp);
            setBuzzerReleased(true);
            setUserHasBuzzed(false);
            setTimerStart(data.timestamp || Date.now());
            break;

          case "buzzers_reset":
            console.log("Buzzers reset");
            setBuzzerReleased(false);
            setUserHasBuzzed(false);
            setTimerStart(null);
            break;

          case "buzz_results":
            console.log("Buzz results received:", data.results);
            setBuzzResults(data.results || []);
            break;

          case "buzz_acknowledged":
            console.log("Buzz acknowledged");
            setUserHasBuzzed(true);
            break;

          case "error":
            console.error("Error message from server:", data.message);
            try {
              toast({
                title: "Error",
                description: data.message || "Unknown error",
                variant: "destructive",
              });
            } catch (error) {
              console.error("Error showing toast for error message:", error);
            }
            break;
            
          default:
            console.warn("Unknown message type received:", data.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        console.error("Raw message was:", event.data);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      console.log("Cleaning up WebSocket message handler");
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, isHost, navigate, toast]);

  // Check URL for room code on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get("room");
    if (roomFromUrl) {
      setRoomCode(roomFromUrl);
    }
  }, []);

  const createRoom = (hostName: string) => {
    if (!socket || !isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to server",
        variant: "destructive",
      });
      return;
    }

    setPlayerName(hostName);
    socket.send(
      JSON.stringify({
        type: "create_room",
        hostName,
      })
    );
  };

  const joinRoom = (name: string, code: string) => {
    if (!socket || !isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to server",
        variant: "destructive",
      });
      return;
    }

    setPlayerName(name);
    socket.send(
      JSON.stringify({
        type: "join_room",
        playerName: name,
        roomCode: code,
      })
    );
  };

  const releaseBuzzers = () => {
    if (!socket || !isConnected || !isHost) return;

    socket.send(
      JSON.stringify({
        type: "release_buzzers",
        roomCode,
      })
    );
  };

  const resetBuzzers = () => {
    if (!socket || !isConnected || !isHost) return;

    socket.send(
      JSON.stringify({
        type: "reset_buzzers",
        roomCode,
      })
    );
  };

  const buzzIn = () => {
    if (!socket || !isConnected || !timerStart || userHasBuzzed) return;

    const currentTime = Date.now();
    const elapsedTime = (currentTime - timerStart) / 1000;

    socket.send(
      JSON.stringify({
        type: "buzz_in",
        roomCode,
        time: elapsedTime,
      })
    );
  };

  const value = {
    socket,
    socketId,
    isConnected,
    isHost,
    playerName,
    roomCode,
    players,
    buzzerReleased,
    userHasBuzzed,
    timerStart,
    buzzResults,
    createRoom,
    joinRoom,
    releaseBuzzers,
    resetBuzzers,
    buzzIn,
  };

  return <BuzzerContext.Provider value={value}>{children}</BuzzerContext.Provider>;
}

export function useBuzzer() {
  const context = useContext(BuzzerContext);
  if (context === undefined) {
    throw new Error("useBuzzer must be used within a BuzzerProvider");
  }
  return context;
}
