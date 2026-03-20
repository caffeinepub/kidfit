import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Principal } from "@icp-sdk/core/principal";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Search, UserCheck, UserPlus, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend.d";
import TierBadge from "../components/TierBadge";
import { useActor } from "../hooks/useActor";
import { useMyFriendRequests, useMyFriends } from "../hooks/useQueries";
import { getTierFromXp } from "../lib/xp";

function truncatePrincipal(p: string): string {
  if (p.length <= 14) return p;
  return `${p.slice(0, 7)}...${p.slice(-5)}`;
}

function FriendCard({
  principal,
  label,
}: { principal: Principal; label?: string }) {
  const p = principal.toString();
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/60"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-base flex-shrink-0"
        style={{
          background: "oklch(0.82 0.17 90 / 0.15)",
          border: "1px solid oklch(0.82 0.17 90 / 0.35)",
          color: "oklch(0.82 0.17 90)",
        }}
      >
        {p[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm text-foreground truncate">
          {truncatePrincipal(p)}
        </div>
        {label && (
          <div className="text-[10px] text-muted-foreground font-body">
            {label}
          </div>
        )}
      </div>
      <UserCheck
        className="w-4 h-4 flex-shrink-0"
        style={{ color: "oklch(0.82 0.17 90)" }}
      />
    </motion.div>
  );
}

export default function FriendsPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: friends = [], isLoading: friendsLoading } = useMyFriends();
  const { data: requests = [], isLoading: requestsLoading } =
    useMyFriendRequests();

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<
    UserProfile | null | "not_found"
  >(null);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null,
  );

  const handleSearch = async () => {
    if (!searchQuery.trim() || !actor) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const result = await (
        actor as unknown as {
          searchUserByUsername(u: string): Promise<UserProfile | null>;
        }
      ).searchUserByUsername(searchQuery.trim());
      setSearchResult(result ?? "not_found");
    } catch (_err) {
      toast.error("Search failed. Try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (principalStr: string) => {
    if (!actor) return;
    setSendingTo(principalStr);
    try {
      const res = await (
        actor as unknown as {
          sendFriendRequest(to: { toString(): string }): Promise<
            { ok: null } | { err: string }
          >;
        }
      ).sendFriendRequest({ toString: () => principalStr } as Principal);
      if ("err" in res) throw new Error(res.err);
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        msg.includes("already")
          ? "Already friends or request pending"
          : "Could not send request",
      );
    } finally {
      setSendingTo(null);
    }
  };

  const handleAccept = async (from: Principal) => {
    if (!actor) return;
    const key = from.toString();
    setProcessingRequest(key);
    try {
      const res = await (
        actor as unknown as {
          acceptFriendRequest(
            from: Principal,
          ): Promise<{ ok: null } | { err: string }>;
        }
      ).acceptFriendRequest(from);
      if ("err" in res) throw new Error(res.err);
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["myFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myFriends"] });
      queryClient.invalidateQueries({ queryKey: ["friendsLeaderboard"] });
    } catch {
      toast.error("Could not accept request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDecline = async (from: Principal) => {
    if (!actor) return;
    const key = from.toString();
    setProcessingRequest(key);
    try {
      const res = await (
        actor as unknown as {
          declineFriendRequest(
            from: Principal,
          ): Promise<{ ok: null } | { err: string }>;
        }
      ).declineFriendRequest(from);
      if ("err" in res) throw new Error(res.err);
      toast.success("Request declined");
      queryClient.invalidateQueries({ queryKey: ["myFriendRequests"] });
    } catch {
      toast.error("Could not decline request");
    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh pb-36" data-ocid="friends.page">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "oklch(0.82 0.17 90 / 0.1)",
              border: "1px solid oklch(0.82 0.17 90 / 0.3)",
            }}
          >
            <Users
              className="w-5 h-5"
              style={{ color: "oklch(0.82 0.17 90)" }}
            />
          </div>
          <div>
            <h1 className="font-display text-xl font-black text-foreground tracking-tight">
              Friends
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Search, connect & compete
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* Search Section */}
        <section>
          <h2
            className="font-display font-bold text-sm mb-3 uppercase tracking-wider"
            style={{ color: "oklch(0.82 0.17 90)" }}
          >
            Find a Friend
          </h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="friends.search_input"
                placeholder="Search by username…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchResult(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9 font-body bg-card/80 border-border/60 focus:border-[oklch(0.82_0.17_90/0.6)]"
              />
            </div>
            <Button
              data-ocid="friends.search.button"
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              style={{
                background: "oklch(0.82 0.17 90 / 0.15)",
                border: "1px solid oklch(0.82 0.17 90 / 0.4)",
                color: "oklch(0.82 0.17 90)",
              }}
              className="font-display font-bold shrink-0"
            >
              {searching ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Search Result */}
          <AnimatePresence mode="wait">
            {searchResult !== null && (
              <motion.div
                key={
                  searchResult === "not_found"
                    ? "nf"
                    : (searchResult as UserProfile).id.toString()
                }
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3"
              >
                {searchResult === "not_found" ? (
                  <div className="card-sporty p-4 text-center">
                    <p className="text-muted-foreground font-body text-sm">
                      No user found with that username
                    </p>
                  </div>
                ) : (
                  <div
                    className="p-4 rounded-xl border flex items-center gap-3"
                    style={{
                      background: "oklch(0.82 0.17 90 / 0.06)",
                      border: "1px solid oklch(0.82 0.17 90 / 0.3)",
                    }}
                    data-ocid="friends.search.card"
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-display font-black text-lg flex-shrink-0"
                      style={{
                        background: "oklch(0.82 0.17 90 / 0.15)",
                        color: "oklch(0.82 0.17 90)",
                      }}
                    >
                      {(searchResult as UserProfile).username[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-base text-foreground">
                        {(searchResult as UserProfile).username}
                      </div>
                      <TierBadge
                        tier={
                          getTierFromXp(
                            Number((searchResult as UserProfile).xp),
                          ).tier
                        }
                        size="sm"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      data-ocid="friends.send_request.button"
                      size="sm"
                      disabled={
                        sendingTo ===
                        (searchResult as UserProfile).id.toString()
                      }
                      onClick={() =>
                        handleSendRequest(
                          (searchResult as UserProfile).id.toString(),
                        )
                      }
                      className="font-display font-bold shrink-0 gap-1"
                      style={{
                        background: "oklch(0.82 0.17 90)",
                        color: "oklch(0.15 0.02 42)",
                      }}
                    >
                      {sendingTo ===
                      (searchResult as UserProfile).id.toString() ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UserPlus className="w-3.5 h-3.5" />
                      )}
                      Add
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Pending Requests */}
        <section>
          <h2
            className="font-display font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2"
            style={{ color: "oklch(0.82 0.17 90)" }}
          >
            Pending Requests
            {requests.length > 0 && (
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black"
                style={{
                  background: "oklch(0.82 0.17 90)",
                  color: "oklch(0.15 0.02 42)",
                }}
              >
                {requests.length}
              </span>
            )}
          </h2>

          {requestsLoading ? (
            <div
              className="space-y-2"
              data-ocid="friends.requests.loading_state"
            >
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          ) : requests.length === 0 ? (
            <div
              className="p-5 rounded-xl text-center"
              style={{
                background: "oklch(0.14 0.025 42 / 0.6)",
                border: "1px solid oklch(0.25 0.03 42 / 0.5)",
              }}
              data-ocid="friends.requests.empty_state"
            >
              <p className="text-sm text-muted-foreground font-body">
                No pending requests
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((from, i) => {
                const key = from.toString();
                const isProcessing = processingRequest === key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-ocid={`friends.request.item.${i + 1}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/60"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0"
                      style={{
                        background: "oklch(0.82 0.17 90 / 0.1)",
                        border: "1px solid oklch(0.82 0.17 90 / 0.3)",
                        color: "oklch(0.82 0.17 90)",
                      }}
                    >
                      {key[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm text-foreground truncate">
                        {truncatePrincipal(key)}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-body">
                        Wants to be your friend
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button
                        data-ocid={`friends.accept.button.${i + 1}`}
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleAccept(from)}
                        className="h-7 px-2 font-display font-bold gap-1"
                        style={{
                          background: "oklch(0.82 0.17 90)",
                          color: "oklch(0.15 0.02 42)",
                        }}
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </Button>
                      <Button
                        data-ocid={`friends.decline.button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => handleDecline(from)}
                        className="h-7 px-2 font-display font-bold gap-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Friends List */}
        <section>
          <h2
            className="font-display font-bold text-sm mb-3 uppercase tracking-wider flex items-center gap-2"
            style={{ color: "oklch(0.82 0.17 90)" }}
          >
            My Friends
            <span className="text-muted-foreground font-body normal-case text-xs font-normal">
              ({friends.length})
            </span>
          </h2>

          {friendsLoading ? (
            <div className="space-y-2" data-ocid="friends.list.loading_state">
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          ) : friends.length === 0 ? (
            <div
              className="p-8 rounded-xl text-center"
              style={{
                background: "oklch(0.14 0.025 42 / 0.6)",
                border: "1px solid oklch(0.25 0.03 42 / 0.5)",
              }}
              data-ocid="friends.list.empty_state"
            >
              <div className="text-4xl mb-3">👥</div>
              <p className="font-display font-bold text-base text-foreground mb-1">
                No friends yet
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Search for teammates and send them a request!
              </p>
            </div>
          ) : (
            <div className="space-y-2" data-ocid="friends.list">
              {friends.map((p, i) => (
                <div key={p.toString()} data-ocid={`friends.item.${i + 1}`}>
                  <FriendCard principal={p} label="Friend" />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
