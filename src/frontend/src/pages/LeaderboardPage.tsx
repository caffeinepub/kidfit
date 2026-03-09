import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Medal, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { LeaderboardEntry } from "../backend.d";
import type { Tier } from "../backend.d";
import TierBadge from "../components/TierBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLeaderboard, useUserProfile } from "../hooks/useQueries";

const rankMeta = [
  {
    medal: "🥇",
    bg: "from-yellow-900/40 to-yellow-800/20",
    border: "border-yellow-500/50",
    glow: "shadow-[0_0_20px_oklch(0.78_0.2_82/0.35)]",
    label: "Champion",
    rankColor: "text-yellow-400",
  },
  {
    medal: "🥈",
    bg: "from-slate-700/40 to-slate-600/20",
    border: "border-slate-400/50",
    glow: "shadow-[0_0_14px_oklch(0.7_0.01_265/0.3)]",
    label: "Runner-up",
    rankColor: "text-slate-300",
  },
  {
    medal: "🥉",
    bg: "from-amber-900/30 to-amber-800/10",
    border: "border-amber-600/40",
    glow: "shadow-[0_0_12px_oklch(0.62_0.14_55/0.3)]",
    label: "3rd Place",
    rankColor: "text-amber-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 22 },
  },
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/50">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <Skeleton className="w-24 h-4" />
      <div className="ml-auto flex items-center gap-2">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-12 h-4" />
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { data: entries = [], isLoading } = useLeaderboard();

  const currentPrincipal = identity?.getPrincipal().toString();

  const myRankIndex = entries.findIndex(
    (e) => e.user.toString() === currentPrincipal,
  );
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null;

  return (
    <div
      className="min-h-screen gradient-mesh pb-36"
      data-ocid="leaderboard.page"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-foreground tracking-tight">
                LEADERBOARD
              </h1>
              <p className="text-xs text-muted-foreground font-body">
                Global rankings by XP
              </p>
            </div>
          </div>

          {/* Current user rank pill */}
          {myRank !== null && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-1.5 bg-neon-green/10 border border-neon-green/40 rounded-full px-3 py-1"
            >
              <Zap className="w-3.5 h-3.5 text-neon-green" />
              <span className="text-xs font-display font-bold text-neon-green">
                #{myRank}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {/* Your rank card (if logged in and on leaderboard) */}
        {profile && myRank !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-sporty p-3 border-neon-green/40 glow-green"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-body text-muted-foreground">
                Your Rank
              </span>
              <span className="ml-auto font-display font-black text-neon-green text-lg">
                #{myRank}
              </span>
              <span className="text-xs text-muted-foreground font-body">
                of {entries.length}
              </span>
            </div>
          </motion.div>
        )}

        {/* Top 3 podium */}
        {!isLoading && entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 mb-1">
            {/* 2nd place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              data-ocid="leaderboard.item.2"
              className={`flex flex-col items-center p-3 rounded-2xl border bg-gradient-to-b ${rankMeta[1].bg} ${rankMeta[1].border} ${entries[1].user.toString() === currentPrincipal ? "ring-2 ring-neon-green" : ""}`}
            >
              <span className="text-2xl">{rankMeta[1].medal}</span>
              <span className="font-display font-bold text-xs text-center mt-1 truncate w-full text-center leading-tight">
                {entries[1].username}
              </span>
              <TierBadge
                tier={entries[1].tier as Tier}
                size="sm"
                showLabel={false}
                className="mt-1"
              />
              <span className="text-[10px] text-muted-foreground font-body mt-1">
                {Number(entries[1].xp).toLocaleString()} XP
              </span>
            </motion.div>

            {/* 1st place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              data-ocid="leaderboard.item.1"
              className={`flex flex-col items-center p-3 rounded-2xl border bg-gradient-to-b ${rankMeta[0].bg} ${rankMeta[0].border} ${rankMeta[0].glow} -mt-4 ${entries[0].user.toString() === currentPrincipal ? "ring-2 ring-neon-green" : ""}`}
            >
              <span className="text-3xl">{rankMeta[0].medal}</span>
              <span className="font-display font-bold text-sm text-center mt-1 truncate w-full text-center leading-tight text-yellow-200">
                {entries[0].username}
              </span>
              <TierBadge
                tier={entries[0].tier as Tier}
                size="sm"
                showLabel={false}
                className="mt-1"
              />
              <span className="text-xs text-yellow-400 font-body mt-1 font-semibold">
                {Number(entries[0].xp).toLocaleString()} XP
              </span>
            </motion.div>

            {/* 3rd place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-ocid="leaderboard.item.3"
              className={`flex flex-col items-center p-3 rounded-2xl border bg-gradient-to-b ${rankMeta[2].bg} ${rankMeta[2].border} ${entries[2].user.toString() === currentPrincipal ? "ring-2 ring-neon-green" : ""}`}
            >
              <span className="text-2xl">{rankMeta[2].medal}</span>
              <span className="font-display font-bold text-xs text-center mt-1 truncate w-full text-center leading-tight">
                {entries[2].username}
              </span>
              <TierBadge
                tier={entries[2].tier as Tier}
                size="sm"
                showLabel={false}
                className="mt-1"
              />
              <span className="text-[10px] text-muted-foreground font-body mt-1">
                {Number(entries[2].xp).toLocaleString()} XP
              </span>
            </motion.div>
          </div>
        )}

        {/* Full ranked list */}
        {isLoading ? (
          <div className="space-y-2" data-ocid="leaderboard.loading_state">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"].map(
              (k) => (
                <SkeletonRow key={k} />
              ),
            )}
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-sporty p-10 text-center"
            data-ocid="leaderboard.empty_state"
          >
            <div className="text-5xl mb-4">🏆</div>
            <p className="font-display font-bold text-lg text-foreground mb-1">
              No Athletes Yet
            </p>
            <p className="text-sm text-muted-foreground font-body">
              Be the first! Complete a workout to claim the #1 spot.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
            data-ocid="leaderboard.list"
          >
            {entries.map((entry: LeaderboardEntry, idx: number) => {
              const isCurrentUser = entry.user.toString() === currentPrincipal;
              const rank = idx + 1;
              const isTop3 = rank <= 3;

              if (isTop3) return null; // top 3 shown in podium above

              return (
                <motion.div
                  key={entry.user.toString()}
                  variants={itemVariants}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCurrentUser
                      ? "border-neon-green/60 bg-neon-green/5 shadow-[0_0_12px_oklch(0.85_0.22_130/0.2)]"
                      : "border-border/50 bg-card/60 hover:bg-card"
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black flex-shrink-0 ${
                      isCurrentUser
                        ? "bg-neon-green text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {rank}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-display font-bold text-sm truncate ${
                          isCurrentUser ? "text-neon-green" : "text-foreground"
                        }`}
                      >
                        {entry.username}
                      </span>
                      {isCurrentUser && (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-neon-green/50 text-neon-green leading-none h-4"
                        >
                          YOU
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Medal className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-body">
                        Lv.{Number(entry.level)}
                      </span>
                    </div>
                  </div>

                  {/* Tier + XP */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <TierBadge
                      tier={entry.tier as Tier}
                      size="sm"
                      showLabel={false}
                    />
                    <div className="text-right">
                      <div
                        className={`text-xs font-display font-bold ${isCurrentUser ? "text-neon-green" : "text-foreground"}`}
                      >
                        {Number(entry.xp).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-body">
                        XP
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
