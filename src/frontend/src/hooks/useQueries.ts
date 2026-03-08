import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Exercise,
  ExerciseCategory,
  TournamentEntry,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

// ===== USER PROFILE =====
export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error("No actor");
      await actor.registerUser(username);
    },
    onSuccess: () => {
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
    refetchInterval: 30 * 60 * 1000, // refetch every 30 minutes
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

// Static tournament data since there's no getTournaments() API
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
