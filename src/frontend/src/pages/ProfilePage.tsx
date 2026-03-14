import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Calendar,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Tier, UserRole } from "../backend.d";
import RewardedAdModal from "../components/RewardedAdModal";
import TierBadge from "../components/TierBadge";
import { useActor } from "../hooks/useActor";
import { useAdUnlock } from "../hooks/useAdUnlock";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { usePushUpStats } from "../hooks/usePushUpStats";
import { useUserProfile, useUserRole } from "../hooks/useQueries";
import {
  TIERS,
  getTierFromXp,
  getTierInfo,
  getXpProgress,
  getXpToNextTier,
  levelFromXp,
} from "../lib/xp";
import { getSecretParameter } from "../utils/urlParams";

type Page =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin";

interface ProfilePageProps {
  onNavigate?: (page: Page) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { isUnlocked: profileUnlocked, unlock: unlockProfile } = useAdUnlock();
  const [adModalOpen, setAdModalOpen] = useState(false);
  const { data: profile, isLoading } = useUserProfile();
  const { clear, identity } = useInternetIdentity();
  const { data: roleData } = useUserRole();
  const { stats } = usePushUpStats();
  const isAdmin = roleData === UserRole.admin;
  const [claiming, setClaiming] = useState(false);
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const handleClaimAdmin = async () => {
    const token = getSecretParameter("caffeineAdminToken") || "";
    if (!token) {
      toast.error(
        "Admin token not found in URL. Open the app with the admin link.",
      );
      return;
    }
    if (!actor) {
      toast.error("Not connected yet, please wait.");
      return;
    }
    setClaiming(true);
    try {
      await actor.claimAdminRole(token);
      await queryClient.invalidateQueries({ queryKey: ["userRole"] });
      toast.success("You are now admin!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(
        msg.includes("Invalid")
          ? "Wrong admin token."
          : "Failed to claim admin.",
      );
    } finally {
      setClaiming(false);
    }
  };

  const handleViewProfile = () => {
    setAdModalOpen(true);
  };

  const handleAdComplete = () => {
    setAdModalOpen(false);
    unlockProfile();
  };

  const xp = profile ? Number(profile.xp) : 0;
  const level = levelFromXp(xp);
  const tier = profile?.tier ?? Tier.bronze;
  const xpTierInfo = getTierFromXp(xp);
  const xpProgress = getXpProgress(xp, xpTierInfo);
  const xpToNext = getXpToNextTier(xp, xpTierInfo);

  const now = BigInt(Date.now()) * BigInt(1_000_000);
  const isAdFree = profile?.adFreeUntil ? profile.adFreeUntil > now : false;
  const adFreeDate = profile?.adFreeUntil
    ? new Date(Number(profile.adFreeUntil) / 1_000_000).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : null;

  const TIERS_NEXT: Partial<Record<Tier, Tier>> = {
    [Tier.bronze]: Tier.silver,
    [Tier.silver]: Tier.gold,
    [Tier.gold]: Tier.platinum,
    [Tier.platinum]: Tier.diamond,
  };
  const nextTier = TIERS_NEXT[tier];
  const nextTierInfo = nextTier ? getTierInfo(nextTier) : null;

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black flex items-center gap-2">
            <Award className="w-6 h-6 text-chart-4" />
            Profile
          </h1>
          <p className="text-muted-foreground text-sm font-body">
            Your stats & achievements
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              data-ocid="profile.admin.button"
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.("admin")}
              className="border-chart-4/40 text-chart-4 hover:text-chart-4 font-body gap-1"
            >
              <Settings className="w-3 h-3" />
              Admin
            </Button>
          )}
          {!isAdmin && (
            <Button
              data-ocid="profile.claim_admin.button"
              variant="outline"
              size="sm"
              onClick={handleClaimAdmin}
              disabled={claiming}
              className="border-yellow-500/40 text-yellow-400 hover:text-yellow-300 font-body gap-1"
            >
              <Shield className="w-3 h-3" />
              {claiming ? "Claiming..." : "Claim Admin"}
            </Button>
          )}
          {identity && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clear()}
              className="border-border text-muted-foreground hover:text-foreground font-body gap-1"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4">
        <AnimatePresence mode="wait">
          {!profileUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Blurred preview */}
              <div className="card-sporty p-6 mb-4 relative overflow-hidden">
                <div className="filter blur-md pointer-events-none select-none">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/30 flex items-center justify-center text-3xl">
                      💪
                    </div>
                    <div>
                      <div className="font-display font-black text-2xl">
                        {isLoading
                          ? "Loading..."
                          : (profile?.username ?? "Athlete")}
                      </div>
                      <div className="text-muted-foreground text-sm font-body">
                        Fitness Warrior
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-primary/30 rounded mb-2" />
                  <div className="h-3 bg-muted/50 rounded w-3/4" />
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                  <EyeOff className="w-10 h-10 text-muted-foreground mb-3" />
                  <p className="font-display font-bold text-base mb-1">
                    Profile Locked
                  </p>
                  <p className="text-sm text-muted-foreground font-body text-center px-4">
                    Watch a short ad to view your stats
                  </p>
                </div>
              </div>

              <Button
                data-ocid="profile.view.button"
                onClick={handleViewProfile}
                className="w-full h-14 bg-primary text-primary-foreground font-display font-bold text-base glow-green"
              >
                <Eye className="w-5 h-5 mr-2" />
                Watch Ad to View Profile
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Profile Card */}
              <div className="card-sporty p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-3xl font-display">
                        {profile?.username?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <h2 className="font-display font-black text-2xl">
                          {profile?.username ?? "Athlete"}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <TierBadge tier={tier} size="sm" />
                          {isAdFree && (
                            <span className="text-xs bg-chart-2/20 text-chart-2 border border-chart-2/30 rounded-full px-2 py-0.5 font-body font-medium">
                              Ad-Free ✨
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Star
                            className="w-4 h-4 text-neon-green"
                            fill="currentColor"
                          />
                          <span className="font-display font-bold text-sm">
                            Level {level}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-body">
                          {xp.toLocaleString()} XP
                        </span>
                      </div>
                      <Progress value={xpProgress} className="h-3 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground font-body">
                        <span>{xpTierInfo.label} Tier</span>
                        {nextTierInfo ? (
                          <span>
                            {xpToNext} XP to {nextTierInfo.label}
                          </span>
                        ) : (
                          <span className="text-neon-green font-semibold">
                            Maximum Tier! 🏆
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid — 2x2 */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/30 rounded-xl p-3 text-center">
                        <div className="font-display font-black text-2xl text-neon-green">
                          {xp.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Total XP
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-3 text-center">
                        <div className="font-display font-black text-2xl text-neon-cyan">
                          {level}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Level
                        </div>
                      </div>
                      <div
                        data-ocid="profile.session_count.card"
                        className="bg-muted/30 rounded-xl p-3 text-center"
                      >
                        <div className="font-display font-black text-2xl text-primary">
                          {stats.sessionCount}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Sessions Done
                        </div>
                      </div>
                      <div
                        data-ocid="profile.total_pushups.card"
                        className="bg-muted/30 rounded-xl p-3 text-center"
                      >
                        <div className="font-display font-black text-2xl text-neon-cyan">
                          {stats.totalPushUps.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground font-body">
                          Total Push-Ups
                        </div>
                      </div>
                    </div>

                    {/* Badges Section */}
                    <div data-ocid="profile.badges.section">
                      <h3 className="font-display font-bold text-sm mb-2 flex items-center gap-1">
                        🏅 Badges Earned
                      </h3>
                      {stats.badges.length === 0 ? (
                        <p className="text-xs text-muted-foreground font-body italic">
                          Complete push-up sessions to earn badges!
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {stats.badges.map((badge) => (
                            <div
                              key={badge.id}
                              className="inline-flex flex-col items-center gap-0.5"
                              title={badge.description}
                            >
                              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 border border-primary/40 text-primary rounded-full px-2.5 py-1 font-body font-medium">
                                {badge.emoji} {badge.label}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-body text-center max-w-[80px] leading-tight">
                                {badge.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Ad-Free Status */}
              {isAdFree && adFreeDate && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-sporty p-4 flex items-center gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.16 0.04 265), oklch(0.18 0.08 160 / 0.3))",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-chart-2/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-sm text-chart-2">
                      Ad-Free Active!
                    </div>
                    <div className="text-xs text-muted-foreground font-body flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Expires {adFreeDate}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tier Progression */}
              <div className="card-sporty p-4">
                <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neon-green" />
                  Tier Progress
                </h3>
                <div className="space-y-2">
                  {TIERS.map((t) => {
                    const isCurrentTier = t.tier === tier;
                    const TIER_ORDER: Tier[] = [
                      Tier.bronze,
                      Tier.silver,
                      Tier.gold,
                      Tier.platinum,
                      Tier.diamond,
                    ];
                    const isAchieved =
                      TIER_ORDER.indexOf(t.tier) <= TIER_ORDER.indexOf(tier);
                    const tierProg = isCurrentTier
                      ? xpProgress
                      : isAchieved
                        ? 100
                        : 0;
                    return (
                      <div key={t.tier} className="flex items-center gap-3">
                        <span
                          className={`text-base ${isAchieved ? "opacity-100" : "opacity-30"}`}
                        >
                          {t.emoji}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-0.5">
                            <span
                              className={`font-display font-bold ${isCurrentTier ? "text-neon-green" : isAchieved ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {t.label}
                            </span>
                            <span className="text-muted-foreground font-body">
                              {t.minXp.toLocaleString()}+ XP
                            </span>
                          </div>
                          <Progress
                            value={tierProg}
                            className={`h-1.5 ${isCurrentTier ? "" : isAchieved ? "opacity-60" : "opacity-20"}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Principal */}
              {identity && (
                <div className="card-sporty p-3">
                  <div className="text-xs text-muted-foreground font-body truncate">
                    <span className="font-medium text-foreground">
                      Principal:{" "}
                    </span>
                    {identity.getPrincipal().toString()}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <RewardedAdModal
        open={adModalOpen}
        onComplete={handleAdComplete}
        onCancel={() => setAdModalOpen(false)}
        title="View Your Profile"
        description="Watch a short ad to unlock your full stats and progress"
      />
    </div>
  );
}
