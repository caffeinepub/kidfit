import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface UserProfile {
    id: Principal;
    username: string;
    xp: bigint;
    joinedAt: bigint;
}

export interface StreakData {
    currentStreak: bigint;
    lastActiveDate: string;
}

export interface AvatarData {
    skinTone: string;
    hair: string;
    hairColor: string;
    face: string;
    outfit: string;
    accessory: string;
}

export interface WorkoutReward {
    xpGained: bigint;
    coinsGained: bigint;
}

export interface backendInterface {
    // Core user
    registerUser(username: string): Promise<{ ok: UserProfile } | { err: string }>;
    getMyProfile(): Promise<UserProfile | null>;
    addXP(amount: bigint): Promise<UserProfile | null>;

    // Missions
    completeMission(missionId: string, date: string): Promise<{ ok: UserProfile } | { err: string }>;
    hasMissionCompleted(missionId: string, date: string): Promise<boolean>;

    // Leaderboard
    getLeaderboard(): Promise<Array<UserProfile>>;

    // Search
    searchUserByUsername(username: string): Promise<UserProfile | null>;

    // Streaks
    updateStreak(date: string): Promise<bigint>;
    getMyStreak(): Promise<StreakData>;

    // Friends
    sendFriendRequest(to: Principal): Promise<{ ok: null } | { err: string }>;
    acceptFriendRequest(from: Principal): Promise<{ ok: null } | { err: string }>;
    declineFriendRequest(from: Principal): Promise<{ ok: null } | { err: string }>;
    getMyFriendRequests(): Promise<Array<Principal>>;
    getMyFriends(): Promise<Array<Principal>>;
    getFriendsLeaderboard(): Promise<Array<UserProfile>>;

    // Coins & Workout
    getMyCoins(): Promise<bigint>;
    completeWorkout(): Promise<WorkoutReward>;
    addBonusCoins(amount: bigint): Promise<bigint>;

    // Avatar Shop
    getMyOwnedItems(): Promise<Array<string>>;
    purchaseAvatarItem(itemId: string): Promise<{ ok: bigint } | { err: string }>;

    // Avatar Customization
    getMyAvatar(): Promise<AvatarData | null>;
    saveAvatarCustomization(skinTone: string, hair: string, hairColor: string, face: string, outfit: string, accessory: string): Promise<void>;

    // Premium
    isPremiumActive(): Promise<boolean>;
    getPremiumUntil(): Promise<bigint>;
    activatePremium(): Promise<bigint>;
}
