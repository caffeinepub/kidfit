# KidFit

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- User authentication (login/signup with username and profile)
- XP and leveling system: users earn XP per workout session completed; levels progress through tiers (Bronze, Silver, Gold, Platinum, Diamond)
- Exercise library: empty placeholder sections for the owner to fill in later (bodyweight exercises, no gym equipment)
- Push-up counter: uses device camera to detect push-up motion automatically and count reps; completed sessions award XP
- Ad system: each user sees up to 6 ads per day, 1 ad per 30-minute interval; ads are placeholder banners; users with active ad-free rewards skip ads
- Free push-up tournaments: free to enter, push-up count tracked, winner earns XP bonus
- Paid tournaments: held every 2 months, entry fee 50 rupees via Stripe; 1st place gets 3 months ad-free, 2nd gets 2 months, 3rd gets 1 month ad-free
- Tournament leaderboard showing rankings and results
- Ad-free reward tracking per user (expiry date stored, checked on each session)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend (Motoko):
   - User profiles: username, XP, level, tier, adFreeUntil (timestamp)
   - XP system: addXP(userId, amount), getLevelFromXP(xp) -> tier/level
   - Ad tracking: recordAdView(userId), canShowAd(userId) -> bool (max 6/day, 1 per 30 min), isAdFree(userId) -> bool
   - Exercise library: placeholder structure for exercise categories and items (owner fills in)
   - Workout sessions: logSession(userId, exerciseId, reps) -> XP earned
   - Push-up sessions: logPushUpSession(userId, count) -> XP earned
   - Free tournaments: createFreeTournament, enterFreeTournament(userId), submitScore(userId, tournamentId, count), getLeaderboard(tournamentId), finalizeTournament(tournamentId) -> award XP to winner
   - Paid tournaments: createPaidTournament, enterPaidTournament(userId, paymentIntentId), submitScore, finalizePaidTournament -> grant adFreeReward to top 3
   - Stripe: payment intent creation for 50 rupees (INR) tournament entry

2. Frontend:
   - Home/dashboard: user stats (XP, level, tier, streak), daily ad counter
   - Exercise library page: categorized list (empty, ready to fill)
   - Push-up counter page: camera feed with motion detection using PoseNet or similar, live rep counter, session complete button
   - Tournaments page: list of active free and paid tournaments, enter button, leaderboard view
   - Profile page: XP progress bar, tier badge, ad-free status
   - Ad banner component: shown at timed intervals (every 30 min, max 6/day), hidden for ad-free users
   - Stripe checkout flow for paid tournament entry
