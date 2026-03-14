import { r as reactExports } from "./index-DxfWywI7.js";
import { l as loadStats, r as recordSession } from "./pushUpStats-BXMh0rBw.js";
const AD_UNLOCK_KEY = "teentuff_stats_unlock";
const UNLOCK_DURATION_MS = 5 * 60 * 60 * 1e3;
function isCurrentlyUnlocked() {
  try {
    const stored = localStorage.getItem(AD_UNLOCK_KEY);
    if (!stored) return false;
    const expiry = Number.parseInt(stored, 10);
    return Date.now() < expiry;
  } catch {
    return false;
  }
}
function useAdUnlock() {
  const [isUnlocked, setIsUnlocked] = reactExports.useState(
    () => isCurrentlyUnlocked()
  );
  const unlock = () => {
    const expiry = Date.now() + UNLOCK_DURATION_MS;
    try {
      localStorage.setItem(AD_UNLOCK_KEY, String(expiry));
    } catch {
    }
    setIsUnlocked(true);
  };
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      setIsUnlocked(isCurrentlyUnlocked());
    }, 60 * 1e3);
    return () => clearInterval(interval);
  }, []);
  return { isUnlocked, unlock };
}
function usePushUpStats() {
  const [stats, setStats] = reactExports.useState(() => loadStats());
  const recordSession$1 = (reps) => {
    const updated = recordSession(reps);
    setStats(updated);
    return updated;
  };
  const refresh = () => {
    setStats(loadStats());
  };
  return { stats, recordSession: recordSession$1, refresh };
}
export {
  usePushUpStats as a,
  useAdUnlock as u
};
