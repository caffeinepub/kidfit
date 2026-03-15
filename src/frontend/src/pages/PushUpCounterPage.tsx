import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle,
  Hand,
  RefreshCw,
  RotateCcw,
  Share2,
  Target,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useCamera } from "../camera/useCamera";
import ShareResultModal from "../components/ShareResultModal";
import { useLogPushups, useUserProfile } from "../hooks/useQueries";
import { recordSession } from "../lib/pushUpStats";
import { getTierFromXp } from "../lib/xp";

type PosePhase = "up" | "down" | "unknown";

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

export default function PushUpCounterPage() {
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
  const [sessionStarted, setSessionStarted] = useState(false);
  const [countKey, setCountKey] = useState(0);
  const [repPulse, setRepPulse] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastSessionCount, setLastSessionCount] = useState(0);
  const [calibrating, setCalibrating] = useState(false);
  const [manualPulse, setManualPulse] = useState(false);

  const rafRef = useRef<number | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const motionStateRef = useRef<MotionState>(makeMotionState());

  const { mutateAsync: logPushups, isPending: isLogging } = useLogPushups();
  const { data: profile } = useUserProfile();
  const username = profile?.username ?? "Athlete";
  const xp = profile ? Number(profile.xp) : 0;
  const tierInfo = getTierFromXp(xp);

  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = 160;
    c.height = 120;
    offscreenRef.current = c;
    offscreenCtxRef.current = c.getContext("2d", { willReadFrequently: true });
  }, []);

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
      toast.info("No reps detected. Try again!");
      return;
    }
    try {
      await logPushups(BigInt(count));
      recordSession(count);
      toast.success(`💪 ${count} push-ups logged!`);
      setLastSessionCount(count);
      setShowShareModal(true);
    } catch {
      toast.error("Could not save session. Please try again.");
    }
    setCount(0);
  };

  const handleReset = () => {
    setCount(0);
    setPhase("unknown");
    motionStateRef.current = makeMotionState();
    setCalibrating(true);
    setTimeout(() => setCalibrating(false), 3000);
  };

  const handleManualRep = () => {
    setCount((c) => c + 1);
    setCountKey((k) => k + 1);
    setManualPulse(true);
    setTimeout(() => setManualPulse(false), 300);
  };

  const phaseIndicator = {
    up: {
      label: "UP ↑",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20 border-emerald-500/40",
    },
    down: {
      label: "DOWN ↓",
      color: "text-sky-400",
      bg: "bg-sky-500/20 border-sky-500/40",
    },
    unknown: {
      label: "READY",
      color: "text-muted-foreground",
      bg: "bg-muted/20 border-muted/30",
    },
  };
  const pi = phaseIndicator[phase];

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      <header className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black flex items-center gap-2">
          <Target className="w-6 h-6 text-neon-cyan" />
          Push-Up Counter
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          Camera detects your reps automatically
        </p>
      </header>

      <main className="flex-1 px-4 space-y-4">
        {/* Camera View */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-muted aspect-[4/3] border border-border">
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover",
              isActive ? "opacity-100" : "opacity-0",
              "scale-x-[-1]",
            )}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />

          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/80 z-10">
              {error ? (
                <>
                  <CameraOff className="w-12 h-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center px-4 font-body">
                    {error.type === "permission"
                      ? "Camera permission denied. Please allow camera access."
                      : error.type === "not-found"
                        ? "No camera found on this device."
                        : "Camera unavailable."}
                  </p>
                </>
              ) : isLoading ? (
                <>
                  <RefreshCw className="w-10 h-10 text-neon-green animate-spin" />
                  <p className="text-muted-foreground font-body text-sm">
                    Starting camera...
                  </p>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground font-body text-sm text-center">
                    Camera will start when you begin
                  </p>
                </>
              )}
            </div>
          )}

          {isActive && (
            <div
              className={cn(
                "absolute top-3 left-3 z-20 px-3 py-1 rounded-full border font-display font-bold text-xs",
                pi.bg,
                pi.color,
              )}
            >
              {pi.label}
            </div>
          )}

          {isActive && calibrating && (
            <div className="absolute bottom-3 left-3 right-3 z-20 bg-card/80 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body text-center">
              Calibrating motion... get into push-up position
            </div>
          )}
        </div>

        {/* Rep Counter */}
        <motion.div className="card-sporty p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.85 0.22 130) 0%, transparent 70%)",
              }}
            />
          </div>
          <div className="relative">
            <div className="text-sm font-body text-muted-foreground uppercase tracking-widest mb-1">
              Push-Ups
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={countKey}
                initial={{ scale: 1.5, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
                className={cn(
                  "font-display font-black text-8xl leading-none mb-2 transition-colors duration-150",
                  repPulse || manualPulse
                    ? "text-yellow-300"
                    : "text-neon-green",
                )}
                style={{
                  textShadow:
                    repPulse || manualPulse
                      ? "0 0 40px oklch(0.9 0.28 90 / 0.8)"
                      : "0 0 30px oklch(0.85 0.22 130 / 0.4)",
                }}
              >
                {count}
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-body">
              <span>
                Face the camera · Full upper body visible · Go DOWN and push UP
              </span>
            </div>
          </div>
        </motion.div>

        {/* ===== MANUAL REP BUTTON ===== */}
        {sessionStarted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <button
              data-ocid="pushup.manual_rep_button"
              type="button"
              onClick={handleManualRep}
              className={cn(
                "w-full rounded-2xl py-7 flex flex-col items-center justify-center gap-2 font-display font-black text-2xl transition-all duration-150 active:scale-95 select-none",
                manualPulse ? "scale-95" : "scale-100",
              )}
              style={{
                background: manualPulse
                  ? "oklch(0.75 0.22 90)"
                  : "linear-gradient(135deg, oklch(0.55 0.18 90), oklch(0.65 0.22 80))",
                color: "oklch(0.12 0.04 42)",
                boxShadow: manualPulse
                  ? "0 0 30px oklch(0.85 0.22 90 / 0.6), inset 0 2px 8px rgba(0,0,0,0.2)"
                  : "0 0 20px oklch(0.75 0.22 90 / 0.35), 0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <Hand className="w-8 h-8" />
              TAP TO ADD REP
            </button>
            <p className="text-xs text-muted-foreground font-body text-center px-4">
              Camera not working? Place phone below your face and tap the button
              above after each push-up.
            </p>
          </motion.div>
        )}

        {/* Instructions */}
        {!sessionStarted && (
          <div className="card-sporty p-4 space-y-2">
            <h3 className="font-display font-bold text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-neon-cyan" />
              How it works
            </h3>
            <ul className="space-y-1 text-xs text-muted-foreground font-body">
              <li>• Prop your phone in front of you so it faces you</li>
              <li>
                • Make sure your head, shoulders, and hips are all visible
              </li>
              <li>• Do push-ups — go DOWN close to the floor, then push UP</li>
              <li>• Camera tracks your body movement to count reps</li>
              <li>• Good lighting helps — avoid strong backlight behind you</li>
              <li>• Camera not working? Use the manual tap button!</li>
            </ul>
          </div>
        )}

        {/* Manual adjust during session */}
        {sessionStarted && (
          <div className="card-sporty p-3 flex items-center gap-3">
            <Zap className="w-4 h-4 text-neon-orange shrink-0" />
            <div className="text-xs text-muted-foreground font-body flex-1">
              Mis-count? Tap +/- to adjust
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setCount((c) => Math.max(0, c - 1))}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => setCount((c) => c + 1)}
              >
                +
              </Button>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!sessionStarted ? (
            <Button
              data-ocid="pushups.start.button"
              onClick={handleStart}
              disabled={isLoading || isSupported === false}
              className="flex-1 h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="h-14 w-14 border-border"
                title="Reset counter"
                data-ocid="pushups.reset.button"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                data-ocid="pushups.finish.button"
                onClick={handleFinish}
                disabled={isLogging}
                className="flex-1 h-14 bg-primary text-primary-foreground font-display font-bold text-base glow-green"
              >
                {isLogging ? (
                  "Saving..."
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" /> Finish Session
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Share button */}
        {!sessionStarted && lastSessionCount > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowShareModal(true)}
            className="w-full h-12 border-border font-display font-bold gap-2"
            data-ocid="pushups.share.button"
          >
            <Share2 className="w-4 h-4" />
            Share My Result
          </Button>
        )}
      </main>

      <ShareResultModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        repCount={lastSessionCount}
        xpEarned={0}
        username={username}
        tier={tierInfo.label}
      />
    </div>
  );
}
