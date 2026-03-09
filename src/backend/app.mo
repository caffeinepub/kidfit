import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Order "mo:base/Order";

actor {

  // ---- Types ----
  public type UserProfile = {
    id: Principal;
    username: Text;
    xp: Nat;
    joinedAt: Int;
  };

  public type MissionKey = Text; // "principalText:missionId:date"

  // ---- State ----
  stable var profileEntries : [(Principal, UserProfile)] = [];
  stable var missionEntries : [(MissionKey, Bool)] = [];

  var profiles = HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
  var missions = HashMap.fromIter<MissionKey, Bool>(missionEntries.vals(), 50, Text.equal, Text.hash);

  system func preupgrade() {
    profileEntries := Iter.toArray(profiles.entries());
    missionEntries := Iter.toArray(missions.entries());
  };

  system func postupgrade() {
    profiles := HashMap.fromIter<Principal, UserProfile>(profileEntries.vals(), 10, Principal.equal, Principal.hash);
    missions := HashMap.fromIter<MissionKey, Bool>(missionEntries.vals(), 50, Text.equal, Text.hash);
    profileEntries := [];
    missionEntries := [];
  };

  // ---- Helpers ----
  func missionKey(p: Principal, missionId: Text, date: Text) : MissionKey {
    Principal.toText(p) # ":" # missionId # ":" # date
  };

  // ---- API ----

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
            let updated : UserProfile = {
              id = p.id;
              username = p.username;
              xp = p.xp + 50;
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

};
