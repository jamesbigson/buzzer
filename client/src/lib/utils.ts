import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  return `${seconds.toFixed(3)}s`;
}

export function generateShareUrl(roomCode: string): string {
  const origin = window.location.origin;
  return `${origin}?room=${roomCode}`;
}
