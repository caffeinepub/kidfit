import { useEffect, useState } from "react";

const AD_UNLOCK_KEY = "teentuff_stats_unlock";
const UNLOCK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

function isCurrentlyUnlocked(): boolean {
  try {
    const stored = localStorage.getItem(AD_UNLOCK_KEY);
    if (!stored) return false;
    const expiry = Number.parseInt(stored, 10);
    return Date.now() < expiry;
  } catch {
    return false;
  }
}

export function useAdUnlock() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() =>
    isCurrentlyUnlocked(),
  );

  const unlock = () => {
    const expiry = Date.now() + UNLOCK_DURATION_MS;
    try {
      localStorage.setItem(AD_UNLOCK_KEY, String(expiry));
    } catch {
      // ignore
    }
    setIsUnlocked(true);
  };

  // Re-check expiry every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUnlocked(isCurrentlyUnlocked());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { isUnlocked, unlock };
}
