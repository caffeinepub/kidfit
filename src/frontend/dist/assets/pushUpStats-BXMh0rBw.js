const STATS_KEY = "teentuff_pushup_stats";
const BADGE_DEFS = [
  {
    id: "first_rep",
    label: "First Rep",
    emoji: "🎯",
    description: "Completed your first session",
    check: (s) => s.sessionCount >= 1
  },
  {
    id: "ten_club",
    label: "10 Rep Club",
    emoji: "💪",
    description: "10+ push-ups in a single session",
    check: (s) => s.totalPushUps >= 10
  },
  {
    id: "fifty_club",
    label: "50 Rep Club",
    emoji: "🥈",
    description: "50+ total push-ups",
    check: (s) => s.totalPushUps >= 50
  },
  {
    id: "century",
    label: "Century Club",
    emoji: "💯",
    description: "100+ total push-ups",
    check: (s) => s.totalPushUps >= 100
  },
  {
    id: "iron_teen",
    label: "Iron Teen",
    emoji: "⚡",
    description: "500+ total push-ups",
    check: (s) => s.totalPushUps >= 500
  },
  {
    id: "push_machine",
    label: "Push-Up Machine",
    emoji: "🤖",
    description: "1,000+ total push-ups",
    check: (s) => s.totalPushUps >= 1e3
  }
];
function computeBadges(base) {
  return BADGE_DEFS.filter((b) => b.check(base)).map(
    ({ id, label, emoji, description }) => ({
      id,
      label,
      emoji,
      description
    })
  );
}
function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch {
  }
  return { totalPushUps: 0, sessionCount: 0, badges: [] };
}
function recordSession(reps) {
  const prev = loadStats();
  const base = {
    totalPushUps: prev.totalPushUps + reps,
    sessionCount: prev.sessionCount + 1
  };
  const next = {
    ...base,
    badges: computeBadges(base)
  };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(next));
  } catch {
  }
  return next;
}
export {
  loadStats as l,
  recordSession as r
};
