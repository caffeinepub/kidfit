import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Instagram, MessageCircle, Share2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareResultModalProps {
  open: boolean;
  onClose: () => void;
  repCount: number;
  xpEarned: number;
  username: string;
  tier: string;
}

export default function ShareResultModal({
  open,
  onClose,
  repCount,
  xpEarned,
  username,
  tier,
}: ShareResultModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just crushed ${repCount} push-ups on KidFit and earned ${xpEarned} XP! 💪 Tier: ${tier} - Can you beat me? #KidFit #FitnessKids`;

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
    );
  };

  const handleInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "KidFit Result" });
      } catch {
        // User cancelled or not supported
        await copyToClipboard();
        toast.info(
          "Text copied! Open Instagram Stories and paste your result 📸",
        );
      }
    } else {
      await copyToClipboard();
      toast.info(
        "Text copied! Open Instagram Stories and paste your result 📸",
        { duration: 5000 },
      );
    }
  };

  const handleSnapchat = () => {
    const snapUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareText)}`;
    const snapWindow = window.open(snapUrl, "_blank");
    if (!snapWindow) {
      copyToClipboard();
      toast.info("Text copied! Open Snapchat and paste your result 👻");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Result copied to clipboard!");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const tierCapitalized = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="share.modal"
        className="bg-card border-border max-w-sm p-0 overflow-hidden"
      >
        <DialogHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display font-black text-xl flex items-center gap-2">
              <Share2 className="w-5 h-5 text-neon-green" />
              Share Your Result
            </DialogTitle>
            <Button
              data-ocid="share.close.button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-5 pt-4 pb-5 space-y-4">
          {/* Result Card Preview */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.12 0.03 265), oklch(0.18 0.08 130 / 0.4))",
              border: "1px solid oklch(0.85 0.22 130 / 0.3)",
            }}
          >
            <div className="absolute top-0 right-0 text-6xl opacity-10 select-none pointer-events-none translate-x-1 -translate-y-1">
              💪
            </div>
            <div className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">
              KidFit Result
            </div>
            <div
              className="font-display font-black text-4xl text-neon-green leading-none mb-1"
              style={{ textShadow: "0 0 20px oklch(0.85 0.22 130 / 0.4)" }}
            >
              {repCount}
            </div>
            <div className="text-sm font-body text-muted-foreground mb-3">
              Push-Ups Crushed
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-body text-muted-foreground">
                  by
                </span>
                <span className="font-display font-bold text-sm text-foreground">
                  {username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/20 text-neon-green border border-primary/30 rounded-full px-2 py-0.5 font-body font-medium">
                  +{xpEarned} XP
                </span>
                <span className="text-xs bg-chart-4/20 text-chart-4 border border-chart-4/30 rounded-full px-2 py-0.5 font-body font-medium">
                  {tierCapitalized}
                </span>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground font-body text-center uppercase tracking-wider">
              Share to
            </p>

            {/* WhatsApp */}
            <Button
              data-ocid="share.whatsapp.button"
              onClick={handleWhatsApp}
              className="w-full h-11 font-display font-bold text-sm justify-start gap-3"
              style={{
                background: "oklch(0.45 0.18 145 / 0.2)",
                border: "1px solid oklch(0.55 0.18 145 / 0.4)",
                color: "oklch(0.75 0.2 145)",
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Share on WhatsApp
            </Button>

            {/* Instagram */}
            <Button
              data-ocid="share.instagram.button"
              onClick={handleInstagram}
              className="w-full h-11 font-display font-bold text-sm justify-start gap-3"
              style={{
                background: "oklch(0.45 0.2 340 / 0.2)",
                border: "1px solid oklch(0.6 0.22 340 / 0.4)",
                color: "oklch(0.75 0.2 340)",
              }}
            >
              <Instagram className="w-5 h-5" />
              Share to Instagram
            </Button>

            {/* Snapchat */}
            <Button
              data-ocid="share.snapchat.button"
              onClick={handleSnapchat}
              className="w-full h-11 font-display font-bold text-sm justify-start gap-3"
              style={{
                background: "oklch(0.7 0.22 90 / 0.15)",
                border: "1px solid oklch(0.75 0.22 90 / 0.4)",
                color: "oklch(0.85 0.2 90)",
              }}
            >
              <span className="text-lg leading-none">👻</span>
              Share to Snapchat
            </Button>

            {/* Copy */}
            <Button
              data-ocid="share.copy.button"
              onClick={copyToClipboard}
              variant="outline"
              className="w-full h-11 font-display font-bold text-sm justify-start gap-3 border-border"
            >
              {copied ? (
                <Check className="w-5 h-5 text-neon-green" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              {copied ? "Copied!" : "Copy Result Text"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
