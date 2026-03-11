import { c as createLucideIcon, r as reactExports, g as useLogPushups, a as useUserProfile, j as jsxRuntimeExports, T as Target, h as cn, u as ue } from "./index-Ds68Gk-i.js";
import { B as Button } from "./button-ChmPTUV4.js";
import { u as useCamera, R as RefreshCw, C as Camera, a as CircleAlert, b as RotateCcw, c as CircleCheckBig, S as Share2, d as ShareResultModal } from "./ShareResultModal-D5dWF0U0.js";
import { g as getTierFromXp } from "./xp-CXubY13s.js";
import { m as motion } from "./proxy-DDybWlNs.js";
import { Z as Zap } from "./zap-3fGdtHk8.js";
import { A as AnimatePresence } from "./index-ZE8kxIze.js";
import "./dialog-BAzUMPbs.js";
import "./index-0ZPC2Wmr.js";
import "./check-gd791CSQ.js";
import "./backend.d-AW0U9QfA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }],
  ["path", { d: "M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16", key: "qmtpty" }],
  ["path", { d: "M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5", key: "1ufyfc" }],
  ["path", { d: "M14.121 15.121A3 3 0 1 1 9.88 10.88", key: "11zox6" }]
];
const CameraOff = createLucideIcon("camera-off", __iconNode);
const SAMPLE_ROWS = 40;
const MOTION_THRESH = 6;
const STABLE_FRAMES = 3;
const MIN_REP_MS = 700;
const PHASE_HYSTERESIS = 0.07;
function makeMotionState() {
  return {
    prevGray: null,
    phase: "unknown",
    stablePhase: "unknown",
    stableCount: 0,
    seenDown: false,
    lastRepTime: 0,
    lastTransition: 0,
    centroidHistory: []
  };
}
function analyseFrame(video, offscreenCtx, state) {
  const W = offscreenCtx.canvas.width;
  const H = offscreenCtx.canvas.height;
  offscreenCtx.drawImage(video, 0, 0, W, H);
  const imgData = offscreenCtx.getImageData(0, 0, W, H);
  const data = imgData.data;
  const gray = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = r * 77 + g * 150 + b * 29 >> 8;
  }
  let phase = state.phase;
  let repCounted = false;
  if (state.prevGray !== null) {
    const rowH = Math.floor(H / SAMPLE_ROWS);
    let motionSum = 0;
    let centroidNumer = 0;
    for (let row = 0; row < SAMPLE_ROWS; row++) {
      let rowMotion = 0;
      const y0 = row * rowH;
      for (let y = y0; y < y0 + rowH; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          rowMotion += Math.abs(gray[idx] - state.prevGray[idx]);
        }
      }
      rowMotion /= rowH * W;
      if (rowMotion > MOTION_THRESH / 10) {
        motionSum += rowMotion;
        centroidNumer += rowMotion * (row / SAMPLE_ROWS);
      }
    }
    if (motionSum > 0) {
      const centroid = centroidNumer / motionSum;
      state.centroidHistory.push(centroid);
      if (state.centroidHistory.length > 60) state.centroidHistory.shift();
      if (state.centroidHistory.length >= 6) {
        const sorted = [...state.centroidHistory].sort((a, b) => a - b);
        const lo = sorted[Math.floor(sorted.length * 0.15)];
        const hi = sorted[Math.floor(sorted.length * 0.85)];
        const range = hi - lo;
        let rawPhase = "unknown";
        if (range > PHASE_HYSTERESIS) {
          const upThreshold = lo + range * 0.35;
          const downThreshold = lo + range * 0.65;
          if (centroid <= upThreshold) rawPhase = "up";
          else if (centroid >= downThreshold) rawPhase = "down";
        }
        if (rawPhase !== "unknown") {
          if (rawPhase === state.stablePhase) {
            state.stableCount += 1;
          } else {
            state.stablePhase = rawPhase;
            state.stableCount = 1;
          }
          const now = Date.now();
          if (state.stableCount >= STABLE_FRAMES && rawPhase !== state.phase && now - state.lastTransition > 500) {
            state.phase = rawPhase;
            state.lastTransition = now;
            phase = rawPhase;
            if (rawPhase === "down") {
              state.seenDown = true;
            }
            if (rawPhase === "up" && state.seenDown && now - state.lastRepTime > MIN_REP_MS) {
              repCounted = true;
              state.seenDown = false;
              state.lastRepTime = now;
            }
          } else {
            phase = state.phase;
          }
        } else {
          phase = state.phase;
        }
      }
    }
  }
  state.prevGray = gray;
  return { phase, repCounted };
}
function PushUpCounterPage() {
  const {
    videoRef,
    canvasRef,
    isActive,
    isLoading,
    error,
    isSupported,
    startCamera,
    stopCamera
  } = useCamera({
    facingMode: "user",
    width: 320,
    height: 240
  });
  const [count, setCount] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("unknown");
  const [isDetecting, setIsDetecting] = reactExports.useState(false);
  const [sessionStarted, setSessionStarted] = reactExports.useState(false);
  const [countKey, setCountKey] = reactExports.useState(0);
  const [repPulse, setRepPulse] = reactExports.useState(false);
  const [showShareModal, setShowShareModal] = reactExports.useState(false);
  const [lastSessionCount, setLastSessionCount] = reactExports.useState(0);
  const [calibrating, setCalibrating] = reactExports.useState(false);
  const rafRef = reactExports.useRef(null);
  const offscreenRef = reactExports.useRef(null);
  const offscreenCtxRef = reactExports.useRef(null);
  const motionStateRef = reactExports.useRef(makeMotionState());
  const { mutateAsync: logPushups, isPending: isLogging } = useLogPushups();
  const { data: profile } = useUserProfile();
  const username = (profile == null ? void 0 : profile.username) ?? "Athlete";
  const xp = profile ? Number(profile.xp) : 0;
  const tierInfo = getTierFromXp(xp);
  reactExports.useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 120;
    offscreenRef.current = c;
    offscreenCtxRef.current = c.getContext("2d", { willReadFrequently: true });
  }, []);
  const detectLoop = reactExports.useCallback(() => {
    const video = videoRef.current;
    const ctx = offscreenCtxRef.current;
    if (!video || !ctx || !isActive) {
      setIsDetecting(false);
      return;
    }
    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }
    const { phase: newPhase, repCounted } = analyseFrame(
      video,
      ctx,
      motionStateRef.current
    );
    setPhase(newPhase);
    if (repCounted) {
      setCount((c) => c + 1);
      setCountKey((k) => k + 1);
      setRepPulse(true);
      setTimeout(() => setRepPulse(false), 400);
    }
    rafRef.current = requestAnimationFrame(detectLoop);
  }, [isActive, videoRef]);
  reactExports.useEffect(() => {
    if (isDetecting && isActive) {
      setCalibrating(true);
      const t = setTimeout(() => setCalibrating(false), 3e3);
      rafRef.current = requestAnimationFrame(detectLoop);
      return () => {
        clearTimeout(t);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDetecting, isActive, detectLoop]);
  const handleStart = async () => {
    setCount(0);
    setPhase("unknown");
    motionStateRef.current = makeMotionState();
    setSessionStarted(true);
    const ok = await startCamera();
    if (ok) setIsDetecting(true);
  };
  const handleFinish = async () => {
    setIsDetecting(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    await stopCamera();
    setSessionStarted(false);
    if (count === 0) {
      ue.info("No reps detected. Try again!");
      return;
    }
    try {
      await logPushups(BigInt(count));
      ue.success(`💪 ${count} push-ups logged! +${count * 10} XP earned!`);
      setLastSessionCount(count);
      setShowShareModal(true);
    } catch {
      ue.error("Could not save session. Please try again.");
    }
    setCount(0);
  };
  const handleReset = () => {
    setCount(0);
    setPhase("unknown");
    motionStateRef.current = makeMotionState();
    setCalibrating(true);
    setTimeout(() => setCalibrating(false), 3e3);
  };
  const phaseIndicator = {
    up: {
      label: "UP ↑",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20 border-emerald-500/40"
    },
    down: {
      label: "DOWN ↓",
      color: "text-sky-400",
      bg: "bg-sky-500/20 border-sky-500/40"
    },
    unknown: {
      label: "READY",
      color: "text-muted-foreground",
      bg: "bg-muted/20 border-muted/30"
    }
  };
  const pi = phaseIndicator[phase];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-black flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-6 h-6 text-neon-cyan" }),
        "Push-Up Counter"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Camera detects your reps automatically" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 px-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full rounded-2xl overflow-hidden bg-muted aspect-[4/3] border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "video",
          {
            ref: videoRef,
            className: cn(
              "absolute inset-0 w-full h-full object-cover",
              isActive ? "opacity-100" : "opacity-0",
              "scale-x-[-1]"
            ),
            playsInline: true,
            muted: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" }),
        !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/80 z-10", children: error ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CameraOff, { className: "w-12 h-12 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center px-4 font-body", children: error.type === "permission" ? "Camera permission denied. Please allow camera access." : error.type === "not-found" ? "No camera found on this device." : "Camera unavailable." })
        ] }) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-10 h-10 text-neon-green animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Starting camera..." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-12 h-12 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm text-center", children: "Camera will start when you begin" })
        ] }) }),
        isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "absolute top-3 left-3 z-20 px-3 py-1 rounded-full border font-display font-bold text-xs",
              pi.bg,
              pi.color
            ),
            children: pi.label
          }
        ),
        isActive && calibrating && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3 right-3 z-20 bg-card/80 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body text-center", children: "Calibrating motion... get into push-up position" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { className: "card-sporty p-6 text-center relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0",
            style: {
              background: "radial-gradient(circle, oklch(0.85 0.22 130) 0%, transparent 70%)"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-body text-muted-foreground uppercase tracking-widest mb-1", children: "Push-Ups" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { scale: 1.5, opacity: 0.6 },
              animate: { scale: 1, opacity: 1 },
              transition: {
                duration: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 15
              },
              className: cn(
                "font-display font-black text-8xl leading-none mb-2 transition-colors duration-150",
                repPulse ? "text-yellow-300" : "text-neon-green"
              ),
              style: {
                textShadow: repPulse ? "0 0 40px oklch(0.9 0.28 90 / 0.8)" : "0 0 30px oklch(0.85 0.22 130 / 0.4)"
              },
              children: count
            },
            countKey
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground font-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Face the camera · Full upper body visible · Go DOWN and push UP" }) })
        ] })
      ] }),
      !sessionStarted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-neon-cyan" }),
          "How it works"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-xs text-muted-foreground font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Prop your phone in front of you so it faces you" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Make sure your head, shoulders, and hips are all visible" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Do push-ups — go DOWN close to the floor, then push UP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Camera tracks your body movement to count reps" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Good lighting helps — avoid strong backlight behind you" })
        ] })
      ] }),
      sessionStarted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-neon-orange shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body flex-1", children: "Not counting right? Tap + / - to adjust manually" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "w-8 h-8",
              onClick: () => setCount((c) => Math.max(0, c - 1)),
              children: "-"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              className: "w-8 h-8",
              onClick: () => setCount((c) => c + 1),
              children: "+"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: !sessionStarted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "pushups.start.button",
          onClick: handleStart,
          disabled: isLoading || isSupported === false,
          className: "flex-1 h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5 mr-2" }),
            "Start Session"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            onClick: handleReset,
            className: "h-14 w-14 border-border",
            title: "Reset counter",
            "data-ocid": "pushups.reset.button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "pushups.finish.button",
            onClick: handleFinish,
            disabled: isLogging,
            className: "flex-1 h-14 bg-primary text-primary-foreground font-display font-bold text-base glow-green",
            children: isLogging ? "Saving..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 mr-2" }),
              " Finish +",
              count * 10,
              " XP"
            ] })
          }
        )
      ] }) }),
      !sessionStarted && lastSessionCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setShowShareModal(true),
          className: "w-full h-12 border-border font-display font-bold gap-2",
          "data-ocid": "pushups.share.button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
            "Share My Result"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareResultModal,
      {
        open: showShareModal,
        onClose: () => setShowShareModal(false),
        repCount: lastSessionCount,
        xpEarned: lastSessionCount * 10,
        username,
        tier: tierInfo.label
      }
    )
  ] });
}
export {
  PushUpCounterPage as default
};
