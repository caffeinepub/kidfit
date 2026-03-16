# TeenTuffLifts — Stage B

## Current State

The app has a fully working fitness platform with:
- User registration/login, XP/tier progression, leaderboard
- Push-up counter with camera-based detection (stricter logic, manual rep button)
- Real-time push-up battles with cross-device invite codes, battle chat, mic
- Daily missions, free and paid tournaments, ads system
- Train section with 4 workout tabs (Home, Gym, Fat Loss, Yoga) including step-by-step flow, AI images, timers
- Veg diet paid (₹40/week via Stripe); non-veg diet removed
- Profile stats gated by rewarded ad
- UserProfile has: xp, tier, level, adFreeUntil, username
- Backend: addXp, completeMission, logWorkoutSession, Stripe checkout, battle CRUD, tournament CRUD

## Requested Changes (Diff)

### Add
- **Coin system**: Users earn coins (10 per completed workout); coins stored per user in backend
- **XP per workout**: 50 XP awarded when user completes a workout plan (taps "Finish Workout")
- **Rewarded ad for bonus coins**: After finishing a workout, user can watch ad for 10% more coins (1 extra coin)
- **Avatar system**: AvatarProfile stored per user with: skinTone (Text), hairStyle (Text), hairColor (Text), facePart (Text), outfit (Text), accessory (Text)
- **Avatar shop**: Users can spend coins to unlock outfits and hairstyles; items cost 30 coins each; OwnedItems list stored per user in backend
- **Avatar page/tab**: New page accessible from profile where user customizes their avatar visually (CSS-based character, not 3D)
- **Premium subscription** (₹375/month via Stripe): isPremium flag stored per user with premiumUntil timestamp; premium users get: non-veg diet access, 20% XP boost on missions/battles/tournaments, 20% coin boost on workouts, no ads, advanced gym splits + HIIT plans in Train section
- **Advanced/HIIT workout plans**: 2 new premium workout plan groups added to Gym/Home tabs (visible only to premium users)
- **Non-veg diet**: Accessible only for premium users (no standalone purchase); diet entries with category "nonveg" shown only to premium users

### Modify
- **UserProfile** backend type: add coins (Nat), premiumUntil (Int/Time), ownedItems (Array<Text>), avatarSkinTone (Text), avatarHair (Text), avatarHairColor (Text), avatarFace (Text), avatarOutfit (Text), avatarAccessory (Text)
- **completeWorkout** new function (or reuse logWorkoutSession): awards 50 XP + 10 coins (boosted by 20% if premium)
- **DietPage**: Add non-veg section but gate it behind premium check; show "Upgrade to Premium" CTA if not premium
- **ProfilePage**: Show coins balance, avatar preview, link to avatar customizer
- **Leaderboard**: Show avatar preview beside username

### Remove
- Nothing removed in this stage

## Implementation Plan

1. **Backend**: Update UserProfile type to include coins, premiumUntil, ownedItems, avatar fields. Add functions: completeWorkout (awards XP + coins with premium boost), purchaseAvatarItem (deducts coins, adds item to ownedItems), saveAvatarCustomization (stores avatar fields), getPremiumStatus, purchasePremium (Stripe checkout for ₹375/month = 37500 paise).
2. **Frontend - Avatar page**: New AvatarPage with CSS-based character preview (layered divs/emoji for skin, hair, outfit, accessory, face). Tabs: Customize (pick from unlocked options) and Shop (buy new items with coins).
3. **Frontend - ProfilePage update**: Show coin balance with coin icon, avatar preview widget, link/button to open AvatarPage.
4. **Frontend - DietPage update**: Add non-veg tab, gate with premium check; show upgrade CTA for non-premium users.
5. **Frontend - Premium page/modal**: Stripe checkout for ₹375/month. Show perks: both diets, 20% XP boost, 20% coin boost, no ads, premium workout plans.
6. **Frontend - Train section**: Add 2 premium workout plan groups (Advanced HIIT + Advanced Gym Splits) visible only to premium users, locked behind upgrade CTA otherwise.
7. **Frontend - Workout completion**: When user taps "Finish Workout", call completeWorkout backend, show XP + coins earned, offer rewarded ad for +10% coins bonus.
8. **Frontend - Leaderboard**: Show small avatar circle beside username.
