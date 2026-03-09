import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle,
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
import { getTierFromXp } from "../lib/xp";

// ===== Push-up detection state machine =====
type PosePhase = "up" | "down" | "unknown";

interface PosePoint {
  x: number;
  y: number;
  score: number;
}

/**
 * Front-camera nose-based push-up phase detection.
 *
 * MoveNet keypoint indices:
 *   0  = nose
 *   5  = left shoulder
 *   6  = right shoulder
 *   11 = left hip
 *   12 = right hip
 *
 * When facing the camera and doing a push-up:
 *   UP position   → nose is HIGH (lower Y value)
 *   DOWN position → nose drops toward shoulders/floor (higher Y value)
 *
 * We normalise by (hipY - shoulderY) to be camera-distance agnostic.
 */
function estimatePushupPhase(
  keypoints: PosePoint[],
  prevShoulderY: number | null,
): { phase: PosePhase; shoulderY: number | null; noseRelative: number | null } {
  const MIN_SCORE = 0.1; // very low to work on phones

  const nose = keypoints[0];
  const lShoulder = keypoints[5];
  const rShoulder = keypoints[6];
  const lHip = keypoints[11];
  const rHip = keypoints[12];

  const lShoulderOk = lShoulder?.score >= MIN_SCORE;
  const rShoulderOk = rShoulder?.score >= MIN_SCORE;
  const lHipOk = lHip?.score >= MIN_SCORE;
  const rHipOk = rHip?.score >= MIN_SCORE;
  const noseOk = nose?.score >= MIN_SCORE;

  // ── Primary: nose relative to shoulders ─────────────────────────────────
  if (noseOk && (lShoulderOk || rShoulderOk) && (lHipOk || rHipOk)) {
    const shoulderY =
      lShoulderOk && rShoulderOk
        ? (lShoulder.y + rShoulder.y) / 2
        : lShoulderOk
          ? lShoulder.y
          : rShoulder.y;

    const hipY =
      lHipOk && rHipOk ? (lHip.y + rHip.y) / 2 : lHipOk ? lHip.y : rHip.y;

    const range = hipY - shoulderY;

    if (range < 20) {
      // body too flat / not enough range to detect, fall through
    } else {
      const noseRelative = (nose.y - shoulderY) / range;
      // noseRelative < 0.15  → nose well above/at shoulders = UP
      // noseRelative > 0.35  → nose has dropped toward ground = DOWN
      let phase: PosePhase = "unknown";
      if (noseRelative < 0.15) phase = "up";
      else if (noseRelative > 0.35) phase = "down";
      return { phase, shoulderY, noseRelative };
    }
  }

  // ── Fallback: shoulder Y movement across frames ───────────────────────────
  if (lShoulderOk || rShoulderOk) {
    const curShoulderY =
      lShoulderOk && rShoulderOk
        ? (lShoulder.y + rShoulder.y) / 2
        : lShoulderOk
          ? lShoulder.y
          : rShoulder.y;

    if (prevShoulderY !== null) {
      const delta = curShoulderY - prevShoulderY; // positive = moving down in image
      if (delta > 8)
        return { phase: "down", shoulderY: curShoulderY, noseRelative: null };
      if (delta < -8)
        return { phase: "up", shoulderY: curShoulderY, noseRelative: null };
    }
    return { phase: "unknown", shoulderY: curShoulderY, noseRelative: null };
  }

  return { phase: "unknown", shoulderY: null, noseRelative: null };
}

/** Draw skeleton overlay on canvas */
function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  keypoints: PosePoint[],
  canvasWidth: number,
  canvasHeight: number,
) {
  // Map normalised [0,1] coords to canvas pixels
  const px = (kp: PosePoint) => kp.x * canvasWidth;
  const py = (kp: PosePoint) => kp.y * canvasHeight;

  const dotColor = (score: number) => {
    if (score >= 0.5) return "#00ff88"; // bright green = high confidence
    if (score >= 0.2) return "#ffdd00"; // yellow = medium
    return "#ff4444"; // red = low
  };

  // Bones to draw: [from_idx, to_idx]
  const bones: [number, number][] = [
    [5, 6], // shoulders
    [5, 11], // left shoulder → left hip
    [6, 12], // right shoulder → right hip
    [11, 12], // hips
    [5, 7], // left shoulder → left elbow
    [6, 8], // right shoulder → right elbow
    [7, 9], // left elbow → left wrist
    [8, 10], // right elbow → right wrist
    [0, 5], // nose → left shoulder
    [0, 6], // nose → right shoulder
  ];

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw bones
  for (const [a, b] of bones) {
    const kpA = keypoints[a];
    const kpB = keypoints[b];
    if (!kpA || !kpB) continue;
    if (kpA.score < 0.1 || kpB.score < 0.1) continue;
    ctx.beginPath();
    ctx.moveTo(px(kpA), py(kpA));
    ctx.lineTo(px(kpB), py(kpB));
    ctx.strokeStyle = "rgba(0,255,136,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw keypoint dots
  for (let i = 0; i < Math.min(keypoints.length, 17); i++) {
    const kp = keypoints[i];
    if (!kp || kp.score < 0.1) continue;
    ctx.beginPath();
    ctx.arc(px(kp), py(kp), 5, 0, Math.PI * 2);
    ctx.fillStyle = dotColor(kp.score);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
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
    width: 640,
    height: 480,
  });

  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<PosePhase>("unknown");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectorReady, setDetectorReady] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [detectorError, setDetectorError] = useState<string | null>(null);
  const [countKey, setCountKey] = useState(0);
  const [repPulse, setRepPulse] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastSessionCount, setLastSessionCount] = useState(0);
  const [noseRelativeDebug, setNoseRelativeDebug] = useState<number | null>(
    null,
  );

  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<PosePhase>("unknown");
  const lastTransitionRef = useRef<number>(0);
  const seenDownRef = useRef<boolean>(false);
  const lastRepTimeRef = useRef<number>(0);
  const prevShoulderYRef = useRef<number | null>(null);
  // overlay canvas (separate from the camera canvas)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const { mutateAsync: logPushups, isPending: isLogging } = useLogPushups();
  const { data: profile } = useUserProfile();
  const username = profile?.username ?? "Athlete";
  const xp = profile ? Number(profile.xp) : 0;
  const tierInfo = getTierFromXp(xp);

  // Load TensorFlow and MoveNet via CDN scripts (avoids bundler issues)
  useEffect(() => {
    let cancelled = false;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
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

        const tf = (window as any).tf as { ready: () => Promise<void> };
        const poseDetection = (window as any).poseDetection as {
          createDetector: (
            model: string,
            config: Record<string, unknown>,
          ) => Promise<unknown>;
          SupportedModels: { MoveNet: string };
          movenet: { modelType: { SINGLEPOSE_LIGHTNING: string } };
        };

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
        console.warn("Could not load pose detector:", err);
        if (!cancelled) {
          setDetectorError("Pose detection unavailable. Use manual counting.");
        }
      }
    }

    loadDetector();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pose detection loop
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

        // Draw skeleton overlay
        const overlay = overlayCanvasRef.current;
        if (overlay) {
          const ctx = overlay.getContext("2d");
          if (ctx) {
            drawSkeleton(ctx, kps, overlay.width, overlay.height);
          }
        }

        const {
          phase: newPhase,
          shoulderY,
          noseRelative,
        } = estimatePushupPhase(kps, prevShoulderYRef.current);

        if (shoulderY !== null) prevShoulderYRef.current = shoulderY;
        if (noseRelative !== null) setNoseRelativeDebug(noseRelative);

        const now = Date.now();

        // Debounce transitions — 200ms
        if (
          newPhase !== "unknown" &&
          newPhase !== phaseRef.current &&
          now - lastTransitionRef.current > 200
        ) {
          phaseRef.current = newPhase;
          setPhase(newPhase);
          lastTransitionRef.current = now;

          if (newPhase === "down") {
            seenDownRef.current = true;
          }

          // Count a rep when we come back "up" after having been "down"
          // Minimum rep duration: 600ms
          if (
            newPhase === "up" &&
            seenDownRef.current &&
            now - lastRepTimeRef.current > 600
          ) {
            setCount((c) => c + 1);
            setCountKey((k) => k + 1);
            setRepPulse(true);
            setTimeout(() => setRepPulse(false), 400);
            seenDownRef.current = false;
            lastRepTimeRef.current = now;
          }
        }
      }
    } catch {
      // silently continue
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

  // Clear overlay when camera stops
  useEffect(() => {
    if (!isActive) {
      const overlay = overlayCanvasRef.current;
      if (overlay) {
        const ctx = overlay.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
      }
    }
  }, [isActive]);

  const handleStart = async () => {
    setCount(0);
    setPhase("unknown");
    phaseRef.current = "unknown";
    lastTransitionRef.current = 0;
    seenDownRef.current = false;
    lastRepTimeRef.current = 0;
    prevShoulderYRef.current = null;
    setNoseRelativeDebug(null);
    setSessionStarted(true);
    const ok = await startCamera();
    if (ok) {
      setIsDetecting(true);
    }
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
      toast.success(`💪 ${count} push-ups logged! +${count * 10} XP earned!`);
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
    phaseRef.current = "unknown";
    lastTransitionRef.current = 0;
    seenDownRef.current = false;
    lastRepTimeRef.current = 0;
    prevShoulderYRef.current = null;
    setNoseRelativeDebug(null);
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
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black flex items-center gap-2">
          <Target className="w-6 h-6 text-neon-cyan" />
          Push-Up Counter
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          AI camera detects your reps automatically
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
              "scale-x-[-1]", // mirror for front camera
            )}
            playsInline
            muted
          />

          {/* Hidden camera canvas (used by useCamera hook internally) */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Skeleton overlay canvas — visible over the video */}
          <canvas
            ref={overlayCanvasRef}
            width={640}
            height={480}
            className={cn(
              "absolute inset-0 w-full h-full pointer-events-none scale-x-[-1]",
              isActive && detectorReady ? "opacity-100" : "opacity-0",
            )}
            style={{ transition: "opacity 0.3s" }}
          />

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

          {/* Phase indicator overlay */}
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

          {/* Nose-relative debug value (small, top-right) */}
          {isActive && noseRelativeDebug !== null && (
            <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
              nr: {noseRelativeDebug.toFixed(2)}
            </div>
          )}

          {/* Detector loading overlay */}
          {isActive && !detectorReady && !detectorError && (
            <div className="absolute bottom-3 left-3 right-3 z-20 bg-card/80 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body text-center">
              Loading pose detector...
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
                  repPulse ? "text-yellow-300" : "text-neon-green",
                )}
                style={{
                  textShadow: repPulse
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
              <li>
                • The AI tracks your nose dropping and rising to count reps
              </li>
              <li>• Good lighting helps — avoid strong backlight behind you</li>
            </ul>
            {detectorError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-xs text-destructive font-body">
                {detectorError}
              </div>
            )}
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
                    <CheckCircle className="w-5 h-5 mr-2" /> Finish +
                    {count * 10} XP
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Manual count tip */}
        {sessionStarted && detectorError && (
          <div className="card-sporty p-4 flex items-center gap-3">
            <Zap className="w-5 h-5 text-neon-orange shrink-0" />
            <div>
              <div className="font-display font-bold text-sm">Manual Mode</div>
              <div className="text-xs text-muted-foreground font-body">
                Pose detection unavailable. Manually enter your reps using the
                counter below.
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
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

        {/* Share button (shown after session) */}
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
        xpEarned={lastSessionCount * 10}
        username={username}
        tier={tierInfo.label}
      />
    </div>
  );
}
