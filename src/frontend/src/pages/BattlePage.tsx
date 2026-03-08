import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Copy,
  RefreshCw,
  RotateCcw,
  Share2,
  Swords,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCamera } from "../camera/useCamera";
import ShareResultModal from "../components/ShareResultModal";
import { useUserProfile } from "../hooks/useQueries";
import { getTierFromXp } from "../lib/xp";

type BattleState = "menu" | "create" | "join" | "active" | "result";
type PosePhase = "up" | "down" | "unknown";

interface PosePoint {
  x: number;
  y: number;
  score: number;
}

interface BattleData {
  code: string;
  creatorName: string;
  creatorScore: number;
  challengerName: string | null;
  challengerScore: number | null;
  createdAt: number;
  expiresAt: number;
  status: "waiting" | "active" | "finished";
}

function calcElbowAngle(
  shoulder: PosePoint,
  elbow: PosePoint,
  wrist: PosePoint,
): number {
  const v1 = { x: shoulder.x - elbow.x, y: shoulder.y - elbow.y };
  const v2 = { x: wrist.x - elbow.x, y: wrist.y - elbow.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  if (mag1 < 1e-6 || mag2 < 1e-6) return 90;
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

function estimatePushupPhase(keypoints: PosePoint[]): PosePhase {
  const minScore = 0.25;
  const lShoulder = keypoints[5];
  const rShoulder = keypoints[6];
  const lElbow = keypoints[7];
  const rElbow = keypoints[8];
  const lWrist = keypoints[9];
  const rWrist = keypoints[10];
  if (!lShoulder || !rShoulder || !lElbow || !rElbow || !lWrist || !rWrist)
    return "unknown";
  const lHighConf =
    lShoulder.score >= minScore &&
    lElbow.score >= minScore &&
    lWrist.score >= minScore;
  const rHighConf =
    rShoulder.score >= minScore &&
    rElbow.score >= minScore &&
    rWrist.score >= minScore;
  if (lHighConf || rHighConf) {
    const angles: number[] = [];
    if (lHighConf) angles.push(calcElbowAngle(lShoulder, lElbow, lWrist));
    if (rHighConf) angles.push(calcElbowAngle(rShoulder, rElbow, rWrist));
    const avgAngle = angles.reduce((s, a) => s + a, 0) / angles.length;
    if (avgAngle > 150) return "up";
    if (avgAngle < 100) return "down";
    return "unknown";
  }
  const elbowYConf =
    lElbow.score >= minScore * 0.6 && rElbow.score >= minScore * 0.6;
  const shoulderYConf =
    lShoulder.score >= minScore * 0.6 && rShoulder.score >= minScore * 0.6;
  if (elbowYConf && shoulderYConf) {
    const avgElbowY = (lElbow.y + rElbow.y) / 2;
    const avgShoulderY = (lShoulder.y + rShoulder.y) / 2;
    const diff = avgElbowY - avgShoulderY;
    if (diff > 40) return "down";
    if (diff < -10) return "up";
  }
  return "unknown";
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
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((ms % (1000 * 60)) / 1000);
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  if (mins > 0) return `${mins}m ${secs}s remaining`;
  return `${secs}s remaining`;
}

export default function BattlePage() {
  const { data: profile } = useUserProfile();
  const username = profile?.username ?? "Athlete";
  const xp = profile ? Number(profile.xp) : 0;
  const tierInfo = getTierFromXp(xp);

  const [battleState, setBattleState] = useState<BattleState>("menu");
  const [currentBattle, setCurrentBattle] = useState<BattleData | null>(null);
  const [isCreator, setIsCreator] = useState(true);
  const [joinCode, setJoinCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [shareOpen, setShareOpen] = useState(false);

  // Push-up counter state
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
    width: 640,
    height: 480,
  });

  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<PosePhase>("unknown");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectorReady, setDetectorReady] = useState(false);
  const [detectorError, setDetectorError] = useState<string | null>(null);
  const [countKey, setCountKey] = useState(0);

  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<PosePhase>("unknown");
  const lastTransitionRef = useRef<number>(0);

  // Timer
  useEffect(() => {
    if (battleState !== "active" || !currentBattle) return;
    const interval = setInterval(() => {
      const remaining = currentBattle.expiresAt - Date.now();
      setTimeRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    setTimeRemaining(currentBattle.expiresAt - Date.now());
    return () => clearInterval(interval);
  }, [battleState, currentBattle]);

  // Load TF detector
  useEffect(() => {
    if (battleState !== "active") return;
    let cancelled = false;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    }

    async function loadDetector() {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js",
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js",
        );
        const tf = (window as any).tf;
        const poseDetection = (window as any).poseDetection;
        if (!tf || !poseDetection) throw new Error("TF not loaded");
        await tf.ready();
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING },
        );
        if (!cancelled) {
          detectorRef.current = detector;
          setDetectorReady(true);
        }
      } catch (err) {
        console.warn("Pose detector:", err);
        if (!cancelled)
          setDetectorError("Pose detection unavailable. Use manual counting.");
      }
    }

    loadDetector();
    return () => {
      cancelled = true;
    };
  }, [battleState]);

  const detectLoop = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current || !isActive) {
      setIsDetecting(false);
      return;
    }
    const video = videoRef.current;
    if (video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }
    try {
      const poses = await detectorRef.current.estimatePoses(video);
      if (poses.length > 0) {
        const kps = poses[0].keypoints as PosePoint[];
        const newPhase = estimatePushupPhase(kps);
        const now = Date.now();
        if (
          newPhase !== "unknown" &&
          newPhase !== phaseRef.current &&
          now - lastTransitionRef.current > 400
        ) {
          const prevPhase = phaseRef.current;
          phaseRef.current = newPhase;
          setPhase(newPhase);
          lastTransitionRef.current = now;
          if (newPhase === "up" && prevPhase === "down") {
            setCount((c) => c + 1);
            setCountKey((k) => k + 1);
          }
        }
      }
    } catch {
      /* continue */
    }
    rafRef.current = requestAnimationFrame(detectLoop);
  }, [isActive, videoRef]);

  useEffect(() => {
    if (isDetecting && isActive && detectorReady) {
      rafRef.current = requestAnimationFrame(detectLoop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDetecting, isActive, detectorReady, detectLoop]);

  const handleCreateBattle = () => {
    const code = generateBattleCode();
    const battle: BattleData = {
      code,
      creatorName: username,
      creatorScore: 0,
      challengerName: null,
      challengerScore: null,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400000,
      status: "waiting",
    };
    localStorage.setItem(`kidfit_battle_${code}`, JSON.stringify(battle));
    setCurrentBattle(battle);
    setIsCreator(true);
    setBattleState("create");
  };

  const handleCopyCode = async () => {
    if (!currentBattle) return;
    try {
      await navigator.clipboard.writeText(currentBattle.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
      toast.success("Battle code copied!");
    } catch {
      toast.error("Could not copy code");
    }
  };

  const handleShareCode = async () => {
    if (!currentBattle) return;
    const shareText = `Join my 24-hour Push-Up Battle on KidFit! Use code: ${currentBattle.code} 💪 #KidFit`;
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
          title: "KidFit Battle Challenge",
        });
      } catch {
        handleCopyCode();
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Battle invite copied!");
    }
  };

  const handleStartSession = async () => {
    setCount(0);
    phaseRef.current = "unknown";
    lastTransitionRef.current = 0;
    const ok = await startCamera();
    if (ok) setIsDetecting(true);
    setBattleState("active");
  };

  const handleJoinBattle = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      toast.error("Please enter a 6-character code");
      return;
    }
    const stored = localStorage.getItem(`kidfit_battle_${code}`);
    if (!stored) {
      toast.error("Battle not found. Check the code and try again.");
      return;
    }
    try {
      const battle = JSON.parse(stored) as BattleData;
      if (battle.status !== "waiting") {
        toast.error("This battle has already started.");
        return;
      }
      if (Date.now() > battle.expiresAt) {
        toast.error("This battle has expired.");
        return;
      }
      const updated: BattleData = {
        ...battle,
        challengerName: username,
        status: "active",
      };
      localStorage.setItem(`kidfit_battle_${code}`, JSON.stringify(updated));
      setCurrentBattle(updated);
      setIsCreator(false);
      handleStartSessionJoin(updated);
    } catch {
      toast.error("Could not read battle data.");
    }
  };

  const handleStartSessionJoin = async (battle: BattleData) => {
    setCount(0);
    phaseRef.current = "unknown";
    lastTransitionRef.current = 0;
    const ok = await startCamera();
    if (ok) setIsDetecting(true);
    setCurrentBattle(battle);
    setBattleState("active");
  };

  const handleRefreshOpponent = () => {
    if (!currentBattle) return;
    const stored = localStorage.getItem(`kidfit_battle_${currentBattle.code}`);
    if (!stored) return;
    try {
      const battle = JSON.parse(stored) as BattleData;
      setCurrentBattle(battle);
      toast.info("Opponent scores updated!");
    } catch {
      /* ignore */
    }
  };

  const handleSubmitScore = () => {
    if (!currentBattle) return;
    setIsDetecting(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    stopCamera();

    const stored = localStorage.getItem(`kidfit_battle_${currentBattle.code}`);
    let battle = currentBattle;
    if (stored) {
      try {
        battle = JSON.parse(stored) as BattleData;
      } catch {
        /* use current */
      }
    }

    const updated: BattleData = isCreator
      ? { ...battle, creatorScore: count, status: "finished" }
      : { ...battle, challengerScore: count, status: "finished" };

    localStorage.setItem(
      `kidfit_battle_${currentBattle.code}`,
      JSON.stringify(updated),
    );
    setCurrentBattle(updated);
    setBattleState("result");
  };

  const handlePlayAgain = () => {
    setCurrentBattle(null);
    setCount(0);
    setPhase("unknown");
    setBattleState("menu");
  };

  // Phase indicator
  const phaseColors = {
    up: "text-neon-green",
    down: "text-neon-cyan",
    unknown: "text-muted-foreground",
  };
  const phaseLabels = { up: "UP", down: "DOWN", unknown: "READY" };

  // Result calculation
  const myScore = isCreator
    ? (currentBattle?.creatorScore ?? 0)
    : (currentBattle?.challengerScore ?? 0);
  const opponentScore = isCreator
    ? (currentBattle?.challengerScore ?? null)
    : (currentBattle?.creatorScore ?? null);
  const myName = username;
  const opponentName = isCreator
    ? currentBattle?.challengerName
    : currentBattle?.creatorName;
  const iWon = opponentScore !== null ? myScore > opponentScore : true;

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      <header className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black flex items-center gap-2">
          <Swords className="w-6 h-6 text-neon-orange" />
          Push-Up Battle
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          24-hour push-up challenge with friends
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
                className="card-sporty p-6 text-center relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 42 / 0.4))",
                }}
              >
                <div className="text-6xl mb-3">⚔️</div>
                <h2 className="font-display font-black text-2xl mb-2">
                  Challenge a Friend!
                </h2>
                <p className="text-sm text-muted-foreground font-body">
                  Create a battle, share your code, and see who can do more
                  push-ups in 24 hours.
                </p>
              </div>

              <Button
                data-ocid="battle.create.button"
                onClick={handleCreateBattle}
                className="w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green"
              >
                <Swords className="w-5 h-5 mr-2" />
                Create Battle
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
          {battleState === "create" && currentBattle && (
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
                  {currentBattle.code}
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Share this code with your friend. They have 24 hours to join
                  and submit their score.
                </p>
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
                  Ask your friend for their 6-character battle code.
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
                  className="w-full h-12 bg-primary text-primary-foreground font-display font-bold glow-green"
                >
                  Join Battle!
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
                      ? "text-destructive"
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
                    "w-full h-full object-cover scale-x-[-1]",
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
                      "absolute top-3 left-3 px-3 py-1 rounded-full border font-display font-bold text-xs",
                      phaseColors[phase],
                      phase === "up"
                        ? "bg-primary/20 border-primary/30"
                        : "bg-muted/20 border-muted/30",
                    )}
                  >
                    {phaseLabels[phase]}
                  </div>
                )}
              </div>

              {/* Count + Opponent */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card-sporty p-4 text-center">
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    You ({myName})
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={countKey}
                      initial={{ scale: 1.3, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, type: "spring" }}
                      className="font-display font-black text-4xl text-neon-green"
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
                    {opponentName ?? "Opponent"}
                  </div>
                  <div className="font-display font-black text-4xl text-neon-cyan">
                    {opponentScore ?? "—"}
                  </div>
                  <Button
                    data-ocid="battle.refresh.button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshOpponent}
                    className="mt-1 h-6 text-xs text-muted-foreground px-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Manual + submit */}
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

              {detectorError && (
                <div className="card-sporty p-3 text-xs text-muted-foreground font-body text-center">
                  {detectorError} — use +/- to manually count.
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCount((c) => Math.max(0, c - 1))}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCount((c) => c + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ===== RESULT ===== */}
          {battleState === "result" && currentBattle && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Winner Banner */}
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
                {/* Confetti burst */}
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

              {/* Score Comparison */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "card-sporty p-4 text-center",
                    iWon && "ring-1 ring-neon-green/50",
                  )}
                >
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    {myName} {iWon ? "👑" : ""}
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
                    !iWon &&
                      opponentScore !== null &&
                      myScore < opponentScore &&
                      "ring-1 ring-neon-orange/50",
                  )}
                >
                  <div className="text-xs text-muted-foreground font-body mb-1">
                    {opponentName ?? "Opponent"}
                    {!iWon && opponentScore !== null && myScore < opponentScore
                      ? " 👑"
                      : ""}
                  </div>
                  <div className="font-display font-black text-4xl text-neon-cyan">
                    {opponentScore ?? "—"}
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
        xpEarned={iWon ? count * 10 + 300 : count * 10}
        username={username}
        tier={tierInfo.label}
      />
    </div>
  );
}
