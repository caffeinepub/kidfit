import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as ue, a as useUserProfile, D as Dumbbell, T as Target, b as Trophy, U as User } from "./index-D0XmhP_K.js";
import { B as Button } from "./button-L0vPL_zR.js";
import { P as Progress, S as Star } from "./progress-D8C1Gw1n.js";
import { S as Skeleton } from "./skeleton-CkamYrvf.js";
import { T as Tier } from "./backend.d-AW0U9QfA.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog--qHq_htA.js";
import { I as Input } from "./input-BEOSmmt2.js";
import { L as Label } from "./label-pI_jTrSo.js";
import { m as motion } from "./proxy-BACYzFMZ.js";
import { Z as Zap } from "./zap-CLMpFi37.js";
import { A as AnimatePresence } from "./index-B-J5n3sD.js";
import { T as TierBadge } from "./TierBadge-D-Rwjj9i.js";
import { g as getTierFromXp, a as getXpProgress, b as getXpToNextTier, c as getTierInfo } from "./xp-CXubY13s.js";
import "./index-B8LbKS0H.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$1);
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
const MISSIONS_BY_DAY = {
  1: {
    title: "Push-Up Blitz",
    desc: "50 push-ups today",
    target: 50,
    unit: "reps",
    xpReward: 200,
    badge: "🎯",
    exercise: "Push-Ups"
  },
  2: {
    title: "Plank Power",
    desc: "Hold a 2-minute plank",
    target: 120,
    unit: "seconds",
    xpReward: 150,
    badge: "⏱️",
    exercise: "Plank"
  },
  3: {
    title: "Jump King",
    desc: "100 jumping jacks",
    target: 100,
    unit: "reps",
    xpReward: 250,
    badge: "🦘",
    exercise: "Jumping Jacks"
  },
  4: {
    title: "Squat Squad",
    desc: "30 squats",
    target: 30,
    unit: "reps",
    xpReward: 180,
    badge: "🏋️",
    exercise: "Squats"
  },
  5: {
    title: "Burpee Beast",
    desc: "20 burpees",
    target: 20,
    unit: "reps",
    xpReward: 300,
    badge: "🔥",
    exercise: "Burpees"
  },
  6: {
    title: "Wall Warrior",
    desc: "1-minute wall sit",
    target: 60,
    unit: "seconds",
    xpReward: 200,
    badge: "🧱",
    exercise: "Wall Sit"
  },
  0: {
    title: "Push-Up Legend",
    desc: "75 push-ups today",
    target: 75,
    unit: "reps",
    xpReward: 350,
    badge: "👑",
    exercise: "Push-Ups"
  }
};
function getTodayKey(username) {
  const today = /* @__PURE__ */ new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `kidfit_daily_${username}_${yyyy}-${mm}-${dd}`;
}
function getTodayString() {
  const today = /* @__PURE__ */ new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function DailyMissionCard({ username }) {
  const today = /* @__PURE__ */ new Date();
  const dayOfWeek = today.getDay();
  const mission = MISSIONS_BY_DAY[dayOfWeek];
  const [missionData, setMissionData] = reactExports.useState(() => {
    const key = getTodayKey(username);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayString()) {
          return parsed;
        }
      } catch {
      }
    }
    return { date: getTodayString(), progress: 0, completed: false };
  });
  const [logOpen, setLogOpen] = reactExports.useState(false);
  const [inputValue, setInputValue] = reactExports.useState("");
  reactExports.useEffect(() => {
    const storedDate = missionData.date;
    const todayStr = getTodayString();
    if (storedDate !== todayStr) {
      const newData = {
        date: todayStr,
        progress: 0,
        completed: false
      };
      setMissionData(newData);
      localStorage.setItem(getTodayKey(username), JSON.stringify(newData));
    }
  }, [username, missionData.date]);
  const progressPercent = Math.min(
    100,
    Math.round(missionData.progress / mission.target * 100)
  );
  const handleLogSubmit = () => {
    const val = Number.parseInt(inputValue, 10);
    if (Number.isNaN(val) || val <= 0) {
      ue.error("Please enter a valid number");
      return;
    }
    const newProgress = Math.min(mission.target, missionData.progress + val);
    const completed = newProgress >= mission.target;
    const newData = {
      date: getTodayString(),
      progress: newProgress,
      completed
    };
    setMissionData(newData);
    localStorage.setItem(getTodayKey(username), JSON.stringify(newData));
    setInputValue("");
    setLogOpen(false);
    if (completed && !missionData.completed) {
      ue.success(`🎉 Mission Complete! +${mission.xpReward} XP earned!`, {
        duration: 4e3
      });
    } else {
      ue.success(`+${val} ${mission.unit} logged! Keep going!`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-ocid": "daily_mission.card",
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4, duration: 0.4 },
        className: "card-sporty p-5 relative overflow-hidden",
        style: {
          background: missionData.completed ? "linear-gradient(135deg, oklch(0.15 0.06 150), oklch(0.2 0.08 150 / 0.6))" : "linear-gradient(135deg, oklch(0.15 0.04 265), oklch(0.18 0.06 42 / 0.4))",
          border: missionData.completed ? "1px solid oklch(0.55 0.18 150 / 0.5)" : void 0
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 text-7xl opacity-10 -translate-y-1 translate-x-1 select-none pointer-events-none", children: mission.badge }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-neon-orange/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4 text-neon-orange" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-body text-muted-foreground uppercase tracking-wider", children: "Daily Mission" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-black text-base leading-tight text-foreground", children: mission.title })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 bg-primary/15 border border-primary/20 rounded-full px-2 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-neon-green" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display font-bold text-neon-green", children: [
                "+",
                mission.xpReward,
                " XP"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-muted-foreground mb-3", children: mission.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs font-body mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                missionData.progress,
                " / ",
                mission.target,
                " ",
                mission.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `font-semibold ${missionData.completed ? "text-neon-green" : "text-muted-foreground"}`,
                  children: [
                    progressPercent,
                    "%"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Progress,
              {
                value: progressPercent,
                className: "h-2.5",
                style: missionData.completed ? {
                  "--tw-ring-color": "oklch(0.7 0.18 150)"
                } : void 0
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: missionData.completed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "flex items-center justify-center gap-2 py-2",
              style: { textShadow: "0 0 20px oklch(0.7 0.18 150 / 0.6)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-neon-green" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-black text-neon-green text-base", children: [
                  "Mission Complete! ",
                  mission.badge
                ] })
              ]
            },
            "completed"
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "daily_mission.log.button",
                  onClick: () => setLogOpen(true),
                  size: "sm",
                  className: "w-full bg-primary/20 hover:bg-primary/30 text-neon-green border border-primary/30 font-display font-bold",
                  variant: "outline",
                  children: "Log Progress →"
                }
              )
            },
            "log"
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: logOpen, onOpenChange: setLogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display font-black text-xl flex items-center gap-2", children: [
        mission.badge,
        " Log ",
        mission.exercise
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
          "How many ",
          mission.unit === "seconds" ? "seconds" : "reps",
          " did you complete?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "mission-progress-input",
              className: "text-xs text-muted-foreground font-body uppercase tracking-wider",
              children: mission.unit === "seconds" ? "Seconds held" : "Reps completed"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mission-progress-input",
              "data-ocid": "daily_mission.progress.input",
              type: "number",
              min: "1",
              max: mission.target,
              placeholder: `Enter ${mission.unit}`,
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleLogSubmit(),
              className: "bg-muted/30 border-border font-body text-lg text-center h-12",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setLogOpen(false),
              className: "flex-1 border-border font-body",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "daily_mission.submit.button",
              onClick: handleLogSubmit,
              className: "flex-1 bg-primary text-primary-foreground font-display font-bold glow-green",
              children: "Log It! 💪"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const TIER_ORDER = [
  Tier.bronze,
  Tier.silver,
  Tier.gold,
  Tier.platinum,
  Tier.diamond
];
const TIERS_NEXT = {
  [Tier.bronze]: Tier.silver,
  [Tier.silver]: Tier.gold,
  [Tier.gold]: Tier.platinum,
  [Tier.platinum]: Tier.diamond
};
function HomePage({ onNavigate }) {
  const { data: profile, isLoading } = useUserProfile();
  const xp = profile ? Number(profile.xp) : 0;
  const level = profile ? Number(profile.level) : 1;
  const tier = (profile == null ? void 0 : profile.tier) ?? Tier.bronze;
  const xpTierInfo = getTierFromXp(xp);
  const xpProgress = getXpProgress(xp, xpTierInfo);
  const xpToNext = getXpToNextTier(xp, xpTierInfo);
  const nextTier = TIERS_NEXT[tier];
  const nextTierInfo = nextTier ? getTierInfo(nextTier) : null;
  const quickActions = [
    {
      id: "exercises",
      label: "Exercises",
      description: "View workout library",
      icon: Dumbbell,
      color: "text-neon-green",
      bg: "bg-primary/10 border-primary/20",
      ocid: "dashboard.exercises.button"
    },
    {
      id: "pushups",
      label: "Push-Up Counter",
      description: "AI-powered rep counter",
      icon: Target,
      color: "text-neon-cyan",
      bg: "bg-accent/10 border-accent/20",
      ocid: "dashboard.pushups.button"
    },
    {
      id: "tournaments",
      label: "Tournaments",
      description: "Compete & win prizes",
      icon: Trophy,
      color: "text-neon-orange",
      bg: "bg-chart-3/10 border-chart-3/20",
      ocid: "dashboard.tournaments.button"
    },
    {
      id: "profile",
      label: "My Profile",
      description: "Stats & achievements",
      icon: User,
      color: "text-chart-4",
      bg: "bg-chart-4/10 border-chart-4/20",
      ocid: "dashboard.profile.button"
    }
  ];
  const tierEmojis = {
    [Tier.bronze]: "🥉",
    [Tier.silver]: "🥈",
    [Tier.gold]: "🥇",
    [Tier.platinum]: "💎",
    [Tier.diamond]: "💠"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "px-4 pt-12 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Welcome back," }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-black text-foreground", children: [
              (profile == null ? void 0 : profile.username) ?? "Athlete",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green", children: "👋" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-8 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier, size: "sm" }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 px-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1, duration: 0.4 },
          className: "rounded-2xl p-5 border border-primary/25",
          style: {
            background: "linear-gradient(135deg, oklch(0.18 0.04 265) 0%, oklch(0.2 0.07 150 / 0.6) 100%)",
            boxShadow: "0 0 30px oklch(0.85 0.22 130 / 0.12), inset 0 1px 0 oklch(0.85 0.22 130 / 0.1)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-neon-green", fill: "currentColor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-lg", children: [
                  "Level ",
                  isLoading ? "—" : level
                ] })
              ] }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-6 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TierBadge, { tier, size: "sm" })
            ] }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full mb-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: xpProgress, className: "h-3 mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground font-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  xp.toLocaleString(),
                  " XP"
                ] }),
                nextTierInfo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  xpToNext,
                  " XP to ",
                  nextTierInfo.label
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green font-semibold", children: "MAX TIER! 🏆" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-between items-center", children: TIER_ORDER.map((tTier) => {
              const isCurrentTier = tTier === tier;
              const isAchieved = TIER_ORDER.indexOf(tTier) <= TIER_ORDER.indexOf(tier);
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `text-lg transition-all duration-300 ${isCurrentTier ? "scale-125 drop-shadow-[0_0_8px_currentColor]" : ""} ${isAchieved ? "opacity-100" : "opacity-30"}`,
                  children: tierEmojis[tTier]
                }
              ) }, tTier);
            }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.2, duration: 0.4 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-muted-foreground mb-3 uppercase tracking-wider", children: "Quick Actions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: quickActions.map((action, i) => {
              const Icon = action.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.25 + i * 0.05, duration: 0.3 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": action.ocid,
                      variant: "outline",
                      onClick: () => onNavigate(action.id),
                      className: `w-full h-auto flex flex-col items-start gap-2 p-4 border ${action.bg} hover:scale-[1.02] transition-all duration-200`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-background/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${action.color}` }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground", children: action.label }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground font-body", children: action.description })
                        ] })
                      ]
                    }
                  )
                },
                action.id
              );
            }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DailyMissionCard, { username: (profile == null ? void 0 : profile.username) ?? "athlete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.45, duration: 0.4 },
          className: "card-sporty p-5 relative overflow-hidden",
          style: {
            background: "linear-gradient(135deg, oklch(0.18 0.04 265), oklch(0.2 0.06 150 / 0.5))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-28 h-28 overflow-hidden rounded-bl-2xl opacity-60 flex items-center justify-center text-5xl", children: "💪" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-black text-xl text-neon-green mb-1", children: "Keep Grinding!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body pr-20", children: "Every rep counts. Bags, bottles, backpacks — anything heavy makes you stronger. You don't need a gym." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => onNavigate("exercises"),
                size: "sm",
                className: "bg-primary text-primary-foreground font-body font-semibold",
                children: "Start Workout →"
              }
            ) })
          ]
        }
      )
    ] })
  ] });
}
export {
  HomePage as default
};
