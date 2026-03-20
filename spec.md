# TeenTuffLifts

## Current State
Full-stack teen fitness app with XP/rank system, push-up counter, battles, workout plans in 4 Train tabs, diet, leaderboard, daily missions, avatar, coins, and premium subscription. Backend has user profiles, missions, coins, avatars, premium. Frontend has 12 pages with bottom nav.

## Requested Changes (Diff)

### Add
- **Daily Streaks**: Track consecutive days user logs in or completes a workout. Store last active date and streak count per user. Display on home and profile.
- **Friends System**: Users can search other users by username, send/accept/decline friend requests. Friends list stored per user.
- **Friends Leaderboard**: Separate page showing only the user's friends ranked by XP (plus the user themselves).
- **XP Scaling per Rank**: After each tier unlock, workout XP increases by +20 and mission XP increases by +10. Bronze=50/40, Silver=70/50, Gold=90/60, Platinum=110/70, Diamond=130/80.

### Modify
- Backend: Add friends, friend requests, streak tracking, rank-based XP logic.
- Leaderboard page: Add tabs for Global and Friends views.
- Profile page: Show current streak prominently.
- Home page: Show streak badge.
- BottomNav / App: Add Friends page navigation.

### Remove
- Nothing removed.

## Implementation Plan
1. Update app.mo: add friend request/accept/decline/list APIs, streak tracking (updateStreak, getStreak), search users by username, getFriendsLeaderboard.
2. Update backend.d.ts with new types and methods.
3. Create FriendsPage.tsx: search bar, friend requests inbox, friends list.
4. Update LeaderboardPage.tsx: add Global/Friends tabs.
5. Update ProfilePage.tsx: show streak count.
6. Update HomePage.tsx: show streak badge.
7. Update App.tsx and BottomNav.tsx: add friends page.
