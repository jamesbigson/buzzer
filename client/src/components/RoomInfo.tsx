import { useBuzzer } from "@/context/BuzzerContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoomInfo() {
  const { roomCode, playerName } = useBuzzer();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Room Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Room Code:</span>
          <span className="font-bold">{roomCode}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">Your Name:</span>
          <span className="font-medium">{playerName}</span>
        </div>
      </CardContent>
    </Card>
  );
}
