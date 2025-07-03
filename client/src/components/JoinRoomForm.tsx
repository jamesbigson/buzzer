import { useState, useEffect } from "react";
import { useBuzzer } from "@/context/BuzzerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JoinRoomFormProps {
  initialRoomCode?: string;
}

export function JoinRoomForm({ initialRoomCode = "" }: JoinRoomFormProps) {
  // Safely get context
  let joinRoom: (playerName: string, roomCode: string) => void;
  let isConnected = false;
  
  try {
    const buzzerContext = useBuzzer();
    joinRoom = buzzerContext.joinRoom;
    isConnected = buzzerContext.isConnected;
  } catch (error) {
    console.error("Error using BuzzerContext in JoinRoomForm:", error);
    return (
      <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
        Loading connection...
      </div>
    );
  }
  
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setPlayerName(savedName);
    }
    
    // If initialRoomCode changes, update the state
    if (initialRoomCode) {
      setRoomCode(initialRoomCode);
    }
  }, [initialRoomCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim() || !roomCode.trim()) {
      return;
    }
    
    // Save name to localStorage for future visits
    localStorage.setItem("playerName", playerName);
    
    setIsSubmitting(true);
    joinRoom(playerName, roomCode.toUpperCase());
    // We don't set isSubmitting to false here because we'll navigate away on success
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="player-name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </Label>
        <Input
          id="player-name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="room-code" className="block text-sm font-medium text-gray-700 mb-1">
          Room Code
        </Label>
        <Input
          id="room-code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="Enter room code"
          required
          maxLength={6}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-secondary hover:bg-green-700 text-white font-medium"
        disabled={!isConnected || isSubmitting || !playerName.trim() || !roomCode.trim()}
      >
        {isSubmitting ? "Joining..." : "Join Room"}
      </Button>
    </form>
  );
}
