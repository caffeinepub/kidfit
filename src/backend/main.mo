import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  // Enums
  type Tier = { #bronze; #silver; #gold; #platinum; #diamond };
  type Difficulty = { #easy; #medium; #hard };
  type MissionKey = Text; // "principalText:missionId:date"

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

  public type DietEntry = {
    id : Nat;
    name : Text;
    category : Text;
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
  };

  public type WorkoutExercise = {
    name : Text;
    sets : Nat;
    reps : Nat;
    notes : Text;
  };

  public type WorkoutPlan = {
    id : Nat;
    dayLabel : Text;
    description : Text;
    exercises : [WorkoutExercise];
  };

  public type Battle = {
    code : Text;
    creator : Principal;
    challenger : ?Principal;
    creatorScore : Nat;
    challengerScore : Nat;
    status : { #waiting; #active; #finished };
    expiresAt : Time.Time;
  };

  public type BattleChatMessage = {
    id : Nat;
    battleCode : Text;
    sender : Principal;
    senderUsername : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type StreakData = {
    lastActiveDate : Text;
    currentStreak : Nat;
  };

  public type FriendRequest = {
    from : Principal;
    to : Principal;
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
  let dietEntries = Map.empty<Nat, DietEntry>();
  let workoutPlans = Map.empty<Nat, WorkoutPlan>();
  var nextWorkoutPlanId = 0;
  let battles = Map.empty<Text, Battle>();
  let battleChats = Map.empty<Text, List.List<BattleChatMessage>>();
  var nextExerciseId = 0;
  var nextTournamentId = 0;
  var nextDietEntryId = 0;
  var nextChatId = 0;

  // Streaks and Friends State
  let dailyStreaks = Map.empty<Principal, StreakData>();
  let pendingFriendRequests = Map.empty<Principal, List.List<Principal>>();
  let friends = Map.empty<Principal, List.List<Principal>>();

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

  // *** Helper Functions ***
  func getTierXpScaling(tier : Tier) : { workout : Nat; mission : Nat } {
    switch (tier) {
      case (#bronze) { { workout = 50; mission = 40 } };
      case (#silver) { { workout = 70; mission = 50 } };
      case (#gold) { { workout = 90; mission = 60 } };
      case (#platinum) { { workout = 110; mission = 70 } };
      case (#diamond) { { workout = 130; mission = 80 } };
    };
  };

  // *** User Profile Management ***
  public shared ({ caller }) func registerUser(username : Text) : async () {
    if (profiles.containsKey(caller)) {
      Runtime.trap("This user is already registered.");
    };
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
    switch (caller.isAnonymous()) {
      case (true) { null };
      case (false) { profiles.get(caller) };
    };
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
  };

  public query ({ caller }) func getWorkoutSessions() : async [WorkoutSession] {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view workout sessions");
    };
    switch (workoutSessions.get(caller)) {
      case (null) { [] };
      case (?sessions) { sessions.toArray() };
    };
  };

  // *** Workout Plans ***
  public shared ({ caller }) func addWorkoutPlan(plan : WorkoutPlan) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add workout plans");
    };
    let id = nextWorkoutPlanId;
    let planWithId : WorkoutPlan = {
      id;
      dayLabel = plan.dayLabel;
      description = plan.description;
      exercises = plan.exercises;
    };
    workoutPlans.add(id, planWithId);
    nextWorkoutPlanId += 1;
    id;
  };

  public shared ({ caller }) func deleteWorkoutPlan(id : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete workout plans");
    };
    workoutPlans.remove(id);
  };

  public query func getWorkoutPlans() : async [WorkoutPlan] {
    workoutPlans.values().toArray();
  };

  // *** Complete Workout with Tier-based XP ***
  public shared ({ caller }) func completeWorkout() : async { xpGained : Nat } {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete workouts");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let scaling = getTierXpScaling(profile.tier);
    let xpGain = scaling.workout;
    await awardXp(caller, xpGain);
    { xpGained = xpGain };
  };

  // *** Complete Mission with Tier-based XP ***
  public shared ({ caller }) func completeMission(missionId : Text) : async { xpGained : Nat } {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete missions");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let scaling = getTierXpScaling(profile.tier);
    let xpGain = scaling.mission;
    await awardXp(caller, xpGain);
    { xpGained = xpGain };
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
  };

  // *** Diet Management ***
  public shared ({ caller }) func addDietEntry(entry : DietEntry) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add diet entries");
    };
    dietEntries.add(nextDietEntryId, entry);
    nextDietEntryId += 1;
  };

  public query ({ caller }) func getDietEntries() : async [DietEntry] {
    dietEntries.values().toArray();
  };

  public query ({ caller }) func getDietEntriesByCategory(category : Text) : async [DietEntry] {
    let allEntries = dietEntries.values().toArray();
    allEntries.filter(func(entry) { entry.category == category });
  };

  // *** Leaderboard ***
  public type LeaderboardEntry = {
    user : Principal;
    username : Text;
    xp : Nat;
    level : Nat;
    tier : Tier;
  };

  public query func getLeaderboard() : async [LeaderboardEntry] {
    let entries = profiles.entries().map(
      func((principal, profile)) : LeaderboardEntry {
        {
          user = principal;
          username = profile.username;
          xp = profile.xp;
          level = profile.level;
          tier = profile.tier;
        };
      }
    ).toArray();
    entries.sort(func(a, b) { Nat.compare(b.xp, a.xp) });
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
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
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

  // *** Multiplayer - Cross-device Battles ***
  public shared ({ caller }) func createBattle(code : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create battles");
    };
    if (battles.containsKey(code)) { Runtime.trap("Code already exists") };
    let battle : Battle = {
      code;
      creator = caller;
      challenger = null;
      creatorScore = 0;
      challengerScore = 0;
      status = #waiting;
      expiresAt = Time.now() + 20 * 60 * 1000000000; // 20 minutes nanoseconds
    };
    battles.add(code, battle);
  };

  public shared ({ caller }) func joinBattle(code : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join battles");
    };
    let battle = switch (battles.get(code)) {
      case (null) { Runtime.trap("Battle code not found") };
      case (?b) { b };
    };
    if (battle.creator == caller) { Runtime.trap("Cannot join your own battle") };
    if (battle.status != #waiting) { Runtime.trap("Battle already started") };
    let updated : Battle = {
      code = battle.code;
      creator = battle.creator;
      challenger = ?caller;
      creatorScore = battle.creatorScore;
      challengerScore = battle.challengerScore;
      status = battle.status;
      expiresAt = battle.expiresAt;
    };
    battles.add(code, updated);
  };

  public shared ({ caller }) func updateMyBattleScore(code : Text, score : Nat) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update battle scores");
    };
    let battle = switch (battles.get(code)) {
      case (null) { Runtime.trap("Battle not found") };
      case (?b) { b };
    };
    if (Time.now() > battle.expiresAt) { Runtime.trap("Battle expired") };
    let updated = switch (battle.challenger) {
      case (null) { Runtime.trap("Battle not started") };
      case (?challenger) {
        if (caller == battle.creator) {
          { battle with creatorScore = score };
        } else if (caller == challenger) {
          { battle with challengerScore = score };
        } else { Runtime.trap("Only participants can update scores") };
      };
    };
    battles.add(code, updated);
  };

  public query ({ caller }) func getBattle(code : Text) : async ?Battle {
    battles.get(code);
  };

  // *** Battle Chat ***
  public shared ({ caller }) func sendBattleChat(code : Text, text : Text) : async () {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send chat messages");
    };
    let battle = switch (battles.get(code)) {
      case (null) { Runtime.trap("Battle not found") };
      case (?b) { b };
    };
    // Verify caller is a participant
    let isParticipant = (caller == battle.creator) or (switch (battle.challenger) {
      case (null) { false };
      case (?c) { caller == c };
    });
    if (not isParticipant) { Runtime.trap("Only battle participants can chat") };

    let senderUsername = switch (profiles.get(caller)) {
      case (null) { "Unknown" };
      case (?p) { p.username };
    };

    let msg : BattleChatMessage = {
      id = nextChatId;
      battleCode = code;
      sender = caller;
      senderUsername;
      text;
      timestamp = Time.now();
    };
    nextChatId += 1;

    let msgs = switch (battleChats.get(code)) {
      case (null) { List.empty<BattleChatMessage>() };
      case (?m) { m };
    };
    msgs.add(msg);
    battleChats.add(code, msgs);
  };

  public query ({ caller }) func getBattleChats(code : Text) : async [BattleChatMessage] {
    switch (battleChats.get(code)) {
      case (null) { [] };
      case (?msgs) { msgs.toArray() };
    };
  };

  // *** Daily Streaks ***
  public type Streak = {
    currentStreak : Nat;
    lastActiveDate : Text;
  };

  public shared ({ caller }) func updateStreak(date : Text) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update streaks");
    };
    let current = switch (dailyStreaks.get(caller)) {
      case (null) { {
        lastActiveDate = date;
        currentStreak = 1;
      } };
      case (?s) {
        let streak = if (s.lastActiveDate != date) {
          {
            lastActiveDate = date;
            currentStreak = s.currentStreak + 1;
          };
        } else {
          s;
        };
        streak;
      };
    };
    dailyStreaks.add(caller, current);
    current.currentStreak;
  };

  public query ({ caller }) func getMyStreak() : async Streak {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view streaks");
    };
    switch (dailyStreaks.get(caller)) {
      case (null) { { currentStreak = 0; lastActiveDate = "" } };
      case (?s) { s };
    };
  };

  // *** Friends System ***
  public shared ({ caller }) func sendFriendRequest(to : Principal) : async { #ok; #err : Text } {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send friend requests");
    };
    if (to.isAnonymous()) { return #err("Invalid user") };
    if (caller == to) { return #err("Cannot add yourself") };

    let senderRequests = switch (pendingFriendRequests.get(caller)) {
      case (null) { List.empty<Principal>() };
      case (?friends) { friends };
    };
    let alreadyPending = senderRequests.toArray().find(func(p) { p == to });
    switch (alreadyPending) {
      case (?_) { return #err("Already pending") };
      case (null) {
        senderRequests.add(to);
        pendingFriendRequests.add(caller, senderRequests);
      };
    };
    #ok;
  };

  public shared ({ caller }) func acceptFriendRequest(from : Principal) : async { #ok; #err : Text } {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept friend requests");
    };
    let receiverRequests = switch (pendingFriendRequests.get(from)) {
      case (null) { List.empty<Principal>() };
      case (?friends) { friends };
    };
    let found = receiverRequests.toArray().find(func(p) { p == caller });
    switch (found) {
      case (null) { return #err("Friend request not found") };
      case (?_) {
        let filtered = receiverRequests.toArray().filter(func(p) { p != caller });
        pendingFriendRequests.add(from, List.fromArray(filtered));

        let receiverFriends = switch (friends.get(from)) {
          case (null) { List.empty<Principal>() };
          case (?f) { f };
        };
        receiverFriends.add(caller);
        friends.add(from, receiverFriends);
      };
    };
    #ok;
  };

  public shared ({ caller }) func declineFriendRequest(from : Principal) : async { #ok; #err : Text } {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can decline friend requests");
    };
    let receiverRequests = switch (pendingFriendRequests.get(from)) {
      case (null) { List.empty<Principal>() };
      case (?friends) { friends };
    };
    let found = receiverRequests.toArray().find(func(p) { p == caller });
    switch (found) {
      case (null) { return #err("Friend request not found") };
      case (?_) {
        let filtered = receiverRequests.toArray().filter(func(p) { p != caller });
        pendingFriendRequests.add(from, List.fromArray(filtered));
        #ok;
      };
    };
  };

  public query ({ caller }) func getMyFriendRequests() : async [Principal] {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view friend requests");
    };
    switch (pendingFriendRequests.get(caller)) {
      case (null) { [] };
      case (?friends) { friends.toArray() };
    };
  };

  public query ({ caller }) func getMyFriends() : async [Principal] {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view friends");
    };
    switch (friends.get(caller)) {
      case (null) { [] };
      case (?f) { f.toArray() };
    };
  };

  public query ({ caller }) func searchUserByUsername(username : Text) : async ?UserProfile {
    profiles.values().toArray().find(func(p) { p.username == username });
  };

  // *** Friends Leaderboard ***
  public query ({ caller }) func getFriendsLeaderboard() : async [UserProfile] {
    if (not (Authorization.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view friends leaderboard");
    };
    let friendsArray = switch (friends.get(caller)) {
      case (null) { [] };
      case (?f) { f.toArray() };
    };
    if (friendsArray.size() == 0) { return [] };
    let myProfile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    let allProfiles = Array.tabulate(
      friendsArray.size(), func(i) {
        let friend = friendsArray[i];
        switch (profiles.get(friend)) {
          case (null) { myProfile };
          case (?p) { p };
        };
      },
    );
    let leaderboard = Array.tabulate(allProfiles.size() + 1, func(i) {
      if (i == 0) { myProfile } else { allProfiles[i - 1] };
    });
    leaderboard.sort(func(a, b) { Nat.compare(b.xp, a.xp) });
  };
};
