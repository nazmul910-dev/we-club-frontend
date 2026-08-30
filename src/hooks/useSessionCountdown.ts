import { useEffect, useState } from "react";

const JOIN_WINDOW_MINUTES = 30; // এই সময়ের ভেতরে ঢুকলেই JOIN button active হবে

export const useSessionCountdown = (startTimeISO: string) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startMs = new Date(startTimeISO).getTime();
  const diffMs = startMs - now;
  const diffMinutes = diffMs / 60_000;

  const canJoin = diffMinutes <= JOIN_WINDOW_MINUTES; // ৩০ মিনিট আগে থেকে true
  const isLive = diffMs <= 0;

  const hh = Math.max(0, Math.floor(diffMs / 3_600_000));
  const mm = Math.max(0, Math.floor((diffMs % 3_600_000) / 60_000));
  const ss = Math.max(0, Math.floor((diffMs % 60_000) / 1000));
  const label = isLive
    ? "Live now"
    : `Starts in ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  return { canJoin, isLive, label };
};