import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Play, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRecordAdView } from "../hooks/useQueries";

interface RewardedAdModalProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export default function RewardedAdModal({
  open,
  onComplete,
  onCancel,
  title = "Watch Ad to Continue",
  description = "Watch a short ad to unlock this feature",
}: RewardedAdModalProps) {
  const [phase, setPhase] = useState<"intro" | "watching" | "done">("intro");
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);
  const { mutateAsync: recordAdView } = useRecordAdView();

  const startAd = useCallback(() => {
    setPhase("watching");
    setCountdown(5);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!open) {
      setPhase("intro");
      setCountdown(5);
      setProgress(0);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== "watching") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        setProgress(((5 - next) / 5) * 100);
        if (next <= 0) {
          clearInterval(interval);
          setPhase("done");
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const handleComplete = async () => {
    try {
      await recordAdView();
    } catch {
      // best effort
    }
    onComplete();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel();
      }}
    >
      <DialogContent
        data-ocid="rewarded_ad.modal"
        className="max-w-sm border-border bg-card"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Zap className="text-neon-green w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {phase === "intro" && (
          <div className="space-y-4">
            <div
              className="w-full h-32 rounded-xl overflow-hidden relative flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.25 0.08 265), oklch(0.18 0.04 265))",
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 border border-primary/30">
                  <Play
                    className="w-8 h-8 text-neon-green"
                    fill="currentColor"
                  />
                </div>
                <p className="text-sm text-muted-foreground font-body">
                  5-second ad
                </p>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground font-body">
              Watch a quick 5-second ad to continue
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 font-body"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground font-body font-semibold glow-green"
                onClick={startAd}
              >
                <Play className="w-4 h-4 mr-1" /> Watch Ad
              </Button>
            </div>
          </div>
        )}

        {phase === "watching" && (
          <div className="space-y-4">
            {/* Fake ad content */}
            <div
              className="w-full h-36 rounded-xl overflow-hidden relative"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed, #2563eb, #059669)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-white font-display text-2xl font-bold mb-1">
                  TEENTUFF PRO
                </div>
                <div className="text-white/80 text-sm font-body">
                  Level up your workout!
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded font-body">
                Ad — {countdown}s
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground font-body">
              Ad playing... {countdown}s remaining
            </p>
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-4">
            <div className="w-full h-32 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">✅</div>
                <p className="text-neon-green font-display font-bold text-lg">
                  Ad Complete!
                </p>
              </div>
            </div>
            <Button
              data-ocid="rewarded_ad.continue.button"
              className="w-full bg-primary text-primary-foreground font-body font-semibold glow-green"
              onClick={handleComplete}
            >
              <Zap className="w-4 h-4 mr-1" />
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
