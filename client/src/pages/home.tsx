import { useEffect } from "react";
import { CreateRoomForm } from "@/components/CreateRoomForm";
import { JoinRoomForm } from "@/components/JoinRoomForm";
import { Card } from "@/components/ui/card";
import { useBuzzer } from "@/context/BuzzerContext";

export default function Home() {
  console.log("Home component rendering");
  
  // Safely use the buzzer context in a try/catch
  let buzzerContext;
  try {
    buzzerContext = useBuzzer();
    console.log("BuzzerContext successfully obtained in Home");
  } catch (error) {
    console.error("Error using BuzzerContext in Home:", error);
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">BuzzR</h1>
        <div className="p-4 bg-red-100 text-red-800 rounded-md">
          Error: Application is still initializing. Please wait a moment and refresh.
        </div>
      </div>
    );
  }
  
  // Extract what we need once we know context is available
  const { roomCode, joinRoom } = buzzerContext;
  
  // Check URL for room code on load
  useEffect(() => {
    console.log("Home effect running, roomCode:", roomCode);
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get("room");
    
    // If there's a room code in the URL but not stored, show a modal or prompt
    if (roomFromUrl && !roomCode) {
      console.log("Found room code in URL:", roomFromUrl);
      const playerName = localStorage.getItem("playerName") || "";
      if (playerName) {
        console.log("Joining room with saved name:", playerName);
        joinRoom(playerName, roomFromUrl);
      }
    }
  }, [roomCode, joinRoom]);
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">BuzzR</h1>
          <p className="text-gray-600">Real-time buzzer system for your game show needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Create Room Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Host a Room</h2>
            <CreateRoomForm />
          </Card>

          {/* Join Room Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Join a Room</h2>
            <JoinRoomForm initialRoomCode={roomCode} />
          </Card>
        </div>
      </div>
    </div>
  );
}
