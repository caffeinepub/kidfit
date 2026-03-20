import { c as createLucideIcon, r as reactExports } from "./index-BcUOA3D1.js";
import { l as loadStats, r as recordSession } from "./pushUpStats-BXMh0rBw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
      key: "96xj49"
    }
  ]
];
const Flame = createLucideIcon("flame", __iconNode);
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
  Flame as F,
  usePushUpStats as a,
  useAdUnlock as u
};
