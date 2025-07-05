import { useBuzzer } from "@/context/BuzzerContext";
import { cn } from "@/lib/utils";

export function PlayerBuzzer() {
  const { buzzerReleased, userHasBuzzed, buzzIn } = useBuzzer();
  
  const handleBuzzClick = () => {
    if (buzzerReleased && !userHasBuzzed) {
      buzzIn();
    }
  };
  
  return (
    <button
      onClick={handleBuzzClick}
      disabled={!buzzerReleased || userHasBuzzed}
      className={cn(
        "w-full h-40 rounded-full text-white font-bold text-xl shadow-md flex items-center justify-center transition-all duration-150",
        !buzzerReleased && "bg-gray-300 opacity-75 cursor-not-allowed",
        buzzerReleased && !userHasBuzzed && "bg-primary hover:bg-blue-700 animate-pulse",
        buzzerReleased && userHasBuzzed && "bg-green-600 scale-95",
        buzzerReleased && !userHasBuzzed && "buzzer-ready"
      )}
    >
      <span>{userHasBuzzed ? "BUZZED!" : "BUZZ!"}</span>
    </button>
  );
}
