import { j as jsxRuntimeExports, h as cn } from "./index-j5uH3y76.js";
import { T as Tier } from "./backend.d-AW0U9QfA.js";
import { c as getTierInfo } from "./xp-CXubY13s.js";
function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  className
}) {
  const info = getTierInfo(tier);
  const sizeClasses = {
    sm: { badge: "px-2 py-0.5 text-xs gap-1", emoji: "text-sm" },
    md: { badge: "px-3 py-1 text-sm gap-1.5", emoji: "text-base" },
    lg: { badge: "px-4 py-1.5 text-base gap-2", emoji: "text-xl" },
    xl: { badge: "px-6 py-2 text-lg gap-2", emoji: "text-2xl" }
  };
  const tierBorderColors = {
    [Tier.bronze]: "border-tier-bronze/50 bg-amber-900/20",
    [Tier.silver]: "border-tier-silver/50 bg-slate-500/20",
    [Tier.gold]: "border-tier-gold/50 bg-yellow-600/20",
    [Tier.platinum]: "border-tier-platinum/50 bg-cyan-700/20",
    [Tier.diamond]: "border-tier-diamond/50 bg-blue-600/20"
  };
  const tierTextColors = {
    [Tier.bronze]: "text-tier-bronze",
    [Tier.silver]: "text-tier-silver",
    [Tier.gold]: "text-tier-gold",
    [Tier.platinum]: "text-tier-platinum",
    [Tier.diamond]: "text-tier-diamond"
  };
  const { badge, emoji } = sizeClasses[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center rounded-full border font-display font-bold tracking-wide",
        badge,
        tierBorderColors[tier],
        tierTextColors[tier],
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: emoji, children: info.emoji }),
        showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.label })
      ]
    }
  );
}
export {
  TierBadge as T
};
