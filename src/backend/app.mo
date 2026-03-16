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

  // ---- State ----
  stable var profileEntries : [(Principal, UserProfile)] = [];
  stable var missionEntries : [(MissionKey, Bool)] = [];
  // Stage B: coins, premium, avatar, owned items
  stable var coinsEntries : [(Principal, Nat)] = [];
  stable var premiumEntries : [(Principal, Int)] = [];
  stable var ownedItemsEntries : [(Principal, [Text])] = [];
  stable var avatarEntries : [(Principal, AvatarData)] = [];

  var profiles = HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
  var missions = HashMap.fromIter<MissionKey, Bool>(missionEntries.vals(), 50, Text.equal, Text.hash);
  var coinsMap = HashMap.fromIter<Principal, Nat>(coinsEntries.vals(), 10, Principal.equal, Principal.hash);
  var premiumMap = HashMap.fromIter<Principal, Int>(premiumEntries.vals(), 10, Principal.equal, Principal.hash);
  var ownedItemsMap = HashMap.fromIter<Principal, [Text]>(ownedItemsEntries.vals(), 10, Principal.equal, Principal.hash);
  var avatarMap = HashMap.fromIter<Principal, AvatarData>(avatarEntries.vals(), 10, Principal.equal, Principal.hash);

  system func preupgrade() {
    profileEntries := Iter.toArray(profiles.entries());
    missionEntries := Iter.toArray(missions.entries());
    coinsEntries := Iter.toArray(coinsMap.entries());
    premiumEntries := Iter.toArray(premiumMap.entries());
    ownedItemsEntries := Iter.toArray(ownedItemsMap.entries());
    avatarEntries := Iter.toArray(avatarMap.entries());
  };

  system func postupgrade() {
    profiles := HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
    missions := HashMap.fromIter<MissionKey, Bool>(missionEntries.vals(), 50, Text.equal, Text.hash);
    coinsMap := HashMap.fromIter<Principal, Nat>(coinsEntries.vals(), 10, Principal.equal, Principal.hash);
    premiumMap := HashMap.fromIter<Principal, Int>(premiumEntries.vals(), 10, Principal.equal, Principal.hash);
    ownedItemsMap := HashMap.fromIter<Principal, [Text]>(ownedItemsEntries.vals(), 10, Principal.equal, Principal.hash);
    avatarMap := HashMap.fromIter<Principal, AvatarData>(avatarEntries.vals(), 10, Principal.equal, Principal.hash);
    profileEntries := [];
    missionEntries := [];
    coinsEntries := [];
    premiumEntries := [];
    ownedItemsEntries := [];
    avatarEntries := [];
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
            let xpGain : Nat = if (isPremiumActiveFor(caller)) { 60 } else { 50 };
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

  // ---- Stage B: Coins & Workout Completion ----

  public shared query(msg) func getMyCoins() : async Nat {
    switch (coinsMap.get(msg.caller)) {
      case null { 0 };
      case (?c) { c };
    };
  };

  // Called when user finishes a workout plan; awards XP + coins
  public shared(msg) func completeWorkout() : async { xpGained: Nat; coinsGained: Nat } {
    let caller = msg.caller;
    let isPremium = isPremiumActiveFor(caller);
    let xpGain : Nat = if (isPremium) { 60 } else { 50 };
    let coinGain : Nat = if (isPremium) { 12 } else { 10 };

    // Award XP
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

    // Award coins
    let currentCoins = switch (coinsMap.get(caller)) {
      case null { 0 };
      case (?c) { c };
    };
    coinsMap.put(caller, currentCoins + coinGain);

    { xpGained = xpGain; coinsGained = coinGain }
  };

  // Add bonus coins (e.g. after watching rewarded ad)
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

  // Purchase an avatar item for 30 coins
  public shared(msg) func purchaseAvatarItem(itemId: Text) : async { #ok: Nat; #err: Text } {
    let caller = msg.caller;
    let owned = switch (ownedItemsMap.get(caller)) {
      case null { [] };
      case (?items) { items };
    };
    // Check if already owned
    let alreadyOwned = Array.find<Text>(owned, func(i) { i == itemId });
    switch (alreadyOwned) {
      case (?_) { return #err("Already owned"); };
      case null { };
    };
    // Check coins
    let currentCoins = switch (coinsMap.get(caller)) {
      case null { 0 };
      case (?c) { c };
    };
    if (currentCoins < 30) {
      return #err("Not enough coins (need 30)");
    };
    // Deduct and add item
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

  // Activate premium for 30 days (called after Stripe payment confirmed)
  public shared(msg) func activatePremium() : async Int {
    let thirtyDays : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    let until = Time.now() + thirtyDays;
    premiumMap.put(msg.caller, until);
    until
  };

};
