import { useState, useEffect } from "react";
import { useBuzzer } from "@/context/BuzzerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateRoomForm() {
  // Safely get context
  let createRoom: (hostName: string) => void;
  let isConnected = false;
  
  try {
    const buzzerContext = useBuzzer();
    createRoom = buzzerContext.createRoom;
    isConnected = buzzerContext.isConnected;
  } catch (error) {
    console.error("Error using BuzzerContext in CreateRoomForm:", error);
    return (
      <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
        Loading connection...
      </div>
    );
  }
  
  const [hostName, setHostName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem("hostName");
    if (savedName) {
      setHostName(savedName);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hostName.trim()) {
      return;
    }
    
    // Save name to localStorage for future visits
    localStorage.setItem("hostName", hostName);
    localStorage.setItem("playerName", hostName);
    
    setIsSubmitting(true);
    createRoom(hostName);
    // We don't set isSubmitting to false here because we'll navigate away on success
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="host-name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </Label>
        <Input
          id="host-name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-blue-700 text-white font-medium"
        disabled={!isConnected || isSubmitting || !hostName.trim()}
      >
        {isSubmitting ? "Creating..." : "Create Room"}
      </Button>
    </form>
  );
}
