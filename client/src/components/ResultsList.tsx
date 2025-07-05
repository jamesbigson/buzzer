import { useBuzzer } from "@/context/BuzzerContext";
import { formatTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultsList() {
  const { buzzResults, buzzerReleased } = useBuzzer();
  
  return (
    <Card className="w-full md:w-2/3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold text-primary">Results</CardTitle>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Buzzer Status:</span>
          {buzzerReleased ? (
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">
              Ready
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800">
              Locked
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {buzzResults.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="mt-4 text-gray-500">Waiting for players to buzz in</p>
            <p className="text-sm text-gray-400">Results will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {buzzResults.map((result, index) => {
              // Determine border color based on position
              let borderColor = "border-gray-300";
              if (index === 0) borderColor = "border-blue-500";
              else if (index === 1) borderColor = "border-green-500";
              else if (index === 2) borderColor = "border-yellow-500";
              
              return (
                <div 
                  key={result.playerId}
                  className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 ${borderColor} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold w-8 text-center">{index + 1}</span>
                    <span className="font-medium">{result.playerName}</span>
                  </div>
                  <div>
                    <span className="text-lg font-semibold">
                      {formatTime(result.time)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
