import { c as createLucideIcon, r as reactExports, s as useRecordAdView, j as jsxRuntimeExports } from "./index-D0XmhP_K.js";
import { B as Button } from "./button-L0vPL_zR.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog--qHq_htA.js";
import { P as Progress } from "./progress-D8C1Gw1n.js";
import { Z as Zap } from "./zap-CLMpFi37.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
function RewardedAdModal({
  open,
  onComplete,
  onCancel,
  title = "Watch Ad to Continue",
  description = "Watch a short ad to unlock this feature"
}) {
  const [phase, setPhase] = reactExports.useState("intro");
  const [countdown, setCountdown] = reactExports.useState(5);
  const [progress, setProgress] = reactExports.useState(0);
  const { mutateAsync: recordAdView } = useRecordAdView();
  const startAd = reactExports.useCallback(() => {
    setPhase("watching");
    setCountdown(5);
    setProgress(0);
  }, []);
  reactExports.useEffect(() => {
    if (!open) {
      setPhase("intro");
      setCountdown(5);
      setProgress(0);
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (phase !== "watching") return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        setProgress((5 - next) / 5 * 100);
        if (next <= 0) {
          clearInterval(interval);
          setPhase("done");
        }
        return next;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [phase]);
  const handleComplete = async () => {
    try {
      await recordAdView();
    } catch {
    }
    onComplete();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) onCancel();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          "data-ocid": "rewarded_ad.modal",
          className: "max-w-sm border-border bg-card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "text-neon-green w-5 h-5" }),
                title
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground", children: description })
            ] }),
            phase === "intro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-32 rounded-xl overflow-hidden relative flex items-center justify-center",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.25 0.08 265), oklch(0.18 0.04 265))"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 border border-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Play,
                      {
                        className: "w-8 h-8 text-neon-green",
                        fill: "currentColor"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "5-second ad" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center text-muted-foreground font-body", children: "Watch a quick 5-second ad to continue" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    className: "flex-1 font-body",
                    onClick: onCancel,
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "flex-1 bg-primary text-primary-foreground font-body font-semibold glow-green",
                    onClick: startAd,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-1" }),
                      " Watch Ad"
                    ]
                  }
                )
              ] })
            ] }),
            phase === "watching" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "w-full h-36 rounded-xl overflow-hidden relative",
                  style: {
                    background: "linear-gradient(135deg, #7c3aed, #2563eb, #059669)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white font-display text-2xl font-bold mb-1", children: "TEENTUFF PRO" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/80 text-sm font-body", children: "Level up your workout!" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded font-body", children: [
                      "Ad — ",
                      countdown,
                      "s"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground font-body", children: [
                "Ad playing... ",
                countdown,
                "s remaining"
              ] })
            ] }),
            phase === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-32 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-2", children: "✅" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-neon-green font-display font-bold text-lg", children: "Ad Complete!" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "rewarded_ad.continue.button",
                  className: "w-full bg-primary text-primary-foreground font-body font-semibold glow-green",
                  onClick: handleComplete,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-1" }),
                    "Continue"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
export {
  Calendar as C,
  RewardedAdModal as R
};
