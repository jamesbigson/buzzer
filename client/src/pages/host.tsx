import { useEffect } from "react";
import { useLocation } from "wouter";
import { useBuzzer } from "@/context/BuzzerContext";
import { HostControls } from "@/components/HostControls";
import { ConnectedPlayers } from "@/components/ConnectedPlayers";
import { ResultsList } from "@/components/ResultsList";

export default function Host() {
  const { isHost, roomCode } = useBuzzer();
  const [, navigate] = useLocation();
  
  // Redirect if not a host or no room code
  useEffect(() => {
    if (!isHost || !roomCode) {
      navigate("/");
    }
  }, [isHost, roomCode, navigate]);
  
  if (!isHost || !roomCode) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Left Column - Controls */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Host Controls</h2>
            <HostControls />
          </div>
          
          {/* Player List */}
          <ConnectedPlayers />
        </div>
        
        {/* Right Column - Results */}
        <ResultsList />
      </div>
    </div>
  );
}
