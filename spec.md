# TeenTuffLifts

## Current State
- Train section has 4 hardcoded workout plans (Tue–Fri) shown as flat cards
- Battle page has push-up counter, rep sync, and chat — no mic feature
- No fat loss plan, no yoga plan
- No categorization of Train content

## Requested Changes (Diff)

### Add
- Mic feature in battles: both players can mute/unmute themselves (no admin control). Uses Web Audio API / getUserMedia with a mute toggle button shown during active battle.
- Fat Loss Workout plan for teens (warm-up, HIIT-style exercises, cool-down stretching)
- Yoga plan (series of yoga poses with auto-timer, all timed holds)
- Train section tabs: "Home Workout", "Gym Goers", "Fat Loss", "Yoga"
- Gym Goers Workouts category with gym-adapted versions of existing plans

### Modify
- ExercisesPage.tsx: add tab navigation at top (Home Workout / Gym Goers / Fat Loss / Yoga), existing Tue–Fri plans go under Home Workout, new plans distributed across categories
- BattlePage.tsx: add mic toggle button in active battle state; request mic via getUserMedia, allow mute/unmute, show mic status indicator

### Remove
- Nothing removed

## Implementation Plan
1. Update ExercisesPage.tsx:
   - Add tab UI at top with 4 categories
   - Existing 4 plans (Tue–Fri) → Home Workout tab
   - Create Gym Goers plans (Chest Day, Back Day, Leg Day using gym equipment)
   - Create Fat Loss plan (Jumping Jacks, Burpees, High Knees, Mountain Climbers, Jump Squats, Push-Ups, Plank, cool-down)
   - Create Yoga plan (Tadasana, Downward Dog, Warrior I & II, Tree Pose, Child's Pose, Cobra, Cat Cow, Savasana — all timed)
   - Yoga tab shows only Yoga plan; Fat Loss tab shows fat loss plan; Gym Goers shows gym plans
2. Update BattlePage.tsx:
   - On battle start, request mic access via getUserMedia (audio only)
   - Store mic stream in ref; add isMuted state (default muted)
   - Add mic toggle button in active battle UI (microphone/mute icon)
   - When muted: disable audio tracks; when unmuted: enable audio tracks
   - Show current mic status (muted/live) as a small indicator
