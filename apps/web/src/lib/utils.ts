import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePlayers(players?: string | null): { min: number; max: number } {
  if (!players) return { min: 1, max: 99 };
  const match = players.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (match) return { min: Number(match[1]), max: Number(match[2]) };
  const single = players.match(/(\d+)/);
  if (single) return { min: Number(single[1]), max: Number(single[1]) };
  return { min: 1, max: 99 };
}

export function parseDurationMinutes(duration?: string | null): number {
  if (!duration) return 60;
  const nums = [...duration.matchAll(/(\d+)/g)].map((m) => Number(m[1]));
  if (!nums.length) return 60;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}
