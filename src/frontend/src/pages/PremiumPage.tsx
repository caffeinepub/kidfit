import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  Crown,
  Loader2,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { backendInterface } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useCreateCheckoutSession } from "../hooks/useQueries";

interface PremiumPageProps {
  onBack: () => void;
}

const PERKS = [
  { emoji: "🥗", text: "Both Veg & Non-Veg diet plans" },
  { emoji: "⚡", text: "20% more XP on all activities" },
  { emoji: "🪙", text: "20% more coins per workout" },
  { emoji: "🚫", text: "No ads for 30 days" },
  { emoji: "💪", text: "Advanced HIIT & Gym splits", soon: true },
];

export default function PremiumPage({ onBack }: PremiumPageProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const createCheckout = useCreateCheckoutSession();

  const { data: isPremium } = useQuery<boolean>({
    queryKey: ["isPremium"],
    queryFn: async () => {
      if (!actor) return false;
      return (actor as unknown as backendInterface).isPremiumActive();
    },
    enabled: !!actor,
  });

  const { data: premiumUntil } = useQuery<bigint>({
    queryKey: ["premiumUntil"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return (actor as unknown as backendInterface).getPremiumUntil();
    },
    enabled: !!actor && !!isPremium,
  });

  const activateMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as backendInterface).activatePremium();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isPremium"] });
      queryClient.invalidateQueries({ queryKey: ["premiumUntil"] });
      toast.success("Premium activated! 🎉");
    },
    onError: () => toast.error("Failed to activate premium"),
  });

  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  // Handle return from Stripe
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium_success")) {
      window.history.replaceState({}, "", window.location.pathname);
      activateMutation.mutate();
    }
  }, []);

  const handleGetPremium = async () => {
    setIsStartingCheckout(true);
    try {
      const currentUrl = window.location.href.split("?")[0];
      const successUrl = `${currentUrl}?premium_success=true`;
      const cancelUrl = currentUrl;
      const url = await createCheckout.mutateAsync({
        items: [
          {
            productName: "TeenTuffLifts Premium",
            productDescription: "1 month premium subscription",
            quantity: BigInt(1),
            priceInCents: BigInt(37500),
            currency: "inr",
          },
        ],
        successUrl,
        cancelUrl,
      });
      window.location.href = url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
      setIsStartingCheckout(false);
    }
  };

  const premiumExpiry = premiumUntil
    ? new Date(Number(premiumUntil) / 1_000_000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="flex flex-col min-h-screen pb-24"
      style={{ background: "#1F1F1F" }}
    >
      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="premium.back_button"
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-display text-xl font-black text-white flex items-center gap-2">
          <Crown className="w-5 h-5" style={{ color: "#D4AF37" }} />
          Premium
        </h1>
      </header>

      <div className="px-4 space-y-5">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, #1a1200 0%, #2a1f00 50%, #1a1200 100%)",
            border: "1px solid rgba(212,175,55,0.4)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.15) 0%, transparent 60%)",
            }}
          />
          <div className="relative p-6 text-center">
            <div className="text-5xl mb-3">👑</div>
            <h2
              className="font-display font-black text-3xl mb-1"
              style={{ color: "#D4AF37" }}
            >
              PREMIUM
            </h2>
            <p className="text-white/60 font-body text-sm mb-4">
              Unlock your full potential
            </p>
            <div className="font-display font-black text-4xl text-white">
              ₹375
              <span className="text-base font-body font-normal text-white/50 ml-1">
                /month
              </span>
            </div>
          </div>
        </motion.div>

        {/* Active Premium Badge */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.4)",
            }}
            data-ocid="premium.active.success_state"
          >
            <CheckCircle
              className="w-6 h-6 flex-shrink-0"
              style={{ color: "#D4AF37" }}
            />
            <div>
              <div
                className="font-display font-bold text-sm"
                style={{ color: "#D4AF37" }}
              >
                Premium Active! ✨
              </div>
              {premiumExpiry && (
                <div className="text-xs text-white/50 font-body">
                  Expires {premiumExpiry}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Perks */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h3 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color: "#D4AF37" }} />
            What You Get
          </h3>
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3"
              data-ocid={`premium.perk.item.${i + 1}` as string}
            >
              <span className="text-xl">{perk.emoji}</span>
              <span className="font-body text-sm text-white flex-1">
                {perk.text}
              </span>
              {perk.soon && (
                <span
                  className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(212,175,55,0.2)",
                    color: "#D4AF37",
                  }}
                >
                  Soon
                </span>
              )}
              <CheckCircle
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "#22c55e" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Boost callout */}
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-300 font-body">
            <strong>+20% XP & Coins</strong> on every workout — the fastest way
            to dominate the leaderboard.
          </p>
        </div>

        {/* CTA */}
        {!isPremium && (
          <Button
            data-ocid="premium.get_premium.primary_button"
            onClick={handleGetPremium}
            disabled={isStartingCheckout || createCheckout.isPending}
            className="w-full h-16 text-lg font-display font-black rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F0D060)",
              color: "#1F1F1F",
            }}
          >
            {isStartingCheckout || createCheckout.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Starting
                checkout...
              </>
            ) : (
              <>👑 Get Premium — ₹375/month</>
            )}
          </Button>
        )}

        {/* Stripe note */}
        <p className="text-center text-xs text-white/30 font-body pb-2">
          Secure payment via Stripe. Cancel anytime.
        </p>

        <p className="text-center text-xs text-white/20 font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
