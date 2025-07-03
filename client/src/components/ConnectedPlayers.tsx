import { useBuzzer } from "@/context/BuzzerContext";

export function ConnectedPlayers() {
  const { players } = useBuzzer();
  
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
              <span className="font-medium">{player.name}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                Connected
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
