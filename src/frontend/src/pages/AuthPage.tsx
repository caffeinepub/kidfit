import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useRegisterUser, useUserProfile } from "../hooks/useQueries";

export default function AuthPage() {
  const { login, loginStatus, isLoggingIn, identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { mutateAsync: registerUser, isPending: isRegistering } =
    useRegisterUser();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const needsUsername = !!identity && !profileLoading && !profile;

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
    } catch {
      setError("Could not register. Please try again.");
    }
  };

  if (profileLoading && identity) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-green" />
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
          <h1 className="font-display text-5xl font-black text-foreground tracking-tight mb-2">
            KID<span className="text-neon-green">FIT</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-xs">
            Level up your strength. No gym required.
          </p>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm rounded-2xl overflow-hidden mb-8 border border-border/50"
        >
          <img
            src="/assets/generated/kidfit-hero.dim_800x400.jpg"
            alt="Kids working out"
            className="w-full h-40 object-cover"
          />
        </motion.div>

        {/* Stats teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm mb-8"
        >
          {[
            { emoji: "🏆", label: "Tournaments", value: "Win Prizes" },
            { emoji: "⭐", label: "Earn XP", value: "Level Up" },
            { emoji: "📸", label: "Push-Ups", value: "AI Counter" },
          ].map((stat) => (
            <div key={stat.label} className="card-sporty text-center p-3">
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
