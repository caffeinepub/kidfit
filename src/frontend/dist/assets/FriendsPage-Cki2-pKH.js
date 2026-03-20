import { c as createLucideIcon, h as useActor, Y as useQueryClient, $ as useMyFriends, a0 as useMyFriendRequests, r as reactExports, j as jsxRuntimeExports, s as Users, u as ue } from "./index-BcUOA3D1.js";
import { B as Button } from "./button-DTjOIEvm.js";
import { I as Input } from "./input-CVXI-8t7.js";
import { S as Skeleton } from "./skeleton-1SdpAEKN.js";
import { T as TierBadge } from "./TierBadge-hBikvlNQ.js";
import { g as getTierFromXp } from "./xp-wpql39xV.js";
import { m as motion } from "./proxy-DdZ1Pap_.js";
import { C as Check } from "./check-CRqoKkX2.js";
import { X } from "./x-D4hweFTz.js";
import { A as AnimatePresence } from "./index-CHX-B-HN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function truncatePrincipal(p) {
  if (p.length <= 14) return p;
  return `${p.slice(0, 7)}...${p.slice(-5)}`;
}
function FriendCard({
  principal,
  label
}) {
  var _a;
  const p = principal.toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      className: "flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/60",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-base flex-shrink-0",
            style: {
              background: "oklch(0.82 0.17 90 / 0.15)",
              border: "1px solid oklch(0.82 0.17 90 / 0.35)",
              color: "oklch(0.82 0.17 90)"
            },
            children: ((_a = p[0]) == null ? void 0 : _a.toUpperCase()) ?? "?"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground truncate", children: truncatePrincipal(p) }),
          label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-body", children: label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          UserCheck,
          {
            className: "w-4 h-4 flex-shrink-0",
            style: { color: "oklch(0.82 0.17 90)" }
          }
        )
      ]
    }
  );
}
function FriendsPage() {
  var _a;
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: friends = [], isLoading: friendsLoading } = useMyFriends();
  const { data: requests = [], isLoading: requestsLoading } = useMyFriendRequests();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searching, setSearching] = reactExports.useState(false);
  const [searchResult, setSearchResult] = reactExports.useState(null);
  const [sendingTo, setSendingTo] = reactExports.useState(null);
  const [processingRequest, setProcessingRequest] = reactExports.useState(
    null
  );
  const handleSearch = async () => {
    if (!searchQuery.trim() || !actor) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const result = await actor.searchUserByUsername(searchQuery.trim());
      setSearchResult(result ?? "not_found");
    } catch (_err) {
      ue.error("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };
  const handleSendRequest = async (principalStr) => {
    if (!actor) return;
    setSendingTo(principalStr);
    try {
      const res = await actor.sendFriendRequest({ toString: () => principalStr });
      if ("err" in res) throw new Error(res.err);
      ue.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      ue.error(
        msg.includes("already") ? "Already friends or request pending" : "Could not send request"
      );
    } finally {
      setSendingTo(null);
    }
  };
  const handleAccept = async (from) => {
    if (!actor) return;
    const key = from.toString();
    setProcessingRequest(key);
    try {
      const res = await actor.acceptFriendRequest(from);
      if ("err" in res) throw new Error(res.err);
      ue.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["myFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
      queryClient.invalidateQueries({ queryKey: ["friendsLeaderboard"] });
    } catch {
      ue.error("Could not accept request");
    } finally {
      setProcessingRequest(null);
    }
  };
  const handleDecline = async (from) => {
    if (!actor) return;
    const key = from.toString();
    setProcessingRequest(key);
    try {
      const res = await actor.declineFriendRequest(from);
      if ("err" in res) throw new Error(res.err);
      ue.success("Request declined");
      queryClient.invalidateQueries({ queryKey: ["myFriendRequests"] });
    } catch {
      ue.error("Could not decline request");
    } finally {
      setProcessingRequest(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen gradient-mesh pb-36", "data-ocid": "friends.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "w-10 h-10 rounded-xl flex items-center justify-center",
          style: {
            background: "oklch(0.82 0.17 90 / 0.1)",
            border: "1px solid oklch(0.82 0.17 90 / 0.3)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Users,
            {
              className: "w-5 h-5",
              style: { color: "oklch(0.82 0.17 90)" }
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-black text-foreground tracking-tight", children: "Friends" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Search, connect & compete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg mx-auto px-4 pt-5 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-display font-bold text-sm mb-3 uppercase tracking-wider",
            style: { color: "oklch(0.82 0.17 90)" },
            children: "Find a Friend"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "friends.search_input",
                placeholder: "Search by username…",
                value: searchQuery,
                onChange: (e) => {
                  setSearchQuery(e.target.value);
                  setSearchResult(null);
                },
                onKeyDown: (e) => e.key === "Enter" && handleSearch(),
                className: "pl-9 font-body bg-card/80 border-border/60 focus:border-[oklch(0.82_0.17_90/0.6)]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "friends.search.button",
              onClick: handleSearch,
              disabled: searching || !searchQuery.trim(),
              style: {
                background: "oklch(0.82 0.17 90 / 0.15)",
                border: "1px solid oklch(0.82 0.17 90 / 0.4)",
                color: "oklch(0.82 0.17 90)"
              },
              className: "font-display font-bold shrink-0",
              children: searching ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : "Search"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: searchResult !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -8 },
            className: "mt-3",
            children: searchResult === "not_found" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-sporty p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "No user found with that username" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-4 rounded-xl border flex items-center gap-3",
                style: {
                  background: "oklch(0.82 0.17 90 / 0.06)",
                  border: "1px solid oklch(0.82 0.17 90 / 0.3)"
                },
                "data-ocid": "friends.search.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-11 h-11 rounded-full flex items-center justify-center font-display font-black text-lg flex-shrink-0",
                      style: {
                        background: "oklch(0.82 0.17 90 / 0.15)",
                        color: "oklch(0.82 0.17 90)"
                      },
                      children: (_a = searchResult.username[0]) == null ? void 0 : _a.toUpperCase()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-base text-foreground", children: searchResult.username }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TierBadge,
                      {
                        tier: getTierFromXp(
                          Number(searchResult.xp)
                        ).tier,
                        size: "sm",
                        className: "mt-1"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "friends.send_request.button",
                      size: "sm",
                      disabled: sendingTo === searchResult.id.toString(),
                      onClick: () => handleSendRequest(
                        searchResult.id.toString()
                      ),
                      className: "font-display font-bold shrink-0 gap-1",
                      style: {
                        background: "oklch(0.82 0.17 90)",
                        color: "oklch(0.15 0.02 42)"
                      },
                      children: [
                        sendingTo === searchResult.id.toString() ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-3.5 h-3.5" }),
                        "Add"
                      ]
                    }
                  )
                ]
              }
            )
          },
          searchResult === "not_found" ? "nf" : searchResult.id.toString()
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-display font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2",
            style: { color: "oklch(0.82 0.17 90)" },
            children: [
              "Pending Requests",
              requests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black",
                  style: {
                    background: "oklch(0.82 0.17 90)",
                    color: "oklch(0.15 0.02 42)"
                  },
                  children: requests.length
                }
              )
            ]
          }
        ),
        requestsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "space-y-2",
            "data-ocid": "friends.requests.loading_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" })
            ]
          }
        ) : requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "p-5 rounded-xl text-center",
            style: {
              background: "oklch(0.14 0.025 42 / 0.6)",
              border: "1px solid oklch(0.25 0.03 42 / 0.5)"
            },
            "data-ocid": "friends.requests.empty_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "No pending requests" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: requests.map((from, i) => {
          var _a2;
          const key = from.toString();
          const isProcessing = processingRequest === key;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -12 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: i * 0.05 },
              "data-ocid": `friends.request.item.${i + 1}`,
              className: "flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/60",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0",
                    style: {
                      background: "oklch(0.82 0.17 90 / 0.1)",
                      border: "1px solid oklch(0.82 0.17 90 / 0.3)",
                      color: "oklch(0.82 0.17 90)"
                    },
                    children: (_a2 = key[0]) == null ? void 0 : _a2.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground truncate", children: truncatePrincipal(key) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-body", children: "Wants to be your friend" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": `friends.accept.button.${i + 1}`,
                      size: "sm",
                      disabled: isProcessing,
                      onClick: () => handleAccept(from),
                      className: "h-7 px-2 font-display font-bold gap-1",
                      style: {
                        background: "oklch(0.82 0.17 90)",
                        color: "oklch(0.15 0.02 42)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }),
                        "Accept"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": `friends.decline.button.${i + 1}`,
                      size: "sm",
                      variant: "outline",
                      disabled: isProcessing,
                      onClick: () => handleDecline(from),
                      className: "h-7 px-2 font-display font-bold gap-1 border-destructive/50 text-destructive hover:bg-destructive/10",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                    }
                  )
                ] })
              ]
            },
            key
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "h2",
          {
            className: "font-display font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2",
            style: { color: "oklch(0.82 0.17 90)" },
            children: [
              "My Friends",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-body normal-case text-xs font-normal", children: [
                "(",
                friends.length,
                ")"
              ] })
            ]
          }
        ),
        friendsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "friends.list.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 rounded-xl" })
        ] }) : friends.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-8 rounded-xl text-center",
            style: {
              background: "oklch(0.14 0.025 42 / 0.6)",
              border: "1px solid oklch(0.25 0.03 42 / 0.5)"
            },
            "data-ocid": "friends.list.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-3", children: "👥" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-base text-foreground mb-1", children: "No friends yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Search for teammates and send them a request!" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "friends.list", children: friends.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": `friends.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FriendCard, { principal: p, label: "Friend" }) }, p.toString())) })
      ] })
    ] })
  ] });
}
export {
  FriendsPage as default
};
