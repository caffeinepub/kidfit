import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterUser, useUserProfile } from "../hooks/useQueries";

function getErrText(err: unknown): string {
  if (err instanceof Error) return `${err.message} ${String(err)}`;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export default function AuthPage() {
  const { login, loginStatus, isLoggingIn, identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { mutateAsync: registerUser, isPending: isRegistering } =
    useRegisterUser();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isStillLoading =
    !!identity && (actorFetching || profileLoading) && !loadingTimedOut;

  useEffect(() => {
    if (isStillLoading) {
      timerRef.current = setTimeout(() => setLoadingTimedOut(true), 6000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setLoadingTimedOut(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStillLoading]);

  const actorReady = !!actor && !actorFetching;
  const needsUsername =
    !!identity &&
    (loadingTimedOut || (actorReady && !profileLoading && !profile));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Username must be 20 characters or less");
      return;
    }
    setError("");
    try {
      await registerUser(trimmed);
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["userProfile"] });
      }, 1500);
    } catch (err: unknown) {
      const msg = getErrText(err);
      if (msg.toLowerCase().includes("already registered")) {
        queryClient.refetchQueries({ queryKey: ["userProfile"] });
        return;
      }
      setError("Could not register. Please refresh and try again.");
    }
  };

  if (isStillLoading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-2xl font-black mb-4">
            TEEN<span className="text-neon-green">TUFF</span>LIFTS
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-neon-green mx-auto" />
          <p className="text-muted-foreground mt-2 font-body text-sm">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <div className="text-6xl mb-2">💪</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-pulse-glow" />
          </div>
          <h1 className="font-display text-4xl font-black text-foreground tracking-tight mb-2">
            TEEN<span className="text-neon-green">TUFF</span>LIFTS
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-xs">
            Get strong anywhere. No gym, no excuses.
          </p>
        </motion.div>

        {/* Stats teaser - polished pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8"
        >
          {[
            {
              emoji: "🏆",
              label: "Tournaments",
              value: "Win Prizes",
              glow: "shadow-[0_0_14px_oklch(0.72_0.22_42/0.3)]",
            },
            {
              emoji: "⭐",
              label: "Earn XP",
              value: "Level Up",
              glow: "shadow-[0_0_14px_oklch(0.85_0.22_130/0.3)]",
            },
            {
              emoji: "📸",
              label: "Push-Ups",
              value: "AI Counter",
              glow: "shadow-[0_0_14px_oklch(0.75_0.18_195/0.3)]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl text-center p-3 border border-border/60 bg-card/80 backdrop-blur-sm ${stat.glow}`}
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.18 0.03 265), oklch(0.16 0.025 265))",
              }}
            >
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="font-display text-xs font-bold text-neon-green">
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {!identity ? (
            <div className="card-sporty p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-neon-cyan w-5 h-5" />
                <h2 className="font-display text-lg font-bold">Get Started</h2>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                Secure login powered by Internet Identity — no password needed.
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full bg-primary text-primary-foreground font-display font-bold text-base h-12 glow-green"
                data-ocid="auth.submit_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" /> Login / Sign Up
                  </>
                )}
              </Button>
              {loginStatus === "loginError" && (
                <p className="text-destructive text-sm text-center font-body">
                  Login failed. Please try again.
                </p>
              )}
            </div>
          ) : needsUsername ? (
            <div className="card-sporty p-6 space-y-4">
              <div className="text-center mb-2">
                <div className="text-4xl mb-2">🎮</div>
                <h2 className="font-display text-xl font-bold">
                  Choose Your Name
                </h2>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Pick a username to start your journey
                </p>
              </div>
              <form onSubmit={handleRegister} className="space-y-3">
                <Input
                  data-ocid="auth.username.input"
                  placeholder="e.g. IronKid99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 text-base font-body"
                  maxLength={20}
                  autoFocus
                />
                {error && (
                  <p className="text-destructive text-sm font-body">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={isRegistering || !username.trim()}
                  className="w-full bg-primary text-primary-foreground font-display font-bold text-base h-12 glow-green"
                  data-ocid="auth.submit_button"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" /> Start Training!
                    </>
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="card-sporty p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-neon-green mx-auto" />
              <p className="text-muted-foreground mt-2 font-body">
                Loading your profile...
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 px-6">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-green hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
