import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Copy,
  Loader2,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Send,
  Share2,
  Swords,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Variant_active_finished_waiting } from "../backend.d";
import { useCamera } from "../camera/useCamera";
import ShareResultModal from "../components/ShareResultModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateBattle,
  useGetBattle,
  useGetBattleChats,
  useJoinBattle,
  useSendBattleChat,
  useUpdateBattleScore,
  useUserProfile,
} from "../hooks/useQueries";
import { getTierFromXp } from "../lib/xp";

type BattleState = "menu" | "create" | "join" | "active" | "result";
type PosePhase = "up" | "down" | "unknown";

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  senderUsername: string;
  isOwn: boolean;
}

// ─── Canvas-based motion detection (same as PushUpCounterPage) ───────────────
const SAMPLE_ROWS = 40;
const MOTION_THRESH = 6;
const STABLE_FRAMES = 3;
const MIN_REP_MS = 700;
const PHASE_HYSTERESIS = 0.07;

interface MotionState {
  prevGray: Uint8Array | null;
  phase: PosePhase;
  stablePhase: PosePhase;
  stableCount: number;
  seenDown: boolean;
  lastRepTime: number;
  lastTransition: number;
  centroidHistory: number[];
}

function makeMotionState(): MotionState {
  return {
    prevGray: null,
    phase: "unknown",
    stablePhase: "unknown",
    stableCount: 0,
    seenDown: false,
    lastRepTime: 0,
    lastTransition: 0,
    centroidHistory: [],
  };
}

function analyseFrame(
  video: HTMLVideoElement,
  offscreenCtx: CanvasRenderingContext2D,
  state: MotionState,
): { phase: PosePhase; repCounted: boolean } {
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
    gray[i] = (r * 77 + g * 150 + b * 29) >> 8;
  }

  let phase: PosePhase = state.phase;
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

        let rawPhase: PosePhase = "unknown";
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
          if (
            state.stableCount >= STABLE_FRAMES &&
            rawPhase !== state.phase &&
            now - state.lastTransition > 500
          ) {
            state.phase = rawPhase;
            state.lastTransition = now;
            phase = rawPhase;

            if (rawPhase === "down") {
              state.seenDown = true;
            }

            if (
              rawPhase === "up" &&
              state.seenDown &&
              now - state.lastRepTime > MIN_REP_MS
            ) {
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

function generateBattleCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Time's Up!";
  const mins = Math.floor(ms / (1000 * 60));
  const secs = Math.floor((ms % (1000 * 60)) / 1000);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function formatChatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function BattlePage() {
  const { data: profile } = useUserProfile();
  const { identity } = useInternetIdentity();
  const username = profile?.username ?? "Athlete";
  const xp = profile ? Number(profile.xp) : 0;
  const tierInfo = getTierFromXp(xp);

  const [battleState, setBattleState] = useState<BattleState>("menu");
  const [battleCode, setBattleCode] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [finalCreatorScore, setFinalCreatorScore] = useState(0);
  const [finalChallengerScore, setFinalChallengerScore] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Backend mutations
  const createBattle = useCreateBattle();
  const joinBattle = useJoinBattle();
  const updateScore = useUpdateBattleScore();
  const sendBattleChat = useSendBattleChat();

  const updateScoreMutateRef = useRef(updateScore.mutate);
  useEffect(() => {
    updateScoreMutateRef.current = updateScore.mutate;
  }, [updateScore.mutate]);

  // Poll battle data every 3s
  const { data: battleData } = useGetBattle(
    battleState === "active" || battleState === "create" ? battleCode : null,
  );

  // Poll battle chats every 3s
  const { data: remoteChatMessages } = useGetBattleChats(
    battleState === "active" ? battleCode : null,
  );

  const battleDataRef = useRef(battleData);
  useEffect(() => {
    battleDataRef.current = battleData;
  }, [battleData]);

  // Sync remote chat messages into local state
  useEffect(() => {
    if (!remoteChatMessages || remoteChatMessages.length === 0) return;
    const mapped: ChatMessage[] = remoteChatMessages.map((m) => ({
      id: String(m.id),
      text: m.text,
      time: formatChatTime(new Date(Number(m.timestamp) / 1_000_000)),
      senderUsername: m.senderUsername,
      isOwn: m.senderUsername === username,
    }));
    setChatMessages(mapped);
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 0);
  }, [remoteChatMessages, username]);

  // Camera + canvas motion detection
  const {
    videoRef,
    canvasRef,
    isActive,
    isLoading,
    error,
    isSupported,
    startCamera,
    stopCamera,
  } = useCamera({
    facingMode: "user",
    width: 320,
    height: 240,
  });

  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<PosePhase>("unknown");
  const [isDetecting, setIsDetecting] = useState(false);
  const [countKey, setCountKey] = useState(0);
  const [repPulse, setRepPulse] = useState(false);
  const [calibrating, setCalibrating] = useState(false);

  const rafRef = useRef<number | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const motionStateRef = useRef<MotionState>(makeMotionState());
  const countRef = useRef(0);
  const scoreIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const battleCodeRef = useRef(battleCode);
  const isCreatorRef = useRef(isCreator);

  useEffect(() => {
    countRef.current = count;
  }, [count]);
  useEffect(() => {
    battleCodeRef.current = battleCode;
  }, [battleCode]);
  useEffect(() => {
    isCreatorRef.current = isCreator;
  }, [isCreator]);

  // Create offscreen canvas once
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 120;
    offscreenRef.current = c;
    offscreenCtxRef.current = c.getContext("2d", { willReadFrequently: true });
  }, []);

  // Timer from backend expiresAt
  const expiresAt = battleData?.expiresAt;
  useEffect(() => {
    if (battleState !== "active" || !expiresAt) return;
    const expiresAtMs = Number(expiresAt) / 1_000_000;
    const interval = setInterval(() => {
      const remaining = expiresAtMs - Date.now();
      setTimeRemaining(Math.max(0, remaining));
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    setTimeRemaining(Math.max(0, expiresAtMs - Date.now()));
    return () => clearInterval(interval);
  }, [battleState, expiresAt]);

  // Score sync every 3s
  useEffect(() => {
    if (battleState !== "active" || !battleCode) return;
    scoreIntervalRef.current = setInterval(() => {
      const code = battleCodeRef.current;
      if (code) {
        updateScoreMutateRef.current({ code, score: BigInt(countRef.current) });
      }
    }, 3000);
    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };
  }, [battleState, battleCode]);

  // Canvas detection loop
  const detectLoop = useCallback(() => {
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
      motionStateRef.current,
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

  useEffect(() => {
    if (isDetecting && isActive) {
      setCalibrating(true);
      const t = setTimeout(() => setCalibrating(false), 3000);
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

  // ===== CHAT HANDLER =====
  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text || !battleCode) return;
    setChatInput("");
    sendBattleChat.mutate({ code: battleCode, text });
  };

  // ===== HANDLERS =====

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
        toast.error("Code conflict, try again.");
      } else {
        toast.error("Could not create battle. Try again.");
      }
    }
  };

  const handleCopyCode = async () => {
    if (!battleCode) return;
    try {
      await navigator.clipboard.writeText(battleCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
      toast.success("Battle code copied!");
    } catch {
      toast.error("Could not copy code");
    }
  };

  const handleShareCode = async () => {
    if (!battleCode) return;
    const shareText = `Join my Push-Up Battle on TeenTuffLifts! Use code: ${battleCode} 💪 #TeenTuffLifts`;
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          title: "TeenTuffLifts Battle Challenge",
        });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(shareText);
    toast.success("Battle invite copied!");
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
      toast.error("Please enter a 6-character code");
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
        toast.error("Battle not found. Check the code and try again.");
      } else if (
        msg.includes("already started") ||
        msg.includes("not waiting")
      ) {
        toast.error("This battle has already started.");
      } else if (msg.includes("expired")) {
        toast.error("This battle has expired.");
      } else {
        toast.error("Could not join battle. Try again.");
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
    const challengerScore = latestBattle
      ? Number(latestBattle.challengerScore)
      : 0;
    if (isCreatorRef.current) {
      setFinalCreatorScore(countRef.current);
      setFinalChallengerScore(challengerScore);
    } else {
      setFinalChallengerScore(countRef.current);
      setFinalCreatorScore(creatorScore);
    }
    setChatMessages([]);
    setBattleState("result");
  };

  const handlePlayAgain = () => {
    setBattleCode(null);
    setCount(0);
    setPhase("unknown");
    setJoinCode("");
    setChatMessages([]);
    setChatInput("");
    setBattleState("menu");
  };

  void identity;

  const liveOpponentScore =
    battleState === "active" && battleData
      ? isCreator
        ? Number(battleData.challengerScore)
        : Number(battleData.creatorScore)
      : null;

  const myScore = isCreator ? finalCreatorScore : finalChallengerScore;
  const opponentFinalScore = isCreator
    ? finalChallengerScore
    : finalCreatorScore;
  const iWon = myScore > opponentFinalScore;

  const phaseColors: Record<PosePhase, string> = {
    up: "text-neon-green",
    down: "text-neon-cyan",
    unknown: "text-muted-foreground",
  };
  const phaseLabels: Record<PosePhase, string> = {
    up: "UP ↑",
    down: "DOWN ↓",
    unknown: "READY",
  };

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      <header className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black flex items-center gap-2">
          <Swords className="w-6 h-6 text-neon-orange" />
          Push-Up Battle
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          Real-time push-up challenge — works across devices!
        </p>
      </header>

      <main className="flex-1 px-4">
        <AnimatePresence mode="wait">
          {/* ===== MENU ===== */}
          {battleState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div
                className="card-sporty text-center relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 42 / 0.4))",
                }}
              >
                <div className="p-6">
                  <div className="text-6xl mb-3">⚔️</div>
                  <h2 className="font-display font-black text-2xl mb-2">
                    Challenge a Friend!
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Create a battle, share your code. Both of you use your own
                    camera — scores sync live across devices. Best reps in{" "}
                    <span className="text-neon-green font-bold">
                      20 minutes
                    </span>{" "}
                    wins!
                  </p>
                </div>
              </div>

              <Button
                data-ocid="battle.create.button"
                onClick={handleCreateBattle}
                disabled={createBattle.isPending}
                className="w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green"
              >
                {createBattle.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Swords className="w-5 h-5 mr-2" />
                )}
                {createBattle.isPending ? "Creating..." : "Create Battle"}
              </Button>

              <Button
                data-ocid="battle.join.button"
                onClick={() => setBattleState("join")}
                variant="outline"
                className="w-full h-14 border-border font-display font-bold text-lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Join Battle
              </Button>
            </motion.div>
          )}

          {/* ===== CREATE ===== */}
          {battleState === "create" && battleCode && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="card-sporty p-6 text-center space-y-4">
                <div className="text-sm font-body text-muted-foreground uppercase tracking-wider">
                  Your Battle Code
                </div>
                <div
                  data-ocid="battle.code.display"
                  className="font-display font-black text-5xl tracking-[0.3em] text-neon-green py-3"
                  style={{ textShadow: "0 0 30px oklch(0.85 0.22 130 / 0.5)" }}
                >
                  {battleCode}
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Share this code with your friend. They enter it on their
                  device to join your battle. You both have{" "}
                  <span className="text-neon-orange font-bold">20 minutes</span>{" "}
                  from when they join.
                </p>
                {battleData && (
                  <div
                    data-ocid="battle.status.panel"
                    className={cn(
                      "text-xs font-display font-bold px-3 py-1.5 rounded-full inline-block",
                      battleData.status ===
                        Variant_active_finished_waiting.waiting
                        ? "bg-muted/40 text-muted-foreground"
                        : "bg-primary/20 text-neon-green border border-primary/30",
                    )}
                  >
                    {battleData.status ===
                    Variant_active_finished_waiting.waiting
                      ? "⏳ Waiting for opponent..."
                      : "✅ Opponent joined!"}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  data-ocid="battle.share_code.button"
                  onClick={handleShareCode}
                  variant="outline"
                  className="h-12 border-border font-display font-bold gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share Code
                </Button>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  className="h-12 border-border font-display font-bold gap-2"
                >
                  {codeCopied ? (
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {codeCopied ? "Copied!" : "Copy Code"}
                </Button>
              </div>

              <Button
                data-ocid="battle.start_session.button"
                onClick={handleStartSession}
                disabled={isLoading || isSupported === false}
                className="w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start My Session
              </Button>

              <Button
                variant="ghost"
                onClick={() => setBattleState("menu")}
                className="w-full text-muted-foreground font-body text-sm"
              >
                ← Back to Menu
              </Button>
            </motion.div>
          )}

          {/* ===== JOIN ===== */}
          {battleState === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="card-sporty p-6 space-y-4">
                <h2 className="font-display font-black text-xl">
                  Enter Battle Code
                </h2>
                <p className="text-sm text-muted-foreground font-body">
                  Ask your friend for their 6-character battle code. Works on
                  any device!
                </p>
                <Input
                  data-ocid="battle.code.input"
                  placeholder="e.g. ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="font-display font-black text-3xl text-center tracking-[0.25em] h-16 bg-muted/30 border-border uppercase"
                  onKeyDown={(e) => e.key === "Enter" && handleJoinBattle()}
                />
                <Button
                  data-ocid="battle.join_submit.button"
                  onClick={handleJoinBattle}
                  disabled={joinBattle.isPending}
                  className="w-full h-12 bg-primary text-primary-foreground font-display font-bold glow-green"
                >
                  {joinBattle.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {joinBattle.isPending ? "Joining..." : "Join Battle!"}
                </Button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setBattleState("menu")}
                className="w-full text-muted-foreground font-body text-sm"
              >
                ← Back to Menu
              </Button>
            </motion.div>
          )}

          {/* ===== ACTIVE SESSION ===== */}
          {battleState === "active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Timer */}
              <div className="card-sporty p-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                  Time Left
                </span>
                <span
                  className={cn(
                    "font-display font-bold text-sm",
                    timeRemaining < 60000
                      ? "text-destructive animate-pulse"
                      : "text-neon-orange",
                  )}
                >
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>

              {/* Camera View */}
              <div
                data-ocid="battle.camera.canvas_target"
                className="relative w-full rounded-2xl overflow-hidden bg-muted aspect-[4/3] border border-border"
              >
                <video
                  ref={videoRef}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover scale-x-[-1]",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    {error ? (
                      <div className="text-center">
                        <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground font-body px-4">
                          Camera unavailable
                        </p>
                      </div>
                    ) : (
                      <RefreshCw className="w-8 h-8 text-neon-green animate-spin" />
                    )}
                  </div>
                )}

                {isActive && (
                  <div
                    className={cn(
                      "absolute top-3 left-3 px-3 py-1 rounded-full border font-display font-bold text-xs z-10",
                      phaseColors[phase],
                      phase === "up"
                        ? "bg-primary/20 border-primary/30"
                        : "bg-muted/20 border-muted/30",
                    )}
                  >
                    {phaseLabels[phase]}
                  </div>
                )}

                {isActive && calibrating && (
                  <div className="absolute bottom-3 left-3 right-3 z-20 bg-card/80 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body text-center">
                    Calibrating... get into push-up position
                  </div>
                )}
              </div>

              {/* Count + Opponent */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card-sporty p-4 text-center">
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    You ({username})
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={countKey}
                      initial={{ scale: 1.3, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                      className={cn(
                        "font-display font-black text-4xl transition-colors duration-150",
                        repPulse ? "text-yellow-300" : "text-neon-green",
                      )}
                      style={{
                        textShadow: "0 0 15px oklch(0.85 0.22 130 / 0.4)",
                      }}
                    >
                      {count}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="card-sporty p-4 text-center">
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    Opponent
                  </div>
                  <div className="font-display font-black text-4xl text-neon-cyan">
                    {liveOpponentScore !== null && liveOpponentScore > 0
                      ? liveOpponentScore
                      : "—"}
                  </div>
                  <div className="text-xs text-muted-foreground font-body mt-1">
                    live
                  </div>
                </div>
              </div>

              {/* Manual adjust + submit */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCount((c) => Math.max(0, c - 1));
                    setCountKey((k) => k + 1);
                  }}
                  className="h-12 w-12 border-border"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  data-ocid="battle.submit_score.button"
                  onClick={handleSubmitScore}
                  className="flex-1 h-12 bg-primary text-primary-foreground font-display font-bold glow-green"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Score ({count} reps)
                </Button>
              </div>

              {/* ===== CHAT PANEL ===== */}
              <div
                className="rounded-2xl border overflow-hidden"
                style={{
                  background: "rgba(31,31,31,0.95)",
                  borderColor: "oklch(0.55 0.18 42 / 0.35)",
                }}
              >
                {/* Chat header */}
                <div
                  className="flex items-center gap-2 px-3 py-2 border-b"
                  style={{ borderColor: "oklch(0.55 0.18 42 / 0.2)" }}
                >
                  <MessageSquare
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.75 0.18 42)" }}
                  />
                  <span
                    className="text-xs font-display font-bold"
                    style={{ color: "oklch(0.75 0.18 42)" }}
                  >
                    Battle Chat
                  </span>
                  <span className="text-xs text-muted-foreground font-body ml-1">
                    live
                  </span>
                </div>

                {/* Message list */}
                <div
                  ref={chatScrollRef}
                  className="overflow-y-auto px-3 py-2 space-y-1.5"
                  style={{ maxHeight: "160px" }}
                >
                  {chatMessages.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-body text-center py-3">
                      No messages yet — say something! 👊
                    </p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.isOwn ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className="max-w-[80%] rounded-xl px-3 py-1.5"
                          style={
                            msg.isOwn
                              ? {
                                  background: "oklch(0.55 0.18 42 / 0.25)",
                                  border: "1px solid oklch(0.55 0.18 42 / 0.3)",
                                  borderBottomRightRadius: "4px",
                                }
                              : {
                                  background: "oklch(0.3 0.1 200 / 0.3)",
                                  border: "1px solid oklch(0.5 0.12 200 / 0.4)",
                                  borderBottomLeftRadius: "4px",
                                }
                          }
                        >
                          {!msg.isOwn && (
                            <p
                              className="text-[10px] font-display font-bold mb-0.5"
                              style={{ color: "oklch(0.7 0.12 200)" }}
                            >
                              {msg.senderUsername}
                            </p>
                          )}
                          <p
                            className="text-xs font-body leading-snug"
                            style={{
                              color: msg.isOwn
                                ? "oklch(0.92 0.12 42)"
                                : "oklch(0.88 0.08 200)",
                            }}
                          >
                            {msg.text}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-body mt-0.5 text-right">
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input row */}
                <div
                  className="flex gap-2 px-3 py-2 border-t"
                  style={{ borderColor: "oklch(0.55 0.18 42 / 0.2)" }}
                >
                  <Input
                    data-ocid="battle.chat.input"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    maxLength={120}
                    className="h-8 text-xs font-body flex-1 bg-transparent border-muted/40 focus:border-amber-500/60 placeholder:text-muted-foreground/50"
                  />
                  <Button
                    data-ocid="battle.chat.submit_button"
                    onClick={handleSendChat}
                    disabled={!chatInput.trim()}
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    style={{
                      background: chatInput.trim()
                        ? "oklch(0.55 0.18 42)"
                        : "oklch(0.3 0.04 42)",
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== RESULT ===== */}
          {battleState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div
                data-ocid="battle.result.card"
                className="card-sporty p-6 text-center relative overflow-hidden"
                style={{
                  background: iWon
                    ? "linear-gradient(135deg, oklch(0.15 0.06 150), oklch(0.2 0.08 90 / 0.4))"
                    : "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 22 / 0.3))",
                  border: iWon
                    ? "1px solid oklch(0.6 0.18 150 / 0.5)"
                    : undefined,
                }}
              >
                {iWon && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {["🎉", "⭐", "💪", "🏆", "✨", "🎊"].map((emoji, i) => (
                      <span
                        key={emoji}
                        className="absolute text-2xl animate-bounce"
                        style={{
                          left: `${10 + i * 15}%`,
                          top: `${5 + (i % 2) * 15}%`,
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: "1.2s",
                        }}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-5xl mb-2">{iWon ? "🏆" : "💪"}</div>
                <h2 className="font-display font-black text-2xl mb-1">
                  {iWon ? "You Won!" : "Good Effort!"}
                </h2>
                {iWon && (
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-xs bg-primary/20 text-neon-green border border-primary/30 rounded-full px-3 py-0.5 font-display font-bold">
                      +300 XP Battle Bonus!
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "card-sporty p-4 text-center",
                    iWon && "ring-1 ring-neon-green/50",
                  )}
                >
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    {username} {iWon ? "👑" : ""}
                  </div>
                  <div className="font-display font-black text-4xl text-neon-green">
                    {myScore}
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
                    reps
                  </div>
                </div>
                <div
                  className={cn(
                    "card-sporty p-4 text-center",
                    !iWon && "ring-1 ring-neon-orange/50",
                  )}
                >
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    Opponent {!iWon ? "👑" : ""}
                  </div>
                  <div className="font-display font-black text-4xl text-neon-cyan">
                    {opponentFinalScore}
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
                    reps
                  </div>
                </div>
              </div>

              <Button
                data-ocid="battle.share_result.button"
                onClick={() => setShareOpen(true)}
                variant="outline"
                className="w-full h-12 border-border font-display font-bold gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Result
              </Button>

              <Button
                data-ocid="battle.play_again.button"
                onClick={handlePlayAgain}
                className="w-full h-12 bg-primary text-primary-foreground font-display font-bold glow-green"
              >
                Play Again ⚔️
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ShareResultModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        repCount={myScore}
        xpEarned={iWon ? myScore * 10 + 300 : myScore * 10}
        username={username}
        tier={tierInfo.label}
      />
    </div>
  );
}
