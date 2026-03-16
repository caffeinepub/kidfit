import { g as useActor, P as useQueryClient, n as useCreateCheckoutSession, C as useQuery, h as useMutation, r as reactExports, j as jsxRuntimeExports, u as ue } from "./index-ZhaeuKrs.js";
import { B as Button } from "./button-DaURO9gw.js";
import { A as ArrowLeft } from "./arrow-left-B6Y7GDpP.js";
import { C as Crown } from "./crown-DozGkn1M.js";
import { m as motion } from "./proxy-Dt8YdFXT.js";
import { C as CircleCheckBig } from "./circle-check-big-B_0jnvvq.js";
import { S as Star } from "./star-CQrhcKPU.js";
import { Z as Zap } from "./zap-CYaIAjas.js";
import { L as LoaderCircle } from "./loader-circle-Cj_VZTM0.js";
const PERKS = [
  { emoji: "🥗", text: "Both Veg & Non-Veg diet plans" },
  { emoji: "⚡", text: "20% more XP on all activities" },
  { emoji: "🪙", text: "20% more coins per workout" },
  { emoji: "🚫", text: "No ads for 30 days" },
  { emoji: "💪", text: "Advanced HIIT & Gym splits", soon: true }
];
function PremiumPage({ onBack }) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const createCheckout = useCreateCheckoutSession();
  const { data: isPremium } = useQuery({
    queryKey: ["isPremium"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isPremiumActive();
    },
    enabled: !!actor
  });
  const { data: premiumUntil } = useQuery({
    queryKey: ["premiumUntil"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPremiumUntil();
    },
    enabled: !!actor && !!isPremium
  });
  const activateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.activatePremium();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isPremium"] });
      queryClient.invalidateQueries({ queryKey: ["premiumUntil"] });
      ue.success("Premium activated! 🎉");
    },
    onError: () => ue.error("Failed to activate premium")
  });
  const [isStartingCheckout, setIsStartingCheckout] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium_success")) {
      window.history.replaceState({}, "", window.location.pathname);
      activateMutation.mutate();
    }
  }, []);
  const handleGetPremium = async () => {
    setIsStartingCheckout(true);
    try {
      const currentUrl = window.location.href.split("?")[0];
      const successUrl = `${currentUrl}?premium_success=true`;
      const cancelUrl = currentUrl;
      const url = await createCheckout.mutateAsync({
        items: [
          {
            productName: "TeenTuffLifts Premium",
            productDescription: "1 month premium subscription",
            quantity: BigInt(1),
            priceInCents: BigInt(37500),
            currency: "inr"
          }
        ],
        successUrl,
        cancelUrl
      });
      window.location.href = url;
    } catch {
      ue.error("Could not start checkout. Please try again.");
      setIsStartingCheckout(false);
    }
  };
  const premiumExpiry = premiumUntil ? new Date(Number(premiumUntil) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-screen pb-24",
      style: { background: "#1F1F1F" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "premium.back_button",
              onClick: onBack,
              className: "w-10 h-10 rounded-full flex items-center justify-center",
              style: { background: "rgba(255,255,255,0.08)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5 text-white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-black text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5", style: { color: "#D4AF37" } }),
            "Premium"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              className: "rounded-3xl overflow-hidden relative",
              style: {
                background: "linear-gradient(135deg, #1a1200 0%, #2a1f00 50%, #1a1200 100%)",
                border: "1px solid rgba(212,175,55,0.4)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute inset-0",
                    style: {
                      background: "radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.15) 0%, transparent 60%)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-6 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "👑" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      className: "font-display font-black text-3xl mb-1",
                      style: { color: "#D4AF37" },
                      children: "PREMIUM"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 font-body text-sm mb-4", children: "Unlock your full potential" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-black text-4xl text-white", children: [
                    "₹375",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-body font-normal text-white/50 ml-1", children: "/month" })
                  ] })
                ] })
              ]
            }
          ),
          isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              className: "rounded-2xl p-4 flex items-center gap-3",
              style: {
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.4)"
              },
              "data-ocid": "premium.active.success_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CircleCheckBig,
                  {
                    className: "w-6 h-6 flex-shrink-0",
                    style: { color: "#D4AF37" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "font-display font-bold text-sm",
                      style: { color: "#D4AF37" },
                      children: "Premium Active! ✨"
                    }
                  ),
                  premiumExpiry && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-white/50 font-body", children: [
                    "Expires ",
                    premiumExpiry
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl p-5 space-y-3",
              style: {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-white text-base mb-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4", style: { color: "#D4AF37" } }),
                  "What You Get"
                ] }),
                PERKS.map((perk, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: i * 0.07 },
                    className: "flex items-center gap-3",
                    "data-ocid": `premium.perk.item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: perk.emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm text-white flex-1", children: perk.text }),
                      perk.soon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-[10px] font-display font-bold px-2 py-0.5 rounded-full",
                          style: {
                            background: "rgba(212,175,55,0.2)",
                            color: "#D4AF37"
                          },
                          children: "Soon"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleCheckBig,
                        {
                          className: "w-4 h-4 flex-shrink-0",
                          style: { color: "#22c55e" }
                        }
                      )
                    ]
                  },
                  perk.text
                ))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl p-4 flex gap-3",
              style: {
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-green-300 font-body", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+20% XP & Coins" }),
                  " on every workout — the fastest way to dominate the leaderboard."
                ] })
              ]
            }
          ),
          !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "premium.get_premium.primary_button",
              onClick: handleGetPremium,
              disabled: isStartingCheckout || createCheckout.isPending,
              className: "w-full h-16 text-lg font-display font-black rounded-2xl",
              style: {
                background: "linear-gradient(135deg, #D4AF37, #F0D060)",
                color: "#1F1F1F"
              },
              children: isStartingCheckout || createCheckout.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }),
                " Starting checkout..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "👑 Get Premium — ₹375/month" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-white/30 font-body pb-2", children: "Secure payment via Stripe. Cancel anytime." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-white/20 font-body", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            ". Built with love using",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "underline",
                children: "caffeine.ai"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  PremiumPage as default
};
