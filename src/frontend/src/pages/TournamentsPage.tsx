import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CreditCard,
  Crown,
  Lock,
  Medal,
  Star,
  Trophy,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import RewardedAdModal from "../components/RewardedAdModal";
import {
  DEMO_FREE_TOURNAMENTS,
  DEMO_PAID_TOURNAMENTS,
  type Tournament,
  useCreateCheckoutSession,
  useEnterTournament,
  useSubmitTournamentScore,
  useTournamentLeaderboard,
} from "../hooks/useQueries";

export default function TournamentsPage() {
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [pendingTournament, setPendingTournament] = useState<Tournament | null>(
    null,
  );
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(
    null,
  );
  const [submitCount, setSubmitCount] = useState("");
  const [joinedTournaments, setJoinedTournaments] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLeaderboard, setSelectedLeaderboard] =
    useState<Tournament | null>(null);

  const { mutateAsync: enterTournament } = useEnterTournament();
  const { mutateAsync: submitScore, isPending: isSubmitting } =
    useSubmitTournamentScore();
  const { mutateAsync: createCheckout, isPending: isCheckingOut } =
    useCreateCheckoutSession();
  const { data: leaderboard } = useTournamentLeaderboard(
    selectedLeaderboard?.id ?? null,
  );

  const handleFreeJoinRequest = (tournament: Tournament) => {
    setPendingTournament(tournament);
    setAdModalOpen(true);
  };

  const handleAdComplete = async () => {
    setAdModalOpen(false);
    if (!pendingTournament) return;
    try {
      await enterTournament(pendingTournament.id);
      setJoinedTournaments((prev) =>
        new Set(prev).add(pendingTournament.id.toString()),
      );
      toast.success(`🎉 You joined ${pendingTournament.name}!`);
    } catch {
      toast.error("Could not join tournament. Please try again.");
    }
    setPendingTournament(null);
  };

  const handlePaidJoin = async (tournament: Tournament) => {
    try {
      const sessionUrl = await createCheckout({
        items: [
          {
            productName: `KidFit Tournament: ${tournament.name}`,
            currency: "inr",
            quantity: BigInt(1),
            priceInCents: BigInt(5000),
            productDescription: "Tournament entry fee — prizes await!",
          },
        ],
        successUrl: `${window.location.origin}?tournament_success=${tournament.id}`,
        cancelUrl: window.location.href,
      });
      window.location.href = sessionUrl;
    } catch {
      toast.error("Payment setup failed. Please try again.");
    }
  };

  const handleSubmitScore = async () => {
    if (!activeTournament) return;
    const count = Number.parseInt(submitCount);
    if (!count || count <= 0) {
      toast.error("Enter a valid push-up count");
      return;
    }
    try {
      await submitScore({
        tournamentId: activeTournament.id,
        pushupCount: BigInt(count),
      });
      toast.success(`🏆 Score of ${count} push-ups submitted!`);
      setScoreModalOpen(false);
      setSubmitCount("");
    } catch {
      toast.error("Could not submit score. Please try again.");
    }
  };

  const getDaysLeft = (endDate: bigint) => {
    const ms = Number(endDate) / 1_000_000;
    const diff = ms - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const prizes = [
    { place: "1st", icon: "🥇", reward: "3 Months Ad-Free + XP Bonus" },
    { place: "2nd", icon: "🥈", reward: "2 Months Ad-Free" },
    { place: "3rd", icon: "🥉", reward: "1 Month Ad-Free" },
  ];

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black flex items-center gap-2">
          <Trophy className="w-6 h-6 text-neon-orange" />
          Tournaments
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          Compete. Win. Level up. 🏆
        </p>
      </header>

      <main className="flex-1 px-4">
        {/* Prize Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-sporty p-4 mb-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.16 0.04 265), oklch(0.18 0.06 60 / 0.3))",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-neon-orange" />
            <span className="font-display font-bold text-sm">Prizes</span>
          </div>
          <div className="space-y-1.5">
            {prizes.map((p) => (
              <div key={p.place} className="flex items-center gap-2 text-sm">
                <span className="text-base">{p.icon}</span>
                <span className="font-display font-bold text-xs w-6">
                  {p.place}
                </span>
                <span className="text-muted-foreground font-body text-xs">
                  {p.reward}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground font-body border-t border-border/30 pt-2">
            Free tournaments also award bonus XP to the winner!
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="free">
          <TabsList className="w-full bg-secondary mb-4">
            <TabsTrigger
              data-ocid="tournaments.free.tab"
              value="free"
              className="flex-1 font-body data-[state=active]:text-neon-green"
            >
              <Unlock className="w-3.5 h-3.5 mr-1" /> Free
            </TabsTrigger>
            <TabsTrigger
              data-ocid="tournaments.paid.tab"
              value="paid"
              className="flex-1 font-body data-[state=active]:text-neon-orange"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1" /> Paid (₹50)
            </TabsTrigger>
          </TabsList>

          {/* Free Tournaments */}
          <TabsContent value="free">
            <AnimatePresence>
              <div className="space-y-3">
                {DEMO_FREE_TOURNAMENTS.map((tournament, index) => {
                  const joined = joinedTournaments.has(
                    tournament.id.toString(),
                  );
                  const daysLeft = getDaysLeft(tournament.endDate);
                  return (
                    <motion.div
                      key={tournament.id.toString()}
                      data-ocid={`tournaments.free.item.${index + 1}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-sporty p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-display font-bold text-sm">
                              {tournament.name}
                            </h3>
                            <Badge
                              className="text-[10px] bg-chart-2/20 text-chart-2 border-chart-2/30 border"
                              variant="outline"
                            >
                              FREE
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-neon-green" />
                              XP Prize
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col gap-1.5">
                          {!joined ? (
                            <Button
                              data-ocid="tournaments.join.button"
                              size="sm"
                              onClick={() => handleFreeJoinRequest(tournament)}
                              className="bg-primary text-primary-foreground font-body font-semibold text-xs h-8"
                            >
                              <Zap className="w-3 h-3 mr-1" /> Join
                            </Button>
                          ) : (
                            <>
                              <Badge
                                className="bg-primary/20 text-neon-green border-primary/30 border text-xs"
                                variant="outline"
                              >
                                Joined ✓
                              </Badge>
                              <Button
                                data-ocid="tournaments.submit_score.button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setActiveTournament(tournament);
                                  setScoreModalOpen(true);
                                }}
                                className="border-border text-xs h-8 font-body"
                              >
                                <Medal className="w-3 h-3 mr-1" /> Submit Score
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Mini leaderboard preview */}
                      <button
                        type="button"
                        className="w-full text-left bg-muted/30 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body hover:bg-muted/50 transition-colors flex items-center gap-2"
                        onClick={() => {
                          setSelectedLeaderboard(
                            selectedLeaderboard?.id === tournament.id
                              ? null
                              : tournament,
                          );
                        }}
                      >
                        <Users className="w-3 h-3" />
                        {selectedLeaderboard?.id === tournament.id
                          ? "Hide leaderboard ▲"
                          : "View leaderboard ▼"}
                      </button>

                      {selectedLeaderboard?.id === tournament.id && (
                        <LeaderboardPreview leaderboard={leaderboard ?? []} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </TabsContent>

          {/* Paid Tournaments */}
          <TabsContent value="paid">
            <div className="space-y-3">
              {DEMO_PAID_TOURNAMENTS.map((tournament, index) => {
                const joined = joinedTournaments.has(tournament.id.toString());
                const daysLeft = getDaysLeft(tournament.endDate);
                return (
                  <motion.div
                    key={tournament.id.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-sporty p-4 space-y-3"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.16 0.04 265), oklch(0.18 0.08 60 / 0.2))",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-display font-bold text-sm">
                            {tournament.name}
                          </h3>
                          <Badge
                            className="text-[10px] bg-neon-orange/20 text-neon-orange border-neon-orange/30 border"
                            variant="outline"
                          >
                            ₹50
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Crown className="w-3 h-3 text-neon-orange" />3
                            months ad-free
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col gap-1.5">
                        {!joined ? (
                          <Button
                            data-ocid="tournaments.join.button"
                            size="sm"
                            onClick={() => handlePaidJoin(tournament)}
                            disabled={isCheckingOut}
                            className="bg-neon-orange/90 text-white font-body font-semibold text-xs h-8"
                            style={{ backgroundColor: "oklch(0.72 0.22 42)" }}
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            {isCheckingOut ? "Loading..." : "Pay & Join"}
                          </Button>
                        ) : (
                          <>
                            <Badge
                              className="bg-primary/20 text-neon-green border-primary/30 border text-xs"
                              variant="outline"
                            >
                              Joined ✓
                            </Badge>
                            <Button
                              data-ocid="tournaments.submit_score.button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveTournament(tournament);
                                setScoreModalOpen(true);
                              }}
                              className="border-border text-xs h-8 font-body"
                            >
                              <Medal className="w-3 h-3 mr-1" /> Submit Score
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Prize detail */}
                    <div className="grid grid-cols-3 gap-2">
                      {prizes.map((p) => (
                        <div
                          key={p.place}
                          className="bg-muted/30 rounded-xl p-2 text-center"
                        >
                          <div className="text-lg">{p.icon}</div>
                          <div className="text-[10px] text-muted-foreground font-body leading-tight">
                            {p.reward}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/20 rounded-xl px-3 py-2 text-xs text-muted-foreground font-body flex items-start gap-2">
                      <Lock className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>
                        Paid tournaments held every 2 months. Entry secures your
                        spot in the championship.
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Rewarded Ad Modal for free tournament entry */}
      <RewardedAdModal
        open={adModalOpen}
        onComplete={handleAdComplete}
        onCancel={() => {
          setAdModalOpen(false);
          setPendingTournament(null);
        }}
        title="Unlock Tournament"
        description="Watch a short ad to join this free tournament and compete for XP"
      />

      {/* Submit Score Modal */}
      <Dialog open={scoreModalOpen} onOpenChange={setScoreModalOpen}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Medal className="w-5 h-5 text-neon-orange" />
              Submit Your Score
            </DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              {activeTournament?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="submit-count"
                className="text-sm font-body text-muted-foreground mb-1 block"
              >
                Push-up count
              </label>
              <Input
                id="submit-count"
                type="number"
                placeholder="e.g. 42"
                value={submitCount}
                onChange={(e) => setSubmitCount(e.target.value)}
                className="bg-input border-border text-foreground h-12 text-lg font-display font-bold"
                min={1}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 font-body"
                onClick={() => setScoreModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="tournaments.submit_score.button"
                className="flex-1 bg-primary text-primary-foreground font-body font-semibold glow-green"
                onClick={handleSubmitScore}
                disabled={isSubmitting || !submitCount}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-1" /> Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LeaderboardPreview({ leaderboard }: { leaderboard: any[] }) {
  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-3 text-xs text-muted-foreground font-body">
        No scores yet — be the first! 🏆
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-1.5">
      {leaderboard.slice(0, 5).map((entry, idx) => (
        <div
          key={`${entry.userId?.toString()}-${idx}`}
          className="flex items-center gap-2 bg-muted/20 rounded-xl px-3 py-1.5 text-xs font-body"
        >
          <span className="text-base">{medals[idx] ?? `#${idx + 1}`}</span>
          <span className="flex-1 text-foreground truncate">
            {entry.userId?.toString().slice(0, 16)}...
          </span>
          <span className="text-neon-green font-bold">
            {entry.pushupCount?.toString()} reps
          </span>
        </div>
      ))}
    </div>
  );
}
