import { c as createLucideIcon, p as useInternetIdentity, s as useActor, a as useUserProfile, Q as useRegisterUser, t as useQueryClient, r as reactExports, j as jsxRuntimeExports } from "./index-j5uH3y76.js";
import { B as Button } from "./button-C3CVoxJl.js";
import { I as Input } from "./input-Bdg12VT6.js";
import { L as LoaderCircle } from "./loader-circle-D4V2g_Ts.js";
import { m as motion } from "./proxy-DItxXm2Y.js";
import { Z as Zap } from "./zap-VxfxwpFV.js";
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function getErrText(err) {
  if (err instanceof Error) return `${err.message} ${String(err)}`;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
function AuthPage() {
  const { login, loginStatus, isLoggingIn, identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { mutateAsync: registerUser, isPending: isRegistering } = useRegisterUser();
  const queryClient = useQueryClient();
  const [username, setUsername] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loadingTimedOut, setLoadingTimedOut] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  const isStillLoading = !!identity && (actorFetching || profileLoading) && !loadingTimedOut;
  reactExports.useEffect(() => {
    if (isStillLoading) {
      timerRef.current = setTimeout(() => setLoadingTimedOut(true), 6e3);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setLoadingTimedOut(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStillLoading]);
  const actorReady = !!actor && !actorFetching;
  const needsUsername = !!identity && (loadingTimedOut || actorReady && !profileLoading && !profile);
  const handleRegister = async (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Username must be 20 characters or less");
      return;
    }
    setError("");
    try {
      await registerUser(trimmed);
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["userProfile"] });
      }, 1500);
    } catch (err) {
      const msg = getErrText(err);
      if (msg.toLowerCase().includes("already registered")) {
        queryClient.refetchQueries({ queryKey: ["userProfile"] });
        return;
      }
      setError("Could not register. Please refresh and try again.");
    }
  };
  if (isStillLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen gradient-mesh flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-2xl font-black mb-4", children: [
        "TEEN",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green", children: "TUFF" }),
        "LIFTS"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-neon-green mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 font-body text-sm", children: "Loading your profile..." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen gradient-mesh flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "text-center mb-8",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-block mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-2", children: "💪" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-pulse-glow" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-black text-foreground tracking-tight mb-2", children: [
              "TEEN",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green", children: "TUFF" }),
              "LIFTS"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-lg max-w-xs", children: "Get strong anywhere. No gym, no excuses." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4, duration: 0.5 },
          className: "grid grid-cols-3 gap-3 w-full max-w-sm mb-8",
          children: [
            {
              emoji: "🏆",
              label: "Tournaments",
              value: "Win Prizes",
              glow: "shadow-[0_0_14px_oklch(0.72_0.22_42/0.3)]"
            },
            {
              emoji: "⭐",
              label: "Earn XP",
              value: "Level Up",
              glow: "shadow-[0_0_14px_oklch(0.85_0.22_130/0.3)]"
            },
            {
              emoji: "📸",
              label: "Push-Ups",
              value: "AI Counter",
              glow: "shadow-[0_0_14px_oklch(0.75_0.18_195/0.3)]"
            }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-2xl text-center p-3 border border-border/60 bg-card/80 backdrop-blur-sm ${stat.glow}`,
              style: {
                background: "linear-gradient(145deg, oklch(0.18 0.03 265), oklch(0.16 0.025 265))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-1", children: stat.emoji }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xs font-bold text-neon-green", children: stat.value }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground font-body", children: stat.label })
              ]
            },
            stat.label
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6, duration: 0.5 },
          className: "w-full max-w-sm",
          children: !identity ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "text-neon-cyan w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold", children: "Get Started" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Secure login powered by Internet Identity — no password needed." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: login,
                disabled: isLoggingIn,
                className: "w-full bg-primary text-primary-foreground font-display font-bold text-base h-12 glow-green",
                "data-ocid": "auth.submit_button",
                children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                  " ",
                  "Connecting..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2" }),
                  " Login / Sign Up"
                ] })
              }
            ),
            loginStatus === "loginError" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-sm text-center font-body", children: "Login failed. Please try again." })
          ] }) : needsUsername ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl mb-2", children: "🎮" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold", children: "Choose Your Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1", children: "Pick a username to start your journey" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleRegister, className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "auth.username.input",
                  placeholder: "e.g. IronKid99",
                  value: username,
                  onChange: (e) => setUsername(e.target.value),
                  className: "bg-input border-border text-foreground placeholder:text-muted-foreground h-12 text-base font-body",
                  maxLength: 20,
                  autoFocus: true
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive text-sm font-body", children: error }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isRegistering || !username.trim(),
                  className: "w-full bg-primary text-primary-foreground font-display font-bold text-base h-12 glow-green",
                  "data-ocid": "auth.submit_button",
                  children: isRegistering ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                    " ",
                    "Creating..."
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-2" }),
                    " Start Training!"
                  ] })
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-6 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-neon-green mx-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 font-body", children: "Loading your profile..." })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "text-center py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with ❤️ using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-neon-green hover:underline",
          children: "caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  AuthPage as default
};
