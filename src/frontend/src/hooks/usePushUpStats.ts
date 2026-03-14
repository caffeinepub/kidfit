import { useState } from "react";
import {
  type PushUpStats,
  loadStats,
  recordSession as recordSessionUtil,
} from "../lib/pushUpStats";

export function usePushUpStats() {
  const [stats, setStats] = useState<PushUpStats>(() => loadStats());

  const recordSession = (reps: number) => {
    const updated = recordSessionUtil(reps);
    setStats(updated);
    return updated;
  };

  const refresh = () => {
    setStats(loadStats());
  };

  return { stats, recordSession, refresh };
}
