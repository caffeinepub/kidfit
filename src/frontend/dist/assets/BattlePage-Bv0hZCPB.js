import { a as useUserProfile, p as useInternetIdentity, r as reactExports, t as useCreateBattle, v as useJoinBattle, w as useUpdateBattleScore, x as useGetBattle, j as jsxRuntimeExports, S as Swords, b as Trophy, h as cn, u as ue } from "./index-Ds68Gk-i.js";
import { B as Button } from "./button-ChmPTUV4.js";
import { I as Input } from "./input-B8QgdVby.js";
import { V as Variant_active_finished_waiting } from "./backend.d-AW0U9QfA.js";
import { u as useCamera, S as Share2, c as CircleCheckBig, e as Copy, C as Camera, a as CircleAlert, R as RefreshCw, b as RotateCcw, d as ShareResultModal } from "./ShareResultModal-D5dWF0U0.js";
import { g as getTierFromXp } from "./xp-CXubY13s.js";
import { m as motion } from "./proxy-DDybWlNs.js";
import { L as LoaderCircle } from "./loader-circle-CZrKqlzk.js";
import { A as AnimatePresence } from "./index-ZE8kxIze.js";
import "./dialog-BAzUMPbs.js";
import "./index-0ZPC2Wmr.js";
import "./check-gd791CSQ.js";
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
function generateBattleCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
function formatTimeRemaining(ms) {
  if (ms <= 0) return "Time's Up!";
  const mins = Math.floor(ms / (1e3 * 60));
  const secs = Math.floor(ms % (1e3 * 60) / 1e3);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
function BattlePage() {
  const { data: profile } = useUserProfile();
  const { identity } = useInternetIdentity();
  const username = (profile == null ? void 0 : profile.username) ?? "Athlete";
  const xp = profile ? Number(profile.xp) : 0;
  const tierInfo = getTierFromXp(xp);
  const [battleState, setBattleState] = reactExports.useState("menu");
  const [battleCode, setBattleCode] = reactExports.useState(null);
  const [isCreator, setIsCreator] = reactExports.useState(true);
  const [joinCode, setJoinCode] = reactExports.useState("");
  const [codeCopied, setCodeCopied] = reactExports.useState(false);
  const [timeRemaining, setTimeRemaining] = reactExports.useState(0);
  const [shareOpen, setShareOpen] = reactExports.useState(false);
  const [finalCreatorScore, setFinalCreatorScore] = reactExports.useState(0);
  const [finalChallengerScore, setFinalChallengerScore] = reactExports.useState(0);
  const createBattle = useCreateBattle();
  const joinBattle = useJoinBattle();
  const updateScore = useUpdateBattleScore();
  const updateScoreMutateRef = reactExports.useRef(updateScore.mutate);
  reactExports.useEffect(() => {
    updateScoreMutateRef.current = updateScore.mutate;
  }, [updateScore.mutate]);
  const { data: battleData } = useGetBattle(
    battleState === "active" || battleState === "create" ? battleCode : null
  );
  const battleDataRef = reactExports.useRef(battleData);
  reactExports.useEffect(() => {
    battleDataRef.current = battleData;
  }, [battleData]);
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
  const [countKey, setCountKey] = reactExports.useState(0);
  const [repPulse, setRepPulse] = reactExports.useState(false);
  const [calibrating, setCalibrating] = reactExports.useState(false);
  const rafRef = reactExports.useRef(null);
  const offscreenRef = reactExports.useRef(null);
  const offscreenCtxRef = reactExports.useRef(null);
  const motionStateRef = reactExports.useRef(makeMotionState());
  const countRef = reactExports.useRef(0);
  const scoreIntervalRef = reactExports.useRef(null);
  const battleCodeRef = reactExports.useRef(battleCode);
  const isCreatorRef = reactExports.useRef(isCreator);
  reactExports.useEffect(() => {
    countRef.current = count;
  }, [count]);
  reactExports.useEffect(() => {
    battleCodeRef.current = battleCode;
  }, [battleCode]);
  reactExports.useEffect(() => {
    isCreatorRef.current = isCreator;
  }, [isCreator]);
  reactExports.useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 120;
    offscreenRef.current = c;
    offscreenCtxRef.current = c.getContext("2d", { willReadFrequently: true });
  }, []);
  const expiresAt = battleData == null ? void 0 : battleData.expiresAt;
  reactExports.useEffect(() => {
    if (battleState !== "active" || !expiresAt) return;
    const expiresAtMs = Number(expiresAt) / 1e6;
    const interval = setInterval(() => {
      const remaining = expiresAtMs - Date.now();
      setTimeRemaining(Math.max(0, remaining));
      if (remaining <= 0) clearInterval(interval);
    }, 1e3);
    setTimeRemaining(Math.max(0, expiresAtMs - Date.now()));
    return () => clearInterval(interval);
  }, [battleState, expiresAt]);
  reactExports.useEffect(() => {
    if (battleState !== "active" || !battleCode) return;
    scoreIntervalRef.current = setInterval(() => {
      const code = battleCodeRef.current;
      if (code) {
        updateScoreMutateRef.current({ code, score: BigInt(countRef.current) });
      }
    }, 3e3);
    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };
  }, [battleState, battleCode]);
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
  const handleCreateBattle = async () => {
    const code = generateBattleCode();
    try {
      await createBattle.mutateAsync(code);
      setBattleCode(code);
      setIsCreator(true);
      setBattleState("create");
    } catch (err) {
      const msg = String(err);
      if (msg.includes("code already exists")) {
        ue.error("Code conflict, try again.");
      } else {
        ue.error("Could not create battle. Try again.");
      }
    }
  };
  const handleCopyCode = async () => {
    if (!battleCode) return;
    try {
      await navigator.clipboard.writeText(battleCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2e3);
      ue.success("Battle code copied!");
    } catch {
      ue.error("Could not copy code");
    }
  };
  const handleShareCode = async () => {
    if (!battleCode) return;
    const shareText = `Join my Push-Up Battle on TeenTuffLifts! Use code: ${battleCode} 💪 #TeenTuffLifts`;
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          title: "TeenTuffLifts Battle Challenge"
        });
        return;
      } catch {
      }
    }
    await navigator.clipboard.writeText(shareText);
    ue.success("Battle invite copied!");
  };
  const handleStartSession = async () => {
    setCount(0);
    countRef.current = 0;
    motionStateRef.current = makeMotionState();
    const ok = await startCamera();
    if (ok) setIsDetecting(true);
    setBattleState("active");
  };
  const handleJoinBattle = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      ue.error("Please enter a 6-character code");
      return;
    }
    try {
      await joinBattle.mutateAsync(code);
      setBattleCode(code);
      setIsCreator(false);
      setCount(0);
      countRef.current = 0;
      motionStateRef.current = makeMotionState();
      const ok = await startCamera();
      if (ok) setIsDetecting(true);
      setBattleState("active");
    } catch (err) {
      const msg = String(err).toLowerCase();
      if (msg.includes("not found") || msg.includes("does not exist")) {
        ue.error("Battle not found. Check the code and try again.");
      } else if (msg.includes("already started") || msg.includes("not waiting")) {
        ue.error("This battle has already started.");
      } else if (msg.includes("expired")) {
        ue.error("This battle has expired.");
      } else {
        ue.error("Could not join battle. Try again.");
      }
    }
  };
  const handleSubmitScore = () => {
    const code = battleCodeRef.current;
    if (!code) return;
    setIsDetecting(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    stopCamera();
    updateScoreMutateRef.current({ code, score: BigInt(countRef.current) });
    const latestBattle = battleDataRef.current;
    const creatorScore = latestBattle ? Number(latestBattle.creatorScore) : 0;
    const challengerScore = latestBattle ? Number(latestBattle.challengerScore) : 0;
    if (isCreatorRef.current) {
      setFinalCreatorScore(countRef.current);
      setFinalChallengerScore(challengerScore);
    } else {
      setFinalChallengerScore(countRef.current);
      setFinalCreatorScore(creatorScore);
    }
    setBattleState("result");
  };
  const handlePlayAgain = () => {
    setBattleCode(null);
    setCount(0);
    setPhase("unknown");
    setJoinCode("");
    setBattleState("menu");
  };
  const liveOpponentScore = battleState === "active" && battleData ? isCreator ? Number(battleData.challengerScore) : Number(battleData.creatorScore) : null;
  const myScore = isCreator ? finalCreatorScore : finalChallengerScore;
  const opponentFinalScore = isCreator ? finalChallengerScore : finalCreatorScore;
  const iWon = myScore > opponentFinalScore;
  const phaseColors = {
    up: "text-neon-green",
    down: "text-neon-cyan",
    unknown: "text-muted-foreground"
  };
  const phaseLabels = {
    up: "UP ↑",
    down: "DOWN ↓",
    unknown: "READY"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-black flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-6 h-6 text-neon-orange" }),
        "Push-Up Battle"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Real-time push-up challenge — works across devices!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
      battleState === "menu" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "card-sporty text-center relative overflow-hidden",
                style: {
                  background: "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 42 / 0.4))"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl mb-3", children: "⚔️" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl mb-2", children: "Challenge a Friend!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
                    "Create a battle, share your code. Both of you use your own camera — scores sync live across devices. Best reps in",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-green font-bold", children: "20 minutes" }),
                    " ",
                    "wins!"
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "battle.create.button",
                onClick: handleCreateBattle,
                disabled: createBattle.isPending,
                className: "w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green",
                children: [
                  createBattle.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Swords, { className: "w-5 h-5 mr-2" }),
                  createBattle.isPending ? "Creating..." : "Create Battle"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "battle.join.button",
                onClick: () => setBattleState("join"),
                variant: "outline",
                className: "w-full h-14 border-border font-display font-bold text-lg",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 mr-2" }),
                  "Join Battle"
                ]
              }
            )
          ]
        },
        "menu"
      ),
      battleState === "create" && battleCode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-6 text-center space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-body text-muted-foreground uppercase tracking-wider", children: "Your Battle Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "battle.code.display",
                  className: "font-display font-black text-5xl tracking-[0.3em] text-neon-green py-3",
                  style: { textShadow: "0 0 30px oklch(0.85 0.22 130 / 0.5)" },
                  children: battleCode
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                "Share this code with your friend. They enter it on their device to join your battle. You both have",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neon-orange font-bold", children: "20 minutes" }),
                " ",
                "from when they join."
              ] }),
              battleData && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "battle.status.panel",
                  className: cn(
                    "text-xs font-display font-bold px-3 py-1.5 rounded-full inline-block",
                    battleData.status === Variant_active_finished_waiting.waiting ? "bg-muted/40 text-muted-foreground" : "bg-primary/20 text-neon-green border border-primary/30"
                  ),
                  children: battleData.status === Variant_active_finished_waiting.waiting ? "⏳ Waiting for opponent..." : "✅ Opponent joined!"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "battle.share_code.button",
                  onClick: handleShareCode,
                  variant: "outline",
                  className: "h-12 border-border font-display font-bold gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                    "Share Code"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: handleCopyCode,
                  variant: "outline",
                  className: "h-12 border-border font-display font-bold gap-2",
                  children: [
                    codeCopied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-neon-green" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                    codeCopied ? "Copied!" : "Copy Code"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "battle.start_session.button",
                onClick: handleStartSession,
                disabled: isLoading || isSupported === false,
                className: "w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5 mr-2" }),
                  "Start My Session"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setBattleState("menu"),
                className: "w-full text-muted-foreground font-body text-sm",
                children: "← Back to Menu"
              }
            )
          ]
        },
        "create"
      ),
      battleState === "join" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-xl", children: "Enter Battle Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Ask your friend for their 6-character battle code. Works on any device!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "battle.code.input",
                  placeholder: "e.g. ABC123",
                  value: joinCode,
                  onChange: (e) => setJoinCode(e.target.value.toUpperCase()),
                  maxLength: 6,
                  className: "font-display font-black text-3xl text-center tracking-[0.25em] h-16 bg-muted/30 border-border uppercase",
                  onKeyDown: (e) => e.key === "Enter" && handleJoinBattle()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "battle.join_submit.button",
                  onClick: handleJoinBattle,
                  disabled: joinBattle.isPending,
                  className: "w-full h-12 bg-primary text-primary-foreground font-display font-bold glow-green",
                  children: [
                    joinBattle.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : null,
                    joinBattle.isPending ? "Joining..." : "Join Battle!"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setBattleState("menu"),
                className: "w-full text-muted-foreground font-body text-sm",
                children: "← Back to Menu"
              }
            )
          ]
        },
        "join"
      ),
      battleState === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Time Left" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "font-display font-bold text-sm",
                    timeRemaining < 6e4 ? "text-destructive animate-pulse" : "text-neon-orange"
                  ),
                  children: formatTimeRemaining(timeRemaining)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "battle.camera.canvas_target",
                className: "relative w-full rounded-2xl overflow-hidden bg-muted aspect-[4/3] border border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "video",
                    {
                      ref: videoRef,
                      className: cn(
                        "absolute inset-0 w-full h-full object-cover scale-x-[-1]",
                        isActive ? "opacity-100" : "opacity-0"
                      ),
                      playsInline: true,
                      muted: true
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" }),
                  !isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-muted/80", children: error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-10 h-10 text-muted-foreground mx-auto mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body px-4", children: "Camera unavailable" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 text-neon-green animate-spin" }) }),
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "absolute top-3 left-3 px-3 py-1 rounded-full border font-display font-bold text-xs z-10",
                        phaseColors[phase],
                        phase === "up" ? "bg-primary/20 border-primary/30" : "bg-muted/20 border-muted/30"
                      ),
                      children: phaseLabels[phase]
                    }
                  ),
                  isActive && calibrating && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3 right-3 z-20 bg-card/80 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body text-center", children: "Calibrating... get into push-up position" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-body mb-1", children: [
                  "You (",
                  username,
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { scale: 1.3, opacity: 0.7 },
                    animate: { scale: 1, opacity: 1 },
                    transition: { duration: 0.2, type: "spring" },
                    className: cn(
                      "font-display font-black text-4xl transition-colors duration-150",
                      repPulse ? "text-yellow-300" : "text-neon-green"
                    ),
                    style: {
                      textShadow: "0 0 15px oklch(0.85 0.22 130 / 0.4)"
                    },
                    children: count
                  },
                  countKey
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-4 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body mb-1", children: "Opponent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-4xl text-neon-cyan", children: liveOpponentScore !== null && liveOpponentScore > 0 ? liveOpponentScore : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body mt-1", children: "live" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  onClick: () => {
                    setCount((c) => Math.max(0, c - 1));
                    setCountKey((k) => k + 1);
                  },
                  className: "h-12 w-12 border-border",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "battle.submit_score.button",
                  onClick: handleSubmitScore,
                  className: "flex-1 h-12 bg-primary text-primary-foreground font-display font-bold glow-green",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 mr-2" }),
                    "Submit Score (",
                    count,
                    " reps)"
                  ]
                }
              )
            ] })
          ]
        },
        "active"
      ),
      battleState === "result" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0 },
          className: "space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "battle.result.card",
                className: "card-sporty p-6 text-center relative overflow-hidden",
                style: {
                  background: iWon ? "linear-gradient(135deg, oklch(0.15 0.06 150), oklch(0.2 0.08 90 / 0.4))" : "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 22 / 0.3))",
                  border: iWon ? "1px solid oklch(0.6 0.18 150 / 0.5)" : void 0
                },
                children: [
                  iWon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: ["🎉", "⭐", "💪", "🏆", "✨", "🎊"].map((emoji, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "absolute text-2xl animate-bounce",
                      style: {
                        left: `${10 + i * 15}%`,
                        top: `${5 + i % 2 * 15}%`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: "1.2s"
                      },
                      children: emoji
                    },
                    emoji
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-2", children: iWon ? "🏆" : "💪" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl mb-1", children: iWon ? "You Won!" : "Good Effort!" }),
                  iWon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-primary/20 text-neon-green border border-primary/30 rounded-full px-3 py-0.5 font-display font-bold", children: "+300 XP Battle Bonus!" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "card-sporty p-4 text-center",
                    iWon && "ring-1 ring-neon-green/50"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-body mb-1", children: [
                      username,
                      " ",
                      iWon ? "👑" : ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-4xl text-neon-green", children: myScore }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "reps" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "card-sporty p-4 text-center",
                    !iWon && "ring-1 ring-neon-orange/50"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-body mb-1", children: [
                      "Opponent ",
                      !iWon ? "👑" : ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-4xl text-neon-cyan", children: opponentFinalScore }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "reps" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "battle.share_result.button",
                onClick: () => setShareOpen(true),
                variant: "outline",
                className: "w-full h-12 border-border font-display font-bold gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
                  "Share Result"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "battle.play_again.button",
                onClick: handlePlayAgain,
                className: "w-full h-12 bg-primary text-primary-foreground font-display font-bold glow-green",
                children: "Play Again ⚔️"
              }
            )
          ]
        },
        "result"
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareResultModal,
      {
        open: shareOpen,
        onClose: () => setShareOpen(false),
        repCount: myScore,
        xpEarned: iWon ? myScore * 10 + 300 : myScore * 10,
        username,
        tier: tierInfo.label
      }
    )
  ] });
}
export {
  BattlePage as default
};
