import { v as useInternetIdentity, a as useUserProfile, Q as useLeaderboard, W as useFriendsLeaderboard, j as jsxRuntimeExports, s as Users } from "./index-BcUOA3D1.js";
import { B as Badge } from "./badge-LJWw2Kut.js";
import { S as Skeleton } from "./skeleton-1SdpAEKN.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CWmrdtaq.js";
import { T as TierBadge } from "./TierBadge-hBikvlNQ.js";
import { g as getTierFromXp, l as levelFromXp } from "./xp-wpql39xV.js";
import { T as Trophy } from "./trophy-B9f39nzl.js";
import { m as motion } from "./proxy-DdZ1Pap_.js";
import { Z as Zap } from "./zap-CuJ95J1b.js";
import { C as Crown } from "./crown-DwN3hIs3.js";
import { M as Medal } from "./medal-BLWke7Fm.js";
import "./index-C15OgHN2.js";
import "./index-D945dZqG.js";
const rankMeta = [
  {
    medal: "🥇",
    bg: "from-yellow-900/40 to-yellow-800/20",
    border: "border-yellow-500/50",
    glow: "shadow-[0_0_20px_oklch(0.78_0.2_82/0.35)]",
    label: "Champion",
    rankColor: "text-yellow-400"
  },
  {
    medal: "🥈",
    bg: "from-slate-700/40 to-slate-600/20",
    border: "border-slate-400/50",
    glow: "shadow-[0_0_14px_oklch(0.7_0.01_265/0.3)]",
    label: "Runner-up",
    rankColor: "text-slate-300"
  },
  {
    medal: "🥉",
    bg: "from-amber-900/30 to-amber-800/10",
    border: "border-amber-600/40",
    glow: "shadow-[0_0_12px_oklch(0.62_0.14_55/0.3)]",
    label: "3rd Place",
    rankColor: "text-amber-500"
  }
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 }
  }
};
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-5 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-4" })
    ] })
  ] });
}
function PodiumCard({
  entry,
  rank,
  currentPrincipal
}) {
  const meta = rankMeta[rank - 1];
  const tierInfo = getTierFromXp(Number(entry.xp));
  const isCurrentUser = entry.id.toString() === currentPrincipal;
  const isFirst = rank === 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: rank === 1 ? 0.05 : rank === 2 ? 0.15 : 0.2 },
      "data-ocid": `leaderboard.item.${rank}`,
      className: `flex flex-col items-center p-3 rounded-2xl border bg-gradient-to-b ${meta.bg} ${meta.border} ${isFirst ? meta.glow : ""} ${isFirst ? "-mt-4" : ""} ${isCurrentUser ? "ring-2 ring-neon-green" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isFirst ? "text-3xl" : "text-2xl", children: meta.medal }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `font-display font-bold text-center mt-1 truncate w-full leading-tight ${isFirst ? "text-sm text-yellow-200" : "text-xs"}`,
            children: entry.username
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TierBadge,
          {
            tier: tierInfo.tier,
            size: "sm",
            showLabel: false,
            className: "mt-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `font-body mt-1 ${isFirst ? "text-xs text-yellow-400 font-semibold" : "text-[10px] text-muted-foreground"}`,
            children: [
              Number(entry.xp).toLocaleString(),
              " XP"
            ]
          }
        )
      ]
    }
  );
}
function RankedList({
  entries,
  currentPrincipal
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      variants: containerVariants,
      initial: "hidden",
      animate: "visible",
      className: "space-y-1.5",
      "data-ocid": "leaderboard.list",
      children: entries.map((entry, idx) => {
        const isCurrentUser = entry.id.toString() === currentPrincipal;
        const rank = idx + 1;
        const isTop3 = rank <= 3;
        if (isTop3) return null;
        const tierInfo = getTierFromXp(Number(entry.xp));
        const level = levelFromXp(Number(entry.xp));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            variants: itemVariants,
            className: `flex items-center gap-3 p-3 rounded-xl border transition-all ${isCurrentUser ? "border-neon-green/60 bg-neon-green/5 shadow-[0_0_12px_oklch(0.85_0.22_130/0.2)]" : "border-border/50 bg-card/60 hover:bg-card"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black flex-shrink-0 ${isCurrentUser ? "bg-neon-green text-background" : "bg-muted text-muted-foreground"}`,
                  children: rank
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `font-display font-bold text-sm truncate ${isCurrentUser ? "text-neon-green" : "text-foreground"}`,
                      children: entry.username
                    }
                  ),
                  isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[9px] px-1.5 py-0 border-neon-green/50 text-neon-green leading-none h-4",
                      children: "YOU"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "w-3 h-3 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-body", children: [
                    "Lv.",
                    level
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier: tierInfo.tier, size: "sm", showLabel: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `text-xs font-display font-bold ${isCurrentUser ? "text-neon-green" : "text-foreground"}`,
                      children: Number(entry.xp).toLocaleString()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-body", children: "XP" })
                ] })
              ] })
            ]
          },
          entry.id.toString()
        );
      })
    }
  );
}
function LeaderboardContent({
  entries,
  isLoading,
  currentPrincipal,
  emptyMessage
}) {
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "leaderboard.loading_state", children: ["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, k)) });
  }
  if (entries.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        className: "card-sporty p-10 text-center",
        "data-ocid": "leaderboard.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "🏆" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground mb-1", children: "No Athletes Yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: emptyMessage })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    entries.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PodiumCard,
        {
          entry: entries[1],
          rank: 2,
          currentPrincipal
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PodiumCard,
        {
          entry: entries[0],
          rank: 1,
          currentPrincipal
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PodiumCard,
        {
          entry: entries[2],
          rank: 3,
          currentPrincipal
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RankedList, { entries, currentPrincipal })
  ] });
}
function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: globalEntries = [], isLoading: globalLoading } = useLeaderboard();
  const { data: friendsEntries = [], isLoading: friendsLoading } = useFriendsLeaderboard();
  const currentPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
  const myRankIndex = globalEntries.findIndex(
    (e) => e.id.toString() === currentPrincipal
  );
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen gradient-mesh pb-36",
      "data-ocid": "leaderboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-neon-green" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-black text-foreground tracking-tight", children: "Leaderboard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Rankings by XP" })
            ] })
          ] }),
          myRank !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { type: "spring", stiffness: 300 },
              className: "flex items-center gap-1.5 bg-neon-green/10 border border-neon-green/40 rounded-full px-3 py-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-neon-green" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display font-bold text-neon-green", children: [
                  "#",
                  myRank
                ] })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto px-4 pt-4 space-y-3", children: [
          profile && myRank !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              className: "card-sporty p-3 border-neon-green/40 glow-green",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-neon-green" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-muted-foreground", children: "Your Global Rank" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto font-display font-black text-neon-green text-lg", children: [
                  "#",
                  myRank
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-body", children: [
                  "of ",
                  globalEntries.length
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "global", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsList,
              {
                className: "w-full mb-4",
                style: {
                  background: "oklch(0.14 0.025 42 / 0.8)",
                  border: "1px solid oklch(0.25 0.03 42 / 0.6)"
                },
                "data-ocid": "leaderboard.tab",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "global",
                      className: "flex-1 font-display font-bold data-[state=active]:text-foreground",
                      style: {
                        "--tab-active-bg": "oklch(0.82 0.17 90 / 0.15)"
                      },
                      "data-ocid": "leaderboard.global.tab",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3.5 h-3.5 mr-1.5" }),
                        "Global"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "friends",
                      className: "flex-1 font-display font-bold data-[state=active]:text-foreground",
                      "data-ocid": "leaderboard.friends.tab",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 mr-1.5" }),
                        "Friends"
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "global", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              LeaderboardContent,
              {
                entries: globalEntries,
                isLoading: globalLoading,
                currentPrincipal,
                emptyMessage: "Be the first! Complete a workout to claim the #1 spot."
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "friends", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              LeaderboardContent,
              {
                entries: friendsEntries,
                isLoading: friendsLoading,
                currentPrincipal,
                emptyMessage: "Add friends to see how you stack up against them!"
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
export {
  LeaderboardPage as default
};
