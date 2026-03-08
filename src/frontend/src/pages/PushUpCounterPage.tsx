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
 * Calculate the angle (in degrees) at the elbow joint.
 * Uses vectors from elbow → shoulder and elbow → wrist.
 */
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
  if (mag1 < 1e-6 || mag2 < 1e-6) return 90; // fallback
  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

/**
 * Front-camera-optimised push-up phase detection.
 *
 * MoveNet keypoint indices:
 *   5 = left shoulder,  6 = right shoulder
 *   7 = left elbow,     8 = right elbow
 *   9 = left wrist,    10 = right wrist
 *
 * UP   → elbow angle > 150° (arms extended)
 * DOWN → elbow angle < 100° (arms bent)
 *
 * Falls back to elbow-Y-vs-shoulder-Y comparison when confidence is low.
 */
function estimatePushupPhase(keypoints: PosePoint[]): PosePhase {
  const minScore = 0.25;

  const lShoulder = keypoints[5];
  const rShoulder = keypoints[6];
  const lElbow = keypoints[7];
  const rElbow = keypoints[8];
  const lWrist = keypoints[9];
  const rWrist = keypoints[10];

  if (!lShoulder || !rShoulder || !lElbow || !rElbow || !lWrist || !rWrist) {
    return "unknown";
  }

  const lHighConf =
    lShoulder.score >= minScore &&
    lElbow.score >= minScore &&
    lWrist.score >= minScore;
  const rHighConf =
    rShoulder.score >= minScore &&
    rElbow.score >= minScore &&
    rWrist.score >= minScore;

  // ── Primary: elbow angle method ──────────────────────────────────────────
  if (lHighConf || rHighConf) {
    const angles: number[] = [];
    if (lHighConf) angles.push(calcElbowAngle(lShoulder, lElbow, lWrist));
    if (rHighConf) angles.push(calcElbowAngle(rShoulder, rElbow, rWrist));
    const avgAngle = angles.reduce((s, a) => s + a, 0) / angles.length;

    if (avgAngle > 150) return "up";
    if (avgAngle < 100) return "down";
    return "unknown";
  }

  // ── Fallback: elbow Y vs shoulder Y ──────────────────────────────────────
  // In pixel coords, higher Y = lower on screen.
  // When arms are bent (down), elbows drop well below shoulder level.
  const elbowYConf =
    lElbow.score >= minScore * 0.6 && rElbow.score >= minScore * 0.6;
  const shoulderYConf =
    lShoulder.score >= minScore * 0.6 && rShoulder.score >= minScore * 0.6;

  if (elbowYConf && shoulderYConf) {
    const avgElbowY = (lElbow.y + rElbow.y) / 2;
    const avgShoulderY = (lShoulder.y + rShoulder.y) / 2;
    const diff = avgElbowY - avgShoulderY; // positive → elbows below shoulders
    if (diff > 40) return "down";
    if (diff < -10) return "up";
  }

  return "unknown";
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastSessionCount, setLastSessionCount] = useState(0);

  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<PosePhase>("unknown");
  const lastTransitionRef = useRef<number>(0);

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
        // Load TF.js + MoveNet from CDN
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js",
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js",
        );

        const tf = (window as unknown as Record<string, unknown>).tf as {
          ready: () => Promise<void>;
        };
        const poseDetection = (window as unknown as Record<string, unknown>)
          .poseDetection as {
          createDetector: (
            model: string,
            config: Record<string, unknown>,
          ) => Promise<unknown>;
          SupportedModels: { MoveNet: string };
          movenet: { modelType: { SINGLEPOSE_LIGHTNING: string } };
        };

        if (!tf || !poseDetection) {
          throw new Error("TF not loaded");
        }

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
        const newPhase = estimatePushupPhase(kps);
        const now = Date.now();

        // Debounce transitions (min 400ms between transitions)
        if (
          newPhase !== "unknown" &&
          newPhase !== phaseRef.current &&
          now - lastTransitionRef.current > 400
        ) {
          const prevPhase = phaseRef.current;
          phaseRef.current = newPhase;
          setPhase(newPhase);
          lastTransitionRef.current = now;

          // Count a rep when transitioning from down back to up
          if (newPhase === "up" && prevPhase === "down") {
            setCount((c) => c + 1);
            setCountKey((k) => k + 1);
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

  const handleStart = async () => {
    setCount(0);
    setPhase("unknown");
    phaseRef.current = "unknown";
    lastTransitionRef.current = 0;
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
  };

  const phaseIndicator = {
    up: {
      label: "UP",
      color: "text-neon-green",
      bg: "bg-primary/20 border-primary/30",
    },
    down: {
      label: "DOWN",
      color: "text-neon-cyan",
      bg: "bg-accent/20 border-accent/30",
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
              "w-full h-full object-cover",
              isActive ? "opacity-100" : "opacity-0",
              "scale-x-[-1]", // mirror for front camera
            )}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />

          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/80">
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
                "absolute top-3 left-3 px-3 py-1 rounded-full border font-display font-bold text-xs",
                pi.bg,
                pi.color,
              )}
            >
              {pi.label}
            </div>
          )}

          {/* Detector loading overlay */}
          {isActive && !detectorReady && !detectorError && (
            <div className="absolute bottom-3 left-3 right-3 bg-card/80 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body text-center">
              Loading pose detector...
            </div>
          )}
        </div>

        {/* Rep Counter */}
        <motion.div className="card-sporty p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
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
                initial={{ scale: 1.3, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, type: "spring" }}
                className="font-display font-black text-8xl text-neon-green leading-none mb-2"
                style={{ textShadow: "0 0 30px oklch(0.85 0.22 130 / 0.4)" }}
              >
                {count}
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-body">
              <span>Rep detected on up → down → up cycle</span>
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
              <li>
                • Position your phone/laptop in front of you so the camera can
                see your upper body and arms
              </li>
              <li>• Start in the "up" position (arms extended)</li>
              <li>• The AI counts reps when you go down and come back up</li>
              <li>• Good lighting helps improve detection accuracy</li>
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
