import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { useBuzzer } from "@/context/BuzzerContext";
import { RoomInfo } from "@/components/RoomInfo";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerBuzzer } from "@/components/PlayerBuzzer";
import { formatTime } from "@/lib/utils";

export default function Player() {
  const { 
    roomCode, 
    playerName, 
    buzzerReleased, 
    userHasBuzzed, 
    timerStart,
    userBuzzTime 
  } = useBuzzer();
  const [, navigate] = useLocation();
  const [displayTime, setDisplayTime] = useState("0.000s");
  const timerIntervalRef = useRef<number | null>(null);
  
  // Redirect if not in a room
  useEffect(() => {
    if (!roomCode || !playerName) {
      navigate("/");
    }
  }, [roomCode, playerName, navigate]);
  
  // Timer effect for updating the display
  useEffect(() => {
    // Clear any existing interval
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (buzzerReleased && timerStart && !userHasBuzzed) {
      // Start timer immediately from 0 for responsive UI
      let localStartTime = Date.now();
      
      const updateTimer = () => {
        const currentTime = Date.now();
        const elapsed = (currentTime - localStartTime) / 1000;
        setDisplayTime(formatTime(elapsed));
      };
      
      // Set initial display to 0 and start counting immediately
      setDisplayTime("0.000s");
      timerIntervalRef.current = window.setInterval(updateTimer, 10);
      
    } else if (userHasBuzzed && userBuzzTime !== null) {
      // Show server-calculated time when user buzzed
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setDisplayTime(formatTime(userBuzzTime));
    } else {
      // Reset the display when not active
      setDisplayTime("0.000s");
    }
    
    // Cleanup
    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [buzzerReleased, timerStart, userHasBuzzed, userBuzzTime]);
  
  if (!roomCode || !playerName) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      {/* Room Info */}
      <RoomInfo />
      
      {/* Buzzer Status */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Buzzer Status</h3>
            <div className={`inline-block px-4 py-2 rounded-full font-medium mb-2 ${
              buzzerReleased 
                ? userHasBuzzed
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {buzzerReleased 
                ? userHasBuzzed 
                  ? "Buzzed In!" 
                  : "READY!" 
                : "Waiting for host..."}
            </div>
            <p className="text-sm text-gray-500">
              {buzzerReleased 
                ? userHasBuzzed 
                  ? "Wait for the host to reset the buzzer." 
                  : "Click the buzzer as fast as you can!" 
                : "The host will release the buzzer when ready."}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Buzzer button */}
      <div className="mb-6">
        <PlayerBuzzer />
      </div>
      
      {/* Timer Display */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-3">Your Time</h3>
          <div className="text-4xl font-bold text-primary">{displayTime}</div>
          <p className="text-sm text-gray-500 mt-2">Time will be displayed when you buzz in</p>
        </CardContent>
      </Card>
    </div>
  );
}
