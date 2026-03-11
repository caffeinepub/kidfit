import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, Star, Target, Trophy, User } from "lucide-react";
import { motion } from "motion/react";
import { Tier } from "../backend.d";
import DailyMissionCard from "../components/DailyMissionCard";
import TierBadge from "../components/TierBadge";
import { useUserProfile } from "../hooks/useQueries";
import {
  getTierFromXp,
  getTierInfo,
  getXpProgress,
  getXpToNextTier,
} from "../lib/xp";

type Page =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const TIER_ORDER: Tier[] = [
  Tier.bronze,
  Tier.silver,
  Tier.gold,
  Tier.platinum,
  Tier.diamond,
];
const TIERS_NEXT: Partial<Record<Tier, Tier>> = {
  [Tier.bronze]: Tier.silver,
  [Tier.silver]: Tier.gold,
  [Tier.gold]: Tier.platinum,
  [Tier.platinum]: Tier.diamond,
};

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: profile, isLoading } = useUserProfile();

  const xp = profile ? Number(profile.xp) : 0;
  const level = profile ? Number(profile.level) : 1;
  const tier = profile?.tier ?? Tier.bronze;
  const xpTierInfo = getTierFromXp(xp);
  const xpProgress = getXpProgress(xp, xpTierInfo);
  const xpToNext = getXpToNextTier(xp, xpTierInfo);
  const nextTier = TIERS_NEXT[tier];
  const nextTierInfo = nextTier ? getTierInfo(nextTier) : null;

  const quickActions = [
    {
      id: "exercises" as Page,
      label: "Exercises",
      description: "View workout library",
      icon: Dumbbell,
      color: "text-neon-green",
      bg: "bg-primary/10 border-primary/20",
      ocid: "dashboard.exercises.button",
    },
    {
      id: "pushups" as Page,
      label: "Push-Up Counter",
      description: "AI-powered rep counter",
      icon: Target,
      color: "text-neon-cyan",
      bg: "bg-accent/10 border-accent/20",
      ocid: "dashboard.pushups.button",
    },
    {
      id: "tournaments" as Page,
      label: "Tournaments",
      description: "Compete & win prizes",
      icon: Trophy,
      color: "text-neon-orange",
      bg: "bg-chart-3/10 border-chart-3/20",
      ocid: "dashboard.tournaments.button",
    },
    {
      id: "profile" as Page,
      label: "My Profile",
      description: "Stats & achievements",
      icon: User,
      color: "text-chart-4",
      bg: "bg-chart-4/10 border-chart-4/20",
      ocid: "dashboard.profile.button",
    },
  ];

  const tierEmojis: Record<Tier, string> = {
    [Tier.bronze]: "🥉",
    [Tier.silver]: "🥈",
    [Tier.gold]: "🥇",
    [Tier.platinum]: "💎",
    [Tier.diamond]: "💠",
  };

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-muted-foreground text-sm font-body">
              Welcome back,
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <h1 className="font-display text-3xl font-black text-foreground">
                {profile?.username ?? "Athlete"}{" "}
                <span className="text-neon-green">👋</span>
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Skeleton className="w-16 h-8 rounded-full" />
            ) : (
              <TierBadge tier={tier} size="sm" />
            )}
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-4 space-y-4">
        {/* XP Card - gradient variant */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-2xl p-5 border border-primary/25"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.04 265) 0%, oklch(0.2 0.07 150 / 0.6) 100%)",
            boxShadow:
              "0 0 30px oklch(0.85 0.22 130 / 0.12), inset 0 1px 0 oklch(0.85 0.22 130 / 0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-neon-green" fill="currentColor" />
              <span className="font-display font-bold text-lg">
                Level {isLoading ? "—" : level}
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="w-24 h-6 rounded-full" />
            ) : (
              <TierBadge tier={tier} size="sm" />
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-3 w-full mb-2" />
          ) : (
            <>
              <Progress value={xpProgress} className="h-3 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground font-body">
                <span>{xp.toLocaleString()} XP</span>
                {nextTierInfo ? (
                  <span>
                    {xpToNext} XP to {nextTierInfo.label}
                  </span>
                ) : (
                  <span className="text-neon-green font-semibold">
                    MAX TIER! 🏆
                  </span>
                )}
              </div>
            </>
          )}

          {/* Tier progress dots */}
          <div className="mt-4 flex justify-between items-center">
            {TIER_ORDER.map((tTier) => {
              const isCurrentTier = tTier === tier;
              const isAchieved =
                TIER_ORDER.indexOf(tTier) <= TIER_ORDER.indexOf(tier);
              return (
                <div key={tTier} className="flex flex-col items-center gap-0.5">
                  <div
                    className={`text-lg transition-all duration-300 ${
                      isCurrentTier
                        ? "scale-125 drop-shadow-[0_0_8px_currentColor]"
                        : ""
                    } ${isAchieved ? "opacity-100" : "opacity-30"}`}
                  >
                    {tierEmojis[tTier]}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="font-display font-bold text-base text-muted-foreground mb-3 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
                >
                  <Button
                    data-ocid={action.ocid}
                    variant="outline"
                    onClick={() => onNavigate(action.id)}
                    className={`w-full h-auto flex flex-col items-start gap-2 p-4 border ${action.bg} hover:scale-[1.02] transition-all duration-200`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-background/50 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-display font-bold text-sm text-foreground">
                        {action.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-body">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Daily Mission */}
        <DailyMissionCard username={profile?.username ?? "athlete"} />

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="card-sporty p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.04 265), oklch(0.2 0.06 150 / 0.5))",
          }}
        >
          <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden rounded-bl-2xl opacity-60 flex items-center justify-center text-5xl">
            💪
          </div>
          <h3 className="font-display font-black text-xl text-neon-green mb-1">
            Keep Grinding!
          </h3>
          <p className="text-muted-foreground text-sm font-body pr-20">
            Every rep counts. Bags, bottles, backpacks — anything heavy makes
            you stronger. You don't need a gym.
          </p>
          <div className="mt-3">
            <Button
              onClick={() => onNavigate("exercises")}
              size="sm"
              className="bg-primary text-primary-foreground font-body font-semibold"
            >
              Start Workout →
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
