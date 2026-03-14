import { c as createLucideIcon, r as reactExports, i as useEnterTournament, k as useSubmitTournamentScore, l as useCreateCheckoutSession, m as useTournamentLeaderboard, j as jsxRuntimeExports, b as Trophy, n as DEMO_FREE_TOURNAMENTS, o as DEMO_PAID_TOURNAMENTS, u as ue } from "./index-DxfWywI7.js";
import { B as Badge } from "./badge-Bbiblt_i.js";
import { B as Button } from "./button-DQnXPu5m.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-CaWCcti_.js";
import { I as Input } from "./input-C6uZ0nKh.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-AHXU0P9c.js";
import { S as Star, R as RewardedAdModal } from "./RewardedAdModal-BgaDfwyM.js";
import { m as motion } from "./proxy-DeveODeX.js";
import { C as Crown, M as Medal } from "./medal-BIC2sV2Y.js";
import { C as Calendar } from "./calendar-UJ2qSBaK.js";
import { Z as Zap } from "./zap-BExIDFDf.js";
import { U as Users } from "./users-B5jI3wum.js";
import { L as Lock } from "./lock-DLKYff1i.js";
import { A as AnimatePresence } from "./index-D7munqaB.js";
import "./index-D3wj4Pvk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
];
const LockOpen = createLucideIcon("lock-open", __iconNode);
function TournamentsPage() {
  const [adModalOpen, setAdModalOpen] = reactExports.useState(false);
  const [pendingTournament, setPendingTournament] = reactExports.useState(
    null
  );
  const [scoreModalOpen, setScoreModalOpen] = reactExports.useState(false);
  const [activeTournament, setActiveTournament] = reactExports.useState(
    null
  );
  const [submitCount, setSubmitCount] = reactExports.useState("");
  const [joinedTournaments, setJoinedTournaments] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const [selectedLeaderboard, setSelectedLeaderboard] = reactExports.useState(null);
  const { mutateAsync: enterTournament } = useEnterTournament();
  const { mutateAsync: submitScore, isPending: isSubmitting } = useSubmitTournamentScore();
  const { mutateAsync: createCheckout, isPending: isCheckingOut } = useCreateCheckoutSession();
  const { data: leaderboard } = useTournamentLeaderboard(
    (selectedLeaderboard == null ? void 0 : selectedLeaderboard.id) ?? null
  );
  const handleFreeJoinRequest = (tournament) => {
    setPendingTournament(tournament);
    setAdModalOpen(true);
  };
  const handleAdComplete = async () => {
    setAdModalOpen(false);
    if (!pendingTournament) return;
    try {
      await enterTournament(pendingTournament.id);
      setJoinedTournaments(
        (prev) => new Set(prev).add(pendingTournament.id.toString())
      );
      ue.success(`🎉 You joined ${pendingTournament.name}!`);
    } catch {
      ue.error("Could not join tournament. Please try again.");
    }
    setPendingTournament(null);
  };
  const handlePaidJoin = async (tournament) => {
    try {
      const sessionUrl = await createCheckout({
        items: [
          {
            productName: `TeenTuffLifts Tournament: ${tournament.name}`,
            currency: "inr",
            quantity: BigInt(1),
            priceInCents: BigInt(5e3),
            productDescription: "Tournament entry fee — prizes await!"
          }
        ],
        successUrl: `${window.location.origin}?tournament_success=${tournament.id}`,
        cancelUrl: window.location.href
      });
      window.location.href = sessionUrl;
    } catch {
      ue.error("Payment setup failed. Please try again.");
    }
  };
  const handleSubmitScore = async () => {
    if (!activeTournament) return;
    const count = Number.parseInt(submitCount);
    if (!count || count <= 0) {
      ue.error("Enter a valid push-up count");
      return;
    }
    try {
      await submitScore({
        tournamentId: activeTournament.id,
        pushupCount: BigInt(count)
      });
      ue.success(`🏆 Score of ${count} push-ups submitted!`);
      setScoreModalOpen(false);
      setSubmitCount("");
    } catch {
      ue.error("Could not submit score. Please try again.");
    }
  };
  const getDaysLeft = (endDate) => {
    const ms = Number(endDate) / 1e6;
    const diff = ms - Date.now();
    const days = Math.ceil(diff / (1e3 * 60 * 60 * 24));
    return days;
  };
  const prizes = [
    { place: "1st", icon: "🥇", reward: "3 Months Ad-Free + XP Bonus" },
    { place: "2nd", icon: "🥈", reward: "2 Months Ad-Free" },
    { place: "3rd", icon: "🥉", reward: "1 Month Ad-Free" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-black flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-6 h-6 text-neon-orange" }),
        "Tournaments"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Compete. Win. Level up. 🏆" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "card-sporty p-4 mb-4",
          style: {
            background: "linear-gradient(135deg, oklch(0.16 0.04 265), oklch(0.18 0.06 60 / 0.3))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-neon-orange" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-sm", children: "Prizes" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: prizes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: p.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-xs w-6", children: p.place }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-body text-xs", children: p.reward })
            ] }, p.place)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground font-body border-t border-border/30 pt-2", children: "Free tournaments also award bonus XP to the winner!" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "free", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full bg-secondary mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              "data-ocid": "tournaments.free.tab",
              value: "free",
              className: "flex-1 font-body data-[state=active]:text-neon-green",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-3.5 h-3.5 mr-1" }),
                " Free"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              "data-ocid": "tournaments.paid.tab",
              value: "paid",
              className: "flex-1 font-body data-[state=active]:text-neon-orange",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3.5 h-3.5 mr-1" }),
                " Paid (₹50)"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "free", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: DEMO_FREE_TOURNAMENTS.map((tournament, index) => {
          const joined = joinedTournaments.has(
            tournament.id.toString()
          );
          const daysLeft = getDaysLeft(tournament.endDate);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              "data-ocid": `tournaments.free.item.${index + 1}`,
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              className: "card-sporty p-4 space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm", children: tournament.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: "text-[10px] bg-chart-2/20 text-chart-2 border-chart-2/30 border",
                          variant: "outline",
                          children: "FREE"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground font-body", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                        daysLeft > 0 ? `${daysLeft} days left` : "Ended"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 text-neon-green" }),
                        "XP Prize"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex flex-col gap-1.5", children: !joined ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "tournaments.join.button",
                      size: "sm",
                      onClick: () => handleFreeJoinRequest(tournament),
                      className: "bg-primary text-primary-foreground font-body font-semibold text-xs h-8",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mr-1" }),
                        " Join"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: "bg-primary/20 text-neon-green border-primary/30 border text-xs",
                        variant: "outline",
                        children: "Joined ✓"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        "data-ocid": "tournaments.submit_score.button",
                        size: "sm",
                        variant: "outline",
                        onClick: () => {
                          setActiveTournament(tournament);
                          setScoreModalOpen(true);
                        },
                        className: "border-border text-xs h-8 font-body",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "w-3 h-3 mr-1" }),
                          " Submit Score"
                        ]
                      }
                    )
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "w-full text-left bg-muted/30 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body hover:bg-muted/50 transition-colors flex items-center gap-2",
                    onClick: () => {
                      setSelectedLeaderboard(
                        (selectedLeaderboard == null ? void 0 : selectedLeaderboard.id) === tournament.id ? null : tournament
                      );
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
                      (selectedLeaderboard == null ? void 0 : selectedLeaderboard.id) === tournament.id ? "Hide leaderboard ▲" : "View leaderboard ▼"
                    ]
                  }
                ),
                (selectedLeaderboard == null ? void 0 : selectedLeaderboard.id) === tournament.id && /* @__PURE__ */ jsxRuntimeExports.jsx(LeaderboardPreview, { leaderboard: leaderboard ?? [] })
              ]
            },
            tournament.id.toString()
          );
        }) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "paid", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: DEMO_PAID_TOURNAMENTS.map((tournament, index) => {
          const joined = joinedTournaments.has(tournament.id.toString());
          const daysLeft = getDaysLeft(tournament.endDate);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              className: "card-sporty p-4 space-y-3",
              style: {
                background: "linear-gradient(135deg, oklch(0.16 0.04 265), oklch(0.18 0.08 60 / 0.2))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm", children: tournament.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          className: "text-[10px] bg-neon-orange/20 text-neon-orange border-neon-orange/30 border",
                          variant: "outline",
                          children: "₹50"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground font-body", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                        daysLeft > 0 ? `${daysLeft} days left` : "Ended"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3 h-3 text-neon-orange" }),
                        "3 months ad-free"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex flex-col gap-1.5", children: !joined ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "tournaments.join.button",
                      size: "sm",
                      onClick: () => handlePaidJoin(tournament),
                      disabled: isCheckingOut,
                      className: "bg-neon-orange/90 text-white font-body font-semibold text-xs h-8",
                      style: { backgroundColor: "oklch(0.72 0.22 42)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-3 h-3 mr-1" }),
                        isCheckingOut ? "Loading..." : "Pay & Join"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: "bg-primary/20 text-neon-green border-primary/30 border text-xs",
                        variant: "outline",
                        children: "Joined ✓"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        "data-ocid": "tournaments.submit_score.button",
                        size: "sm",
                        variant: "outline",
                        onClick: () => {
                          setActiveTournament(tournament);
                          setScoreModalOpen(true);
                        },
                        className: "border-border text-xs h-8 font-body",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "w-3 h-3 mr-1" }),
                          " Submit Score"
                        ]
                      }
                    )
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: prizes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "bg-muted/30 rounded-xl p-2 text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg", children: p.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-body leading-tight", children: p.reward })
                    ]
                  },
                  p.place
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Paid tournaments held every 2 months. Entry secures your spot in the championship." })
                ] })
              ]
            },
            tournament.id.toString()
          );
        }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RewardedAdModal,
      {
        open: adModalOpen,
        onComplete: handleAdComplete,
        onCancel: () => {
          setAdModalOpen(false);
          setPendingTournament(null);
        },
        title: "Unlock Tournament",
        description: "Watch a short ad to join this free tournament and compete for XP"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: scoreModalOpen, onOpenChange: setScoreModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "w-5 h-5 text-neon-orange" }),
          "Submit Your Score"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "font-body text-muted-foreground", children: activeTournament == null ? void 0 : activeTournament.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "submit-count",
              className: "text-sm font-body text-muted-foreground mb-1 block",
              children: "Push-up count"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "submit-count",
              type: "number",
              placeholder: "e.g. 42",
              value: submitCount,
              onChange: (e) => setSubmitCount(e.target.value),
              className: "bg-input border-border text-foreground h-12 text-lg font-display font-bold",
              min: 1
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1 font-body",
              onClick: () => setScoreModalOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "tournaments.submit_score.button",
              className: "flex-1 bg-primary text-primary-foreground font-body font-semibold glow-green",
              onClick: handleSubmitScore,
              disabled: isSubmitting || !submitCount,
              children: isSubmitting ? "Submitting..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4 mr-1" }),
                " Submit"
              ] })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
function LeaderboardPreview({ leaderboard }) {
  if (leaderboard.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-3 text-xs text-muted-foreground font-body", children: "No scores yet — be the first! 🏆" });
  }
  const medals = ["🥇", "🥈", "🥉"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: leaderboard.slice(0, 5).map((entry, idx) => {
    var _a, _b, _c;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 bg-muted/20 rounded-xl px-3 py-1.5 text-xs font-body",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: medals[idx] ?? `#${idx + 1}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1 text-foreground truncate", children: [
            (_a = entry.userId) == null ? void 0 : _a.toString().slice(0, 16),
            "..."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-neon-green font-bold", children: [
            (_b = entry.pushupCount) == null ? void 0 : _b.toString(),
            " reps"
          ] })
        ]
      },
      `${(_c = entry.userId) == null ? void 0 : _c.toString()}-${idx}`
    );
  }) });
}
export {
  TournamentsPage as default
};
