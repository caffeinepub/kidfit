import { c as createLucideIcon, r as reactExports, a as useUserProfile, p as useInternetIdentity, j as jsxRuntimeExports } from "./index-DolueZgJ.js";
import { B as Button } from "./button-51do7E5m.js";
import { S as Star, P as Progress, R as RewardedAdModal } from "./RewardedAdModal-rn-qqaiu.js";
import { S as Skeleton } from "./skeleton-CT3a1Ilr.js";
import { T as Tier } from "./backend.d-AW0U9QfA.js";
import { T as TierBadge } from "./TierBadge-CbfUiiIE.js";
import { u as useAdUnlock, a as usePushUpStats } from "./usePushUpStats-BJ11OiNQ.js";
import { g as getTierFromXp, a as getXpProgress, b as getXpToNextTier, c as getTierInfo, l as levelFromXp, T as TIERS } from "./xp-CXubY13s.js";
import { m as motion } from "./proxy-DQBOwY0Y.js";
import { E as EyeOff, a as Eye } from "./eye-klwfYr1X.js";
import { S as Shield } from "./shield-BvhX1zCl.js";
import { C as Calendar } from "./calendar-DNauiJ0q.js";
import { Z as Zap } from "./zap-DPkJPyGO.js";
import { A as AnimatePresence } from "./index-CyL8q5zV.js";
import "./dialog-DK7AtQpF.js";
import "./index-CPgsmMe1.js";
import "./pushUpStats-BXMh0rBw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = createLucideIcon("award", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
function ProfilePage({
  onNavigate: _onNavigate
}) {
  var _a, _b;
  const { isUnlocked: profileUnlocked, unlock: unlockProfile } = useAdUnlock();
  const [adModalOpen, setAdModalOpen] = reactExports.useState(false);
  const { data: profile, isLoading } = useUserProfile();
  const { clear, identity } = useInternetIdentity();
  const { stats } = usePushUpStats();
  const handleViewProfile = () => {
    setAdModalOpen(true);
  };
  const handleAdComplete = () => {
    setAdModalOpen(false);
    unlockProfile();
  };
  const xp = profile ? Number(profile.xp) : 0;
  const level = levelFromXp(xp);
  const tier = (profile == null ? void 0 : profile.tier) ?? Tier.bronze;
  const xpTierInfo = getTierFromXp(xp);
  const xpProgress = getXpProgress(xp, xpTierInfo);
  const xpToNext = getXpToNextTier(xp, xpTierInfo);
  const now = BigInt(Date.now()) * BigInt(1e6);
  const isAdFree = (profile == null ? void 0 : profile.adFreeUntil) ? profile.adFreeUntil > now : false;
  const adFreeDate = (profile == null ? void 0 : profile.adFreeUntil) ? new Date(Number(profile.adFreeUntil) / 1e6).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ) : null;
  const TIERS_NEXT = {
    [Tier.bronze]: Tier.silver,
    [Tier.silver]: Tier.gold,
    [Tier.gold]: Tier.platinum,
    [Tier.platinum]: Tier.diamond
  };
  const nextTier = TIERS_NEXT[tier];
  const nextTierInfo = nextTier ? getTierInfo(nextTier) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-black flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-6 h-6 text-chart-4" }),
          "Profile"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Your stats & achievements" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: identity && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => clear(),
          className: "border-border text-muted-foreground hover:text-foreground font-body gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3 h-3" }),
            "Logout"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !profileUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-6 mb-4 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter blur-md pointer-events-none select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center text-3xl", children: "💪" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-2xl", children: isLoading ? "Loading..." : (profile == null ? void 0 : profile.username) ?? "Athlete" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-sm font-body", children: "Fitness Warrior" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-primary/30 rounded mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted/50 rounded w-3/4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-10 h-10 text-muted-foreground mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base mb-1", children: "Profile Locked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body text-center px-4", children: "Watch a short ad to view your stats" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "profile.view.button",
              onClick: handleViewProfile,
              className: "w-full h-14 bg-primary text-primary-foreground font-display font-bold text-base glow-green",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5 mr-2" }),
                "Watch Ad to View Profile"
              ]
            }
          )
        ]
      },
      "locked"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-sporty p-6", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-16 rounded-2xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-32" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" })
            ] })
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-3xl font-display", children: ((_b = (_a = profile == null ? void 0 : profile.username) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) ?? "?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl", children: (profile == null ? void 0 : profile.username) ?? "Athlete" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier, size: "sm" }),
                  isAdFree && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-chart-2/20 text-chart-2 border border-chart-2/30 rounded-full px-2 py-0.5 font-body font-medium", children: "Ad-Free ✨" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      className: "w-4 h-4 text-neon-green",
                      fill: "currentColor"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-sm", children: [
                    "Level ",
                    level
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-body", children: [
                  xp.toLocaleString(),
                  " XP"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: xpProgress, className: "h-3 mb-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground font-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  xpTierInfo.label,
                  " Tier"
                ] }),
                nextTierInfo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  xpToNext,
                  " XP to ",
                  nextTierInfo.label
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green font-semibold", children: "Maximum Tier! 🏆" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl p-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-2xl text-neon-green", children: xp.toLocaleString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "Total XP" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-xl p-3 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-2xl text-neon-cyan", children: level }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "Level" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "profile.session_count.card",
                  className: "bg-muted/30 rounded-xl p-3 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-2xl text-primary", children: stats.sessionCount }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "Sessions Done" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "profile.total_pushups.card",
                  className: "bg-muted/30 rounded-xl p-3 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-2xl text-neon-cyan", children: stats.totalPushUps.toLocaleString() }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "Total Push-Ups" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "profile.badges.section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm mb-2 flex items-center gap-1", children: "🏅 Badges Earned" }),
              stats.badges.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body italic", children: "Complete push-up sessions to earn badges!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: stats.badges.map((badge) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "inline-flex flex-col items-center gap-0.5",
                  title: badge.description,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs bg-primary/10 border border-primary/40 text-primary rounded-full px-2.5 py-1 font-body font-medium", children: [
                      badge.emoji,
                      " ",
                      badge.label
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-body text-center max-w-[80px] leading-tight", children: badge.description })
                  ]
                },
                badge.id
              )) })
            ] })
          ] }) }),
          isAdFree && adFreeDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 5 },
              animate: { opacity: 1, y: 0 },
              className: "card-sporty p-4 flex items-center gap-3",
              style: {
                background: "linear-gradient(135deg, oklch(0.16 0.04 265), oklch(0.18 0.08 160 / 0.3))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-chart-2/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-chart-2" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-chart-2", children: "Ad-Free Active!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-body flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                    "Expires ",
                    adFreeDate
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-sm mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-neon-green" }),
              "Tier Progress"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: TIERS.map((t) => {
              const isCurrentTier = t.tier === tier;
              const TIER_ORDER = [
                Tier.bronze,
                Tier.silver,
                Tier.gold,
                Tier.platinum,
                Tier.diamond
              ];
              const isAchieved = TIER_ORDER.indexOf(t.tier) <= TIER_ORDER.indexOf(tier);
              const tierProg = isCurrentTier ? xpProgress : isAchieved ? 100 : 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-base ${isAchieved ? "opacity-100" : "opacity-30"}`,
                    children: t.emoji
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `font-display font-bold ${isCurrentTier ? "text-neon-green" : isAchieved ? "text-foreground" : "text-muted-foreground"}`,
                        children: t.label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-body", children: [
                      t.minXp.toLocaleString(),
                      "+ XP"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Progress,
                    {
                      value: tierProg,
                      className: `h-1.5 ${isCurrentTier ? "" : isAchieved ? "opacity-60" : "opacity-20"}`
                    }
                  )
                ] })
              ] }, t.tier);
            }) })
          ] }),
          identity && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-sporty p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-body truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
              "Principal:",
              " "
            ] }),
            identity.getPrincipal().toString()
          ] }) })
        ]
      },
      "unlocked"
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RewardedAdModal,
      {
        open: adModalOpen,
        onComplete: handleAdComplete,
        onCancel: () => setAdModalOpen(false),
        title: "View Your Profile",
        description: "Watch a short ad to unlock your full stats and progress"
      }
    )
  ] });
}
export {
  ProfilePage as default
};
