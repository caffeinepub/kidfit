import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Order "mo:base/Order";

actor {

  // ---- Types ----
  public type UserProfile = {
    id: Principal;
    username: Text;
    xp: Nat;
    joinedAt: Int;
  };

  public type MissionKey = Text;

  public type AvatarData = {
    skinTone: Text;
    hair: Text;
    hairColor: Text;
    face: Text;
    outfit: Text;
    accessory: Text;
  };

  public type StreakData = {
    currentStreak: Nat;
    lastActiveDate: Text;
  };

  // ---- State ----
  stable var profileEntries : [(Principal, UserProfile)] = [];
  stable var missionEntries : [(MissionKey, Bool)] = [];
  stable var coinsEntries : [(Principal, Nat)] = [];
  stable var premiumEntries : [(Principal, Int)] = [];
  stable var ownedItemsEntries : [(Principal, [Text])] = [];
  stable var avatarEntries : [(Principal, AvatarData)] = [];
  // Stage 2: Streaks & Friends
  stable var streakEntries : [(Principal, StreakData)] = [];
  stable var friendsEntries : [(Principal, [Principal])] = [];
  stable var friendRequestEntries : [(Principal, [Principal])] = [];

  var profiles = HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
  var missions = HashMap.fromIter<MissionKey, Bool>(missionEntries.vals(), 50, Text.equal, Text.hash);
  var coinsMap = HashMap.fromIter<Principal, Nat>(coinsEntries.vals(), 10, Principal.equal, Principal.hash);
  var premiumMap = HashMap.fromIter<Principal, Int>(premiumEntries.vals(), 10, Principal.equal, Principal.hash);
  var ownedItemsMap = HashMap.fromIter<Principal, [Text]>(ownedItemsEntries.vals(), 10, Principal.equal, Principal.hash);
  var avatarMap = HashMap.fromIter<Principal, AvatarData>(avatarEntries.vals(), 10, Principal.equal, Principal.hash);
  var streakMap = HashMap.fromIter<Principal, StreakData>(streakEntries.vals(), 10, Principal.equal, Principal.hash);
  var friendsMap = HashMap.fromIter<Principal, [Principal]>(friendsEntries.vals(), 10, Principal.equal, Principal.hash);
  var friendRequestMap = HashMap.fromIter<Principal, [Principal]>(friendRequestEntries.vals(), 10, Principal.equal, Principal.hash);

  system func preupgrade() {
    profileEntries := Iter.toArray(profiles.entries());
    missionEntries := Iter.toArray(missions.entries());
    coinsEntries := Iter.toArray(coinsMap.entries());
    premiumEntries := Iter.toArray(premiumMap.entries());
    ownedItemsEntries := Iter.toArray(ownedItemsMap.entries());
    avatarEntries := Iter.toArray(avatarMap.entries());
    streakEntries := Iter.toArray(streakMap.entries());
    friendsEntries := Iter.toArray(friendsMap.entries());
    friendRequestEntries := Iter.toArray(friendRequestMap.entries());
  };

  system func postupgrade() {
    profiles := HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
    missions := HashMap.fromIter<MissionKey, Bool>(missionEntries.vals(), 50, Text.equal, Text.hash);
    coinsMap := HashMap.fromIter<Principal, Nat>(coinsEntries.vals(), 10, Principal.equal, Principal.hash);
    premiumMap := HashMap.fromIter<Principal, Int>(premiumEntries.vals(), 10, Principal.equal, Principal.hash);
    ownedItemsMap := HashMap.fromIter<Principal, [Text]>(ownedItemsEntries.vals(), 10, Principal.equal, Principal.hash);
    avatarMap := HashMap.fromIter<Principal, AvatarData>(avatarEntries.vals(), 10, Principal.equal, Principal.hash);
    streakMap := HashMap.fromIter<Principal, StreakData>(streakEntries.vals(), 10, Principal.equal, Principal.hash);
    friendsMap := HashMap.fromIter<Principal, [Principal]>(friendsEntries.vals(), 10, Principal.equal, Principal.hash);
    friendRequestMap := HashMap.fromIter<Principal, [Principal]>(friendRequestEntries.vals(), 10, Principal.equal, Principal.hash);
    profileEntries := [];
    missionEntries := [];
    coinsEntries := [];
    premiumEntries := [];
    ownedItemsEntries := [];
    avatarEntries := [];
    streakEntries := [];
    friendsEntries := [];
    friendRequestEntries := [];
  };

  // ---- Helpers ----
  func missionKey(p: Principal, missionId: Text, date: Text) : MissionKey {
    Principal.toText(p) # ":" # missionId # ":" # date
  };

  func isPremiumActiveFor(p: Principal) : Bool {
    switch (premiumMap.get(p)) {
      case null { false };
      case (?until) { until > Time.now() };
    };
  };

  // Rank-based XP: Bronze=50/40, Silver=70/50, Gold=90/60, Platinum=110/70, Diamond=130/80
  func workoutXpForProfile(p: Principal) : Nat {
    switch (profiles.get(p)) {
      case null { 50 };
      case (?prof) {
        let xp = prof.xp;
        let base : Nat = if (xp >= 7000) { 130 }
          else if (xp >= 3500) { 110 }
          else if (xp >= 1500) { 90 }
          else if (xp >= 500) { 70 }
          else { 50 };
        if (isPremiumActiveFor(p)) { base + 10 } else { base }
      };
    };
  };

  func missionXpForProfile(p: Principal) : Nat {
    switch (profiles.get(p)) {
      case null { 40 };
      case (?prof) {
        let xp = prof.xp;
        let base : Nat = if (xp >= 7000) { 80 }
          else if (xp >= 3500) { 70 }
          else if (xp >= 1500) { 60 }
          else if (xp >= 500) { 50 }
          else { 40 };
        if (isPremiumActiveFor(p)) { base + 5 } else { base }
      };
    };
  };

  // ---- Core User API ----

  public shared(msg) func registerUser(username: Text) : async { #ok: UserProfile; #err: Text } {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Must be logged in");
    };
    switch (profiles.get(caller)) {
      case (?_existing) { return #err("Already registered"); };
      case null {
        let profile : UserProfile = {
          id = caller;
          username = username;
          xp = 0;
          joinedAt = Time.now();
        };
        profiles.put(caller, profile);
        return #ok(profile);
      };
    };
  };

  public shared query(msg) func getMyProfile() : async ?UserProfile {
    profiles.get(msg.caller)
  };

  public shared(msg) func addXP(amount: Nat) : async ?UserProfile {
    let caller = msg.caller;
    switch (profiles.get(caller)) {
      case null { null };
      case (?p) {
        let updated : UserProfile = {
          id = p.id;
          username = p.username;
          xp = p.xp + amount;
          joinedAt = p.joinedAt;
        };
        profiles.put(caller, updated);
        ?updated
      };
    };
  };

  public shared(msg) func completeMission(missionId: Text, date: Text) : async { #ok: UserProfile; #err: Text } {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Must be logged in");
    };
    let key = missionKey(caller, missionId, date);
    switch (missions.get(key)) {
      case (?_) { return #err("Already completed today"); };
      case null {
        switch (profiles.get(caller)) {
          case null { return #err("Profile not found"); };
          case (?p) {
            missions.put(key, true);
            let xpGain = missionXpForProfile(caller);
            let updated : UserProfile = {
              id = p.id;
              username = p.username;
              xp = p.xp + xpGain;
              joinedAt = p.joinedAt;
            };
            profiles.put(caller, updated);
            return #ok(updated);
          };
        };
      };
    };
  };

  public shared query(msg) func hasMissionCompleted(missionId: Text, date: Text) : async Bool {
    let key = missionKey(msg.caller, missionId, date);
    switch (missions.get(key)) {
      case (?_) { true };
      case null { false };
    };
  };

  public query func getLeaderboard() : async [UserProfile] {
    let all = Iter.toArray(profiles.vals());
    let sorted = Array.sort<UserProfile>(all, func(a, b) {
      if (a.xp > b.xp) { #less }
      else if (a.xp < b.xp) { #greater }
      else { #equal }
    });
    if (sorted.size() > 50) {
      Array.tabulate<UserProfile>(50, func(i) { sorted[i] })
    } else {
      sorted
    }
  };

  // ---- Search Users ----

  public query func searchUserByUsername(username: Text) : async ?UserProfile {
    var found : ?UserProfile = null;
    for ((_, prof) in profiles.entries()) {
      if (prof.username == username) {
        found := ?prof;
      };
    };
    found
  };

  // ---- Stage 2: Daily Streaks ----

  // Call with today's date string "YYYY-MM-DD" to update streak
  public shared(msg) func updateStreak(date: Text) : async Nat {
    let caller = msg.caller;
    switch (streakMap.get(caller)) {
      case null {
        // First time
        let s : StreakData = { currentStreak = 1; lastActiveDate = date };
        streakMap.put(caller, s);
        1
      };
      case (?s) {
        if (s.lastActiveDate == date) {
          // Same day, no change
          s.currentStreak
        } else {
          // Simplified: just increment (frontend should track consecutive days)
          let newStreak = s.currentStreak + 1;
          let updated : StreakData = { currentStreak = newStreak; lastActiveDate = date };
          streakMap.put(caller, updated);
          newStreak
        };
      };
    };
  };

  public shared query(msg) func getMyStreak() : async StreakData {
    switch (streakMap.get(msg.caller)) {
      case null { { currentStreak = 0; lastActiveDate = "" } };
      case (?s) { s };
    };
  };

  // ---- Stage 2: Friends ----

  public shared(msg) func sendFriendRequest(to: Principal) : async { #ok; #err: Text } {
    let caller = msg.caller;
    if (Principal.equal(caller, to)) {
      return #err("Cannot friend yourself");
    };
    // Check if already friends
    let myFriends = switch (friendsMap.get(caller)) {
      case null { [] };
      case (?f) { f };
    };
    let alreadyFriends = Array.find<Principal>(myFriends, func(p) { Principal.equal(p, to) });
    switch (alreadyFriends) {
      case (?_) { return #err("Already friends"); };
      case null { };
    };
    // Add to their pending requests
    let existing = switch (friendRequestMap.get(to)) {
      case null { [] };
      case (?r) { r };
    };
    let alreadySent = Array.find<Principal>(existing, func(p) { Principal.equal(p, caller) });
    switch (alreadySent) {
      case (?_) { return #err("Request already sent"); };
      case null { };
    };
    friendRequestMap.put(to, Array.append<Principal>(existing, [caller]));
    #ok
  };

  public shared(msg) func acceptFriendRequest(from: Principal) : async { #ok; #err: Text } {
    let caller = msg.caller;
    let requests = switch (friendRequestMap.get(caller)) {
      case null { return #err("No request from this user"); };
      case (?r) { r };
    };
    let found = Array.find<Principal>(requests, func(p) { Principal.equal(p, from) });
    switch (found) {
      case null { return #err("No request from this user"); };
      case (?_) { };
    };
    // Remove from pending
    let newRequests = Array.filter<Principal>(requests, func(p) { not Principal.equal(p, from) });
    friendRequestMap.put(caller, newRequests);
    // Add to both friends lists
    let myFriends = switch (friendsMap.get(caller)) { case null { [] }; case (?f) { f }; };
    let theirFriends = switch (friendsMap.get(from)) { case null { [] }; case (?f) { f }; };
    friendsMap.put(caller, Array.append<Principal>(myFriends, [from]));
    friendsMap.put(from, Array.append<Principal>(theirFriends, [caller]));
    #ok
  };

  public shared(msg) func declineFriendRequest(from: Principal) : async { #ok; #err: Text } {
    let caller = msg.caller;
    let requests = switch (friendRequestMap.get(caller)) {
      case null { return #err("No request from this user"); };
      case (?r) { r };
    };
    let newRequests = Array.filter<Principal>(requests, func(p) { not Principal.equal(p, from) });
    friendRequestMap.put(caller, newRequests);
    #ok
  };

  public shared query(msg) func getMyFriendRequests() : async [Principal] {
    switch (friendRequestMap.get(msg.caller)) {
      case null { [] };
      case (?r) { r };
    };
  };

  public shared query(msg) func getMyFriends() : async [Principal] {
    switch (friendsMap.get(msg.caller)) {
      case null { [] };
      case (?f) { f };
    };
  };

  // Friends leaderboard: caller + their friends, sorted by XP
  public shared query(msg) func getFriendsLeaderboard() : async [UserProfile] {
    let caller = msg.caller;
    let friendPrincipals = switch (friendsMap.get(caller)) {
      case null { [] };
      case (?f) { f };
    };
    // Collect profiles
    var list : [UserProfile] = [];
    switch (profiles.get(caller)) {
      case null { };
      case (?p) { list := Array.append<UserProfile>(list, [p]); };
    };
    for (fp in friendPrincipals.vals()) {
      switch (profiles.get(fp)) {
        case null { };
        case (?p) { list := Array.append<UserProfile>(list, [p]); };
      };
    };
    Array.sort<UserProfile>(list, func(a, b) {
      if (a.xp > b.xp) { #less }
      else if (a.xp < b.xp) { #greater }
      else { #equal }
    })
  };

  // ---- Stage B: Coins & Workout Completion ----

  public shared query(msg) func getMyCoins() : async Nat {
    switch (coinsMap.get(msg.caller)) {
      case null { 0 };
      case (?c) { c };
    };
  };

  public shared(msg) func completeWorkout() : async { xpGained: Nat; coinsGained: Nat } {
    let caller = msg.caller;
    let isPremium = isPremiumActiveFor(caller);
    let xpGain = workoutXpForProfile(caller);
    let coinGain : Nat = if (isPremium) { 12 } else { 10 };

    switch (profiles.get(caller)) {
      case null { };
      case (?p) {
        let updated : UserProfile = {
          id = p.id;
          username = p.username;
          xp = p.xp + xpGain;
          joinedAt = p.joinedAt;
        };
        profiles.put(caller, updated);
      };
    };

    let currentCoins = switch (coinsMap.get(caller)) {
      case null { 0 };
      case (?c) { c };
    };
    coinsMap.put(caller, currentCoins + coinGain);

    { xpGained = xpGain; coinsGained = coinGain }
  };

  public shared(msg) func addBonusCoins(amount: Nat) : async Nat {
    let caller = msg.caller;
    let current = switch (coinsMap.get(caller)) {
      case null { 0 };
      case (?c) { c };
    };
    let newTotal = current + amount;
    coinsMap.put(caller, newTotal);
    newTotal
  };

  // ---- Stage B: Avatar Shop ----

  public shared query(msg) func getMyOwnedItems() : async [Text] {
    switch (ownedItemsMap.get(msg.caller)) {
      case null { [] };
      case (?items) { items };
    };
  };

  public shared(msg) func purchaseAvatarItem(itemId: Text) : async { #ok: Nat; #err: Text } {
    let caller = msg.caller;
    let owned = switch (ownedItemsMap.get(caller)) {
      case null { [] };
      case (?items) { items };
    };
    let alreadyOwned = Array.find<Text>(owned, func(i) { i == itemId });
    switch (alreadyOwned) {
      case (?_) { return #err("Already owned"); };
      case null { };
    };
    let currentCoins = switch (coinsMap.get(caller)) {
      case null { 0 };
      case (?c) { c };
    };
    if (currentCoins < 30) {
      return #err("Not enough coins (need 30)");
    };
    coinsMap.put(caller, currentCoins - 30);
    let newOwned = Array.append<Text>(owned, [itemId]);
    ownedItemsMap.put(caller, newOwned);
    #ok(currentCoins - 30)
  };

  // ---- Stage B: Avatar Customization ----

  public shared query(msg) func getMyAvatar() : async ?AvatarData {
    avatarMap.get(msg.caller)
  };

  public shared(msg) func saveAvatarCustomization(
    skinTone: Text,
    hair: Text,
    hairColor: Text,
    face: Text,
    outfit: Text,
    accessory: Text
  ) : async () {
    let avatar : AvatarData = {
      skinTone = skinTone;
      hair = hair;
      hairColor = hairColor;
      face = face;
      outfit = outfit;
      accessory = accessory;
    };
    avatarMap.put(msg.caller, avatar);
  };

  // ---- Stage B: Premium ----

  public shared query(msg) func isPremiumActive() : async Bool {
    isPremiumActiveFor(msg.caller)
  };

  public shared query(msg) func getPremiumUntil() : async Int {
    switch (premiumMap.get(msg.caller)) {
      case null { 0 };
      case (?until) { until };
    };
  };

  public shared(msg) func activatePremium() : async Int {
    let thirtyDays : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    let until = Time.now() + thirtyDays;
    premiumMap.put(msg.caller, until);
    until
  };

};
