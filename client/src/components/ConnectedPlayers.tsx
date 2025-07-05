import { useBuzzer } from "@/context/BuzzerContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ConnectedPlayers() {
  const { players, isHost, kickPlayer, socketId } = useBuzzer();
  
  const handleKickPlayer = (playerId: string, playerName: string) => {
    if (confirm(`Are you sure you want to remove ${playerName} from the room?`)) {
      kickPlayer(playerId);
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Connected Players</h3>
      <div className="space-y-2">
        {players.length === 0 ? (
          <div className="py-3 px-4 text-center text-sm text-gray-500 bg-gray-50 rounded-md">
            No players connected yet
          </div>
        ) : (
          players.map((player) => (
            <div 
              key={player.id} 
              className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">{player.name}</span>
                {player.id === socketId && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Connected
                </span>
                {isHost && player.id !== socketId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleKickPlayer(player.id, player.name)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
