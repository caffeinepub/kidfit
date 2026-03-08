import { cn } from "@/lib/utils";
import { Tier } from "../backend.d";
import { getTierInfo } from "../lib/xp";

interface TierBadgeProps {
  tier: Tier;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

export default function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  className,
}: TierBadgeProps) {
  const info = getTierInfo(tier);

  const sizeClasses = {
    sm: { badge: "px-2 py-0.5 text-xs gap-1", emoji: "text-sm" },
    md: { badge: "px-3 py-1 text-sm gap-1.5", emoji: "text-base" },
    lg: { badge: "px-4 py-1.5 text-base gap-2", emoji: "text-xl" },
    xl: { badge: "px-6 py-2 text-lg gap-2", emoji: "text-2xl" },
  };

  const tierBorderColors: Record<Tier, string> = {
    [Tier.bronze]: "border-tier-bronze/50 bg-amber-900/20",
    [Tier.silver]: "border-tier-silver/50 bg-slate-500/20",
    [Tier.gold]: "border-tier-gold/50 bg-yellow-600/20",
    [Tier.platinum]: "border-tier-platinum/50 bg-cyan-700/20",
    [Tier.diamond]: "border-tier-diamond/50 bg-blue-600/20",
  };

  const tierTextColors: Record<Tier, string> = {
    [Tier.bronze]: "text-tier-bronze",
    [Tier.silver]: "text-tier-silver",
    [Tier.gold]: "text-tier-gold",
    [Tier.platinum]: "text-tier-platinum",
    [Tier.diamond]: "text-tier-diamond",
  };

  const { badge, emoji } = sizeClasses[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-display font-bold tracking-wide",
        badge,
        tierBorderColors[tier],
        tierTextColors[tier],
        className,
      )}
    >
      <span className={emoji}>{info.emoji}</span>
      {showLabel && <span>{info.label}</span>}
    </span>
  );
}
