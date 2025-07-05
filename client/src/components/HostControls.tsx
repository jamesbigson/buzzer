import { useState } from "react";
import { useBuzzer } from "@/context/BuzzerContext";
import { Button } from "@/components/ui/button";
import { generateShareUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PlayIcon, RefreshCcwIcon, Copy } from "lucide-react";

export function HostControls() {
  const { roomCode, releaseBuzzers, resetBuzzers, buzzerReleased } = useBuzzer();
  const { toast } = useToast();
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const shareUrl = generateShareUrl(roomCode);
  
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      {/* Room Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-500">Room Code:</span>
          <div className="flex items-center mt-1">
            <span className="text-lg font-bold mr-2">{roomCode}</span>
            <button 
              onClick={() => copyToClipboard(roomCode, "Room code")}
              className="text-primary hover:text-blue-700 focus:outline-none p-1"
              aria-label="Copy room code"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Share Link:</span>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-700 truncate mr-2 w-full">
              {shareUrl}
            </span>
            <button 
              onClick={() => copyToClipboard(shareUrl, "Share link")}
              className="text-primary hover:text-blue-700 focus:outline-none p-1 shrink-0"
              aria-label="Copy share link"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Buzzer Controls */}
      <div className="space-y-4">
        <Button
          onClick={releaseBuzzers}
          className="w-full bg-secondary hover:bg-green-700 text-white font-medium py-6"
          disabled={buzzerReleased}
        >
          <PlayIcon className="h-5 w-5 mr-2" />
          Release Buzzers
        </Button>
        
        <Button
          onClick={resetBuzzers}
          className="w-full bg-destructive hover:bg-red-700 text-white font-medium py-6"
        >
          <RefreshCcwIcon className="h-5 w-5 mr-2" />
          Reset Buzzers
        </Button>
      </div>
    </>
  );
}
