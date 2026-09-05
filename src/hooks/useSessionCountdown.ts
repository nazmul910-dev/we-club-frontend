import { useEffect, useState } from "react";

const JOIN_WINDOW_MINUTES = 30; 

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatCountdown(diffMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const totalHours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (totalHours < 24) {
    return `${pad(totalHours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return `${days}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
}

export const useSessionCountdown = (startTimeISO: string) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startMs = new Date(startTimeISO).getTime();
  const diffMs = startMs - now;
  const diffMinutes = diffMs / 60_000;

  const canJoin = diffMinutes <= JOIN_WINDOW_MINUTES; 
  const isLive = diffMs <= 0;

  const label = isLive ? "Live now" : `Starts in ${formatCountdown(diffMs)}`;

  return { canJoin, isLive, label };
};