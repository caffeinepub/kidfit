import { Tier } from "../backend.d";

export interface TierInfo {
  tier: Tier;
  label: string;
  minXp: number;
  maxXp: number | null;
  color: string;
  glowColor: string;
  emoji: string;
  gradient: string;
}

export const TIERS: TierInfo[] = [
  {
    tier: Tier.bronze,
    label: "Bronze",
    minXp: 0,
    maxXp: 499,
    color: "text-tier-bronze",
    glowColor: "oklch(0.62 0.14 55)",
    emoji: "🥉",
    gradient: "from-amber-900 to-amber-700",
  },
  {
    tier: Tier.silver,
    label: "Silver",
    minXp: 500,
    maxXp: 1499,
    color: "text-tier-silver",
    glowColor: "oklch(0.7 0.01 265)",
    emoji: "🥈",
    gradient: "from-slate-500 to-slate-300",
  },
  {
    tier: Tier.gold,
    label: "Gold",
    minXp: 1500,
    maxXp: 3499,
    color: "text-tier-gold",
    glowColor: "oklch(0.78 0.2 82)",
    emoji: "🥇",
    gradient: "from-yellow-600 to-yellow-300",
  },
  {
    tier: Tier.platinum,
    label: "Platinum",
    minXp: 3500,
    maxXp: 6999,
    color: "text-tier-platinum",
    glowColor: "oklch(0.72 0.06 220)",
    emoji: "💎",
    gradient: "from-cyan-700 to-cyan-400",
  },
  {
    tier: Tier.diamond,
    label: "Diamond",
    minXp: 7000,
    maxXp: null,
    color: "text-tier-diamond",
    glowColor: "oklch(0.72 0.2 220)",
    emoji: "💠",
    gradient: "from-blue-600 to-cyan-300",
  },
];

export function getTierInfo(tier: Tier): TierInfo {
  return TIERS.find((t) => t.tier === tier) ?? TIERS[0];
}

export function getTierFromXp(xp: number): TierInfo {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXp) {
      return TIERS[i];
    }
  }
  return TIERS[0];
}

export function getXpProgress(xp: number, tier: TierInfo): number {
  if (tier.maxXp === null) return 100;
  const range = tier.maxXp - tier.minXp;
  const progress = xp - tier.minXp;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function getXpToNextTier(xp: number, tier: TierInfo): number {
  if (tier.maxXp === null) return 0;
  return tier.maxXp - xp + 1;
}

export function levelFromXp(xp: number): number {
  return Math.floor(xp / 100) + 1;
}
