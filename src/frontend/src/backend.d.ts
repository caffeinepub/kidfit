import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Exercise {
    id: bigint;
    difficulty: Difficulty;
    name: string;
    description: string;
    targetReps: bigint;
    category: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface ExerciseCategory {
    name: string;
    description: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TournamentEntry {
    userId: Principal;
    timestamp: Time;
    tournamentId: bigint;
    pushupCount: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface DietEntry {
    id: bigint;
    fat: bigint;
    carbs: bigint;
    calories: bigint;
    name: string;
    category: string;
    protein: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    xp: bigint;
    adFreeUntil: Time;
    username: string;
    tier: Tier;
    level: bigint;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum Tier {
    bronze = "bronze",
    gold = "gold",
    diamond = "diamond",
    platinum = "platinum",
    silver = "silver"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDietEntry(entry: DietEntry): Promise<void>;
    addExercise(exercise: Exercise): Promise<void>;
    addExerciseCategory(category: ExerciseCategory): Promise<void>;
    addXp(user: Principal, xp: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canSeeAd(): Promise<boolean>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createTournament(name: string, startDate: Time, endDate: Time, entryFee: bigint, isPaid: boolean): Promise<bigint>;
    enterTournament(tournamentId: bigint): Promise<void>;
    finalizeTournament(tournamentId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<ExerciseCategory>>;
    getDietEntries(): Promise<Array<DietEntry>>;
    getDietEntriesByCategory(category: string): Promise<Array<DietEntry>>;
    getExercisesByCategory(category: string): Promise<Array<Exercise>>;
    getProfile(user: Principal): Promise<UserProfile>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTournamentLeaderboard(tournamentId: bigint): Promise<Array<TournamentEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    logPushups(count: bigint): Promise<void>;
    logWorkoutSession(exerciseId: bigint, reps: bigint): Promise<void>;
    recordAdView(): Promise<void>;
    registerUser(username: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitTournamentScore(tournamentId: bigint, pushupCount: bigint): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
