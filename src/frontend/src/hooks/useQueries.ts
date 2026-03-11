import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Battle,
  Exercise,
  ExerciseCategory,
  LeaderboardEntry,
  TournamentEntry,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

function getErrText(err: unknown): string {
  if (err instanceof Error) return `${err.message} ${String(err)}`;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

// ===== USER PROFILE =====
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  const isEnabled = !!actor && !isFetching;
  const query = useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getCallerUserProfile();
      if (Array.isArray(result)) {
        return result.length > 0 ? (result[0] as UserProfile) : null;
      }
      return (result as UserProfile) ?? null;
    },
    enabled: isEnabled,
  });
  // When the query is disabled (actor not ready), don't report isLoading=true
  // — that was causing the infinite loading spinner in App.tsx
  return { ...query, isLoading: isEnabled ? query.isLoading : false };
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("No actor");
      try {
        await actor.registerUser(username);
      } catch (err: unknown) {
        const fullText = getErrText(err);
        if (fullText.toLowerCase().includes("already registered")) {
          return; // silently succeed — profile exists
        }
        throw err;
      }
    },
    onSuccess: (_data, username) => {
      queryClient.setQueryData(["userProfile"], {
        username,
        xp: BigInt(0),
        level: BigInt(1),
        tier: { bronze: null },
        adFreeUntil: BigInt(0),
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// ===== AD SYSTEM =====
export function useCanSeeAd() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["canSeeAd"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.canSeeAd();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30 * 60 * 1000,
  });
}

export function useRecordAdView() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.recordAdView();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["canSeeAd"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// ===== EXERCISES =====
export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<ExerciseCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useExercisesByCategory(category: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Exercise[]>({
    queryKey: ["exercises", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getExercisesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useLogWorkoutSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      exerciseId,
      reps,
    }: { exerciseId: bigint; reps: bigint }) => {
      if (!actor) throw new Error("No actor");
      await actor.logWorkoutSession(exerciseId, reps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useLogPushups() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (count: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.logPushups(count);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// ===== TOURNAMENTS =====
export interface Tournament {
  id: bigint;
  name: string;
  startDate: bigint;
  endDate: bigint;
  entryFee: bigint;
  isPaid: boolean;
  status: "active" | "ended";
}

export const DEMO_FREE_TOURNAMENTS: Tournament[] = [
  {
    id: BigInt(1),
    name: "Weekly Push-Up Blast",
    startDate: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    endDate: BigInt(Date.now() + 5 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    entryFee: BigInt(0),
    isPaid: false,
    status: "active",
  },
  {
    id: BigInt(2),
    name: "Junior Iron Challenge",
    startDate: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    endDate: BigInt(Date.now() + 6 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    entryFee: BigInt(0),
    isPaid: false,
    status: "active",
  },
];

export const DEMO_PAID_TOURNAMENTS: Tournament[] = [
  {
    id: BigInt(3),
    name: "KidFit Grand Championship",
    startDate: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    endDate: BigInt(Date.now() + 57 * 24 * 60 * 60 * 1000) * BigInt(1_000_000),
    entryFee: BigInt(5000),
    isPaid: true,
    status: "active",
  },
];

export function useTournamentLeaderboard(tournamentId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<TournamentEntry[]>({
    queryKey: ["leaderboard", tournamentId?.toString()],
    queryFn: async () => {
      if (!actor || !tournamentId) return [];
      return actor.getTournamentLeaderboard(tournamentId);
    },
    enabled: !!actor && !isFetching && !!tournamentId,
  });
}

export function useEnterTournament() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (tournamentId: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.enterTournament(tournamentId);
    },
  });
}

export function useSubmitTournamentScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tournamentId,
      pushupCount,
    }: { tournamentId: bigint; pushupCount: bigint }) => {
      if (!actor) throw new Error("No actor");
      await actor.submitTournamentScore(tournamentId, pushupCount);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", variables.tournamentId.toString()],
      });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: Array<{
        productName: string;
        currency: string;
        quantity: bigint;
        priceInCents: bigint;
        productDescription: string;
      }>;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// ===== ADMIN MUTATIONS =====
export function useAddExerciseCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: import("../backend.d").ExerciseCategory) => {
      if (!actor) throw new Error("No actor");
      await actor.addExerciseCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAddExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exercise: import("../backend.d").Exercise) => {
      if (!actor) throw new Error("No actor");
      await actor.addExercise(exercise);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useCreateTournament() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      startDate,
      endDate,
      entryFee,
      isPaid,
    }: {
      name: string;
      startDate: bigint;
      endDate: bigint;
      entryFee: bigint;
      isPaid: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createTournament(name, startDate, endDate, entryFee, isPaid);
    },
  });
}

export function useFinalizeTournament() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (tournamentId: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.finalizeTournament(tournamentId);
    },
  });
}

// ===== GLOBAL LEADERBOARD =====
export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["globalLeaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (
          actor as unknown as {
            getLeaderboard: () => Promise<LeaderboardEntry[]>;
          }
        ).getLeaderboard();
        return result as LeaderboardEntry[];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ===== BATTLES =====
export function useCreateBattle() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("No actor");
      await actor.createBattle(code);
    },
  });
}

export function useJoinBattle() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("No actor");
      await actor.joinBattle(code);
    },
  });
}

export function useUpdateBattleScore() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ code, score }: { code: string; score: bigint }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateMyBattleScore(code, score);
    },
  });
}

export function useGetBattle(code: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Battle | null>({
    queryKey: ["battle", code],
    queryFn: async () => {
      if (!actor || !code) return null;
      const result = await actor.getBattle(code);
      if (Array.isArray(result)) {
        return result.length > 0 ? (result[0] as Battle) : null;
      }
      return result as Battle | null;
    },
    enabled: !!actor && !!code && !isFetching,
    refetchInterval: 3000,
  });
}
