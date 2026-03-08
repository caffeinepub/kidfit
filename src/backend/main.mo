import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  // Enum Definitions
  type Tier = { #bronze; #silver; #gold; #platinum; #diamond };
  type Difficulty = { #easy; #medium; #hard };

  // Core Types
  public type UserProfile = {
    username : Text;
    xp : Nat;
    level : Nat;
    tier : Tier;
    adFreeUntil : Time.Time;
  };

  public type ExerciseCategory = {
    name : Text;
    description : Text;
  };

  public type Exercise = {
    id : Nat;
    category : Text;
    name : Text;
    description : Text;
    difficulty : Difficulty;
    targetReps : Nat;
  };

  public type WorkoutSession = {
    userId : Principal;
    exerciseId : Nat;
    reps : Nat;
    timestamp : Time.Time;
  };

  public type Tournament = {
    id : Nat;
    name : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    entryFee : Nat;
    isPaid : Bool;
  };

  public type TournamentEntry = {
    tournamentId : Nat;
    userId : Principal;
    pushupCount : Nat;
    timestamp : Time.Time;
  };

  // Persistent State
  let profiles = Map.empty<Principal, UserProfile>();
  let exerciseCategories = Map.empty<Text, ExerciseCategory>();
  let exercises = Map.empty<Nat, Exercise>();
  let workoutSessions = Map.empty<Principal, List.List<WorkoutSession>>();
  let tournaments = Map.empty<Nat, Tournament>();
  let tournamentEntries = Map.empty<Nat, List.List<TournamentEntry>>();
  let adViews = Map.empty<Principal, List.List<Time.Time>>();
  var nextExerciseId = 0;
  var nextTournamentId = 0;

  // Authorization and Stripe Config
  let accessControlState = Authorization.initState();
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  include MixinAuthorization(accessControlState);

  // Comparison Modules
  module TournamentEntry {
    public func compareByPushupCount(a : TournamentEntry, b : TournamentEntry) : Order.Order {
      Nat.compare(b.pushupCount, a.pushupCount);
    };
  };

  // *** User Profile Management ***
  public shared ({ caller }) func registerUser(username : Text) : async () {
    if (profiles.containsKey(caller)) { Runtime.trap("This user is already registered.") };
    let profile : UserProfile = {
      username;
      xp = 0;
      level = 1;
      tier = #bronze;
      adFreeUntil = 0;
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public query ({ caller }) func getProfile(user : Principal) : async UserProfile {
    if (caller != user and not Authorization.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
  };

  // *** XP and Level Logic ***
  func calculateLevel(xp : Nat) : Nat {
    let xpInt = Int.fromNat(xp);
    let xpPerLevel = 1000;
    let level : Int = (xp / xpPerLevel) + 1;
    if (level > 100) { return 100 };
    Int.abs(level);
  };

  func calculateTier(level : Nat) : Tier {
    if (level < 20) { return #bronze };
    if (level < 40) { return #silver };
    if (level < 60) { return #gold };
    if (level < 80) { return #platinum };
    #diamond;
  };

  public shared ({ caller }) func addXp(user : Principal, xp : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add XP");
    };
    let profile = switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let newXp = profile.xp + xp;
    let newLevel = calculateLevel(newXp);
    let newTier = calculateTier(newLevel);
    let updatedProfile : UserProfile = {
      username = profile.username;
      xp = newXp;
      level = newLevel;
      tier = newTier;
      adFreeUntil = profile.adFreeUntil;
    };
    profiles.add(user, updatedProfile);
  };

  // Internal function for awarding XP (no authorization check)
  func awardXp(user : Principal, xp : Nat) : async () {
    let profile = switch (profiles.get(user)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let newXp = profile.xp + xp;
    let newLevel = calculateLevel(newXp);
    let newTier = calculateTier(newLevel);
    let updatedProfile : UserProfile = {
      username = profile.username;
      xp = newXp;
      level = newLevel;
      tier = newTier;
      adFreeUntil = profile.adFreeUntil;
    };
    profiles.add(user, updatedProfile);
  };

  // *** Ad System ***
  public query ({ caller }) func canSeeAd() : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check ad availability");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };

    if (Time.now() < profile.adFreeUntil) { return false };

    let todayTimestamp = Time.now();
    let todayViews = switch (adViews.get(caller)) {
      case (null) { List.empty<Time.Time>() };
      case (?views) { views };
    };

    if (todayViews.size() >= 6) { return false };

    let now = Time.now();
    switch (todayViews.last()) {
      case (null) { true };
      case (?lastView) {
        if (now - lastView < 30 * 60 * 1000000000) { return false };
        true;
      };
    };
  };

  public shared ({ caller }) func recordAdView() : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record ad views");
    };
    let views = switch (adViews.get(caller)) {
      case (null) { List.empty<Time.Time>() };
      case (?v) { v };
    };

    if (views.size() >= 6) { Runtime.trap("Max ads reached for today") };

    let now = Time.now();
    switch (views.last()) {
      case (null) { () };
      case (?lastView) {
        if (now - lastView < 30 * 60 * 1000000000) { Runtime.trap("Must wait 30 mins between ads") };
      };
    };

    let newViews = List.empty<Time.Time>();
    newViews.add(now);
    adViews.add(caller, newViews);
  };

  // *** Exercise Library ***
  public shared ({ caller }) func addExerciseCategory(category : ExerciseCategory) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercise categories");
    };
    exerciseCategories.add(category.name, category);
  };

  public query ({ caller }) func getCategories() : async [ExerciseCategory] {
    exerciseCategories.values().toArray();
  };

  public shared ({ caller }) func addExercise(exercise : Exercise) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add exercises");
    };
    exercises.add(exercise.id, exercise);
  };

  public query ({ caller }) func getExercisesByCategory(category : Text) : async [Exercise] {
    exercises.values().toArray().filter(func(e) { e.category == category });
  };

  // *** Workouts and Push-up Sessions ***
  public shared ({ caller }) func logWorkoutSession(exerciseId : Nat, reps : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log workout sessions");
    };
    if (not exercises.containsKey(exerciseId)) { Runtime.trap("Exercise not found") };
    let session : WorkoutSession = {
      userId = caller;
      exerciseId;
      reps;
      timestamp = Time.now();
    };

    let history = switch (workoutSessions.get(caller)) {
      case (null) { List.empty<WorkoutSession>() };
      case (?h) { h };
    };
    history.add(session);
    workoutSessions.add(caller, history);

    await awardXp(caller, reps);
  };

  public shared ({ caller }) func logPushups(count : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can log pushups");
    };
    let session : WorkoutSession = {
      userId = caller;
      exerciseId = 0;
      reps = count;
      timestamp = Time.now();
    };

    let history = switch (workoutSessions.get(caller)) {
      case (null) { List.empty<WorkoutSession>() };
      case (?h) { h };
    };
    history.add(session);
    workoutSessions.add(caller, history);

    await awardXp(caller, count);
  };

  // *** Tournaments ***
  public shared ({ caller }) func createTournament(name : Text, startDate : Time.Time, endDate : Time.Time, entryFee : Nat, isPaid : Bool) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };
    let tournament : Tournament = {
      id = nextTournamentId;
      name;
      startDate;
      endDate;
      entryFee;
      isPaid;
    };
    tournaments.add(nextTournamentId, tournament);
    nextTournamentId += 1;
    tournament.id;
  };

  public shared ({ caller }) func enterTournament(tournamentId : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can enter tournaments");
    };
    if (not tournaments.containsKey(tournamentId)) { Runtime.trap("Tournament not found") };
  };

  public shared ({ caller }) func submitTournamentScore(tournamentId : Nat, pushupCount : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit tournament scores");
    };
    if (not tournaments.containsKey(tournamentId)) { Runtime.trap("Tournament not found") };

    let entry : TournamentEntry = {
      tournamentId;
      userId = caller;
      pushupCount;
      timestamp = Time.now();
    };

    let entries = switch (tournamentEntries.get(tournamentId)) {
      case (null) { List.empty<TournamentEntry>() };
      case (?e) { e };
    };
    entries.add(entry);
    tournamentEntries.add(tournamentId, entries);
  };

  public query ({ caller }) func getTournamentLeaderboard(tournamentId : Nat) : async [TournamentEntry] {
    switch (tournamentEntries.get(tournamentId)) {
      case (null) { [] };
      case (?entries) { entries.toArray().sort(TournamentEntry.compareByPushupCount) };
    };
  };

  public shared ({ caller }) func finalizeTournament(tournamentId : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can finalize tournaments");
    };
    if (not tournaments.containsKey(tournamentId)) { Runtime.trap("Tournament not found") };

    let entries = switch (tournamentEntries.get(tournamentId)) {
      case (null) { List.empty<TournamentEntry>() };
      case (?e) { e };
    };

    let sortedEntries = entries.toArray().sort(TournamentEntry.compareByPushupCount);

    if (sortedEntries.size() > 0) {
      await awardXp(sortedEntries[0].userId, 500);
    };
    // Add ad-free rewards for paid tournaments here if needed
  };

  // *** Stripe Integration ***
  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        await Stripe.getSessionStatus(config, sessionId, transform);
      };
    };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) {
        await Stripe.createCheckoutSession(config, caller, items, successUrl, cancelUrl, transform);
      };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
