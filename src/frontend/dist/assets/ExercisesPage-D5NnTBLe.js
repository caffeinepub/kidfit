import { c as createLucideIcon, r as reactExports, d as useCategories, e as useExercisesByCategory, f as useLogWorkoutSession, g as Difficulty, j as jsxRuntimeExports, D as Dumbbell, u as ue, h as useActor, i as useMutation } from "./index-wWxEgrGs.js";
import { B as Badge } from "./badge-B2DOSqvg.js";
import { B as Button } from "./button-BNiSM2VH.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-DGTunPoP.js";
import { I as Input } from "./input-DLd1N_vF.js";
import { S as Skeleton } from "./skeleton-3JbPUFVm.js";
import { R as RewardedAdModal } from "./RewardedAdModal-9pBu7ltt.js";
import { A as ArrowLeft } from "./arrow-left-DxMDyUM0.js";
import { m as motion } from "./proxy-Bj4tvbkF.js";
import { P as Plus } from "./plus-TLvDYpKp.js";
import { Z as Zap } from "./zap-CRtUD7i2.js";
import { X } from "./x-DLFPGvHf.js";
import { A as AnimatePresence } from "./index-XnM18BlU.js";
import "./index-DekapTDg.js";
import "./index-UMV473YT.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function getExerciseImage(name) {
  const n = name.toLowerCase();
  if (n.includes("jumping jack"))
    return "/assets/generated/exercise-jumping-jacks.dim_400x400.jpg";
  if (n.includes("declined push"))
    return "/assets/generated/exercise-declined-pushups.dim_400x400.jpg";
  if (n.includes("inclined push"))
    return "/assets/generated/exercise-inclined-pushups.dim_400x400.jpg";
  if (n.includes("push up") || n.includes("push-up"))
    return "/assets/generated/exercise-pushups.dim_400x400.jpg";
  if (n.includes("alternate curl"))
    return "/assets/generated/exercise-alternate-curls.dim_400x400.jpg";
  if (n.includes("hammer curl") && (n.includes("altern") || n.includes("alternating")))
    return "/assets/generated/hammer-curls-alternating.dim_800x500.png";
  if (n.includes("bicep curl") && n.includes("both"))
    return "/assets/generated/exercise-bicep-curls-both.dim_400x400.jpg";
  if (n.includes("hammer curl") && n.includes("both"))
    return "/assets/generated/hammer-curls-both-hands.dim_800x500.png";
  if (n.includes("chair dip"))
    return "/assets/generated/exercise-chair-dips.dim_400x400.jpg";
  if (n.includes("skull crusher"))
    return "/assets/generated/exercise-skull-crushers.dim_400x400.jpg";
  if (n.includes("cobra"))
    return "/assets/generated/exercise-cobra-pose.dim_400x400.jpg";
  if (n.includes("cat cow"))
    return "/assets/generated/exercise-cat-cow-pose.dim_400x400.jpg";
  if ((n.includes("tadasana") || n.includes("mountain pose")) && !n.includes("mountain climber"))
    return "/assets/generated/exercise-tadasana.dim_400x400.jpg";
  if (n.includes("crucifix"))
    return "/assets/generated/exercise-crucifix-crunches.dim_400x400.jpg";
  if (n.includes("hollow body"))
    return "/assets/generated/exercise-hollow-body-hold.dim_400x400.jpg";
  if (n.includes("hanging leg raise"))
    return "/assets/generated/exercise-hanging-leg-raises.dim_400x400.jpg";
  if (n.includes("leg raise"))
    return "/assets/generated/exercise-leg-raises.dim_400x400.jpg";
  if (n.includes("side plank"))
    return "/assets/generated/exercise-side-plank-raises.dim_400x400.jpg";
  if (n.includes("leaning back row"))
    return "/assets/generated/exercise-leaning-back-rows.dim_400x400.jpg";
  if (n.includes("low back row"))
    return "/assets/generated/exercise-single-dumbbell-rows.dim_400x400.jpg";
  if (n.includes("leaning rear fly") || n.includes("leaning rear flye"))
    return "/assets/generated/exercise-leaning-rear-flyes.dim_400x400.jpg";
  if (n.includes("rear delt fly") || n.includes("rear delt flye"))
    return "/assets/generated/exercise-alt-rear-delt-flyes.dim_400x400.jpg";
  if (n.includes("front raise"))
    return "/assets/generated/exercise-front-raises.dim_400x400.jpg";
  if (n.includes("lateral raise"))
    return "/assets/generated/exercise-lateral-raises.dim_400x400.jpg";
  if (n.includes("goblet squat"))
    return "/assets/generated/exercise-goblet-squats.dim_400x400.jpg";
  if (n.includes("sumo squat"))
    return "/assets/generated/exercise-sumo-squats.dim_400x400.jpg";
  if (n.includes("calf raise"))
    return "/assets/generated/exercise-calf-raises.dim_400x400.jpg";
  if (n.includes("bulgarian"))
    return "/assets/generated/exercise-bulgarian-squats.dim_400x400.jpg";
  if (n.includes("romanian deadlift"))
    return "/assets/generated/exercise-romanian-deadlifts.dim_400x400.jpg";
  if (n.includes("burpee"))
    return "/assets/generated/exercise-burpees.dim_400x400.jpg";
  if (n.includes("high knee"))
    return "/assets/generated/exercise-high-knees.dim_400x400.jpg";
  if (n.includes("mountain climber"))
    return "/assets/generated/exercise-mountain-climbers.dim_400x400.jpg";
  if (n.includes("jump squat"))
    return "/assets/generated/exercise-jump-squats.dim_400x400.jpg";
  if (n.includes("plank hold"))
    return "/assets/generated/exercise-plank-hold.dim_400x400.jpg";
  if (n.includes("downward dog"))
    return "/assets/generated/exercise-downward-dog.dim_400x400.jpg";
  if (n.includes("warrior i") && !n.includes("warrior ii"))
    return "/assets/generated/exercise-warrior-1.dim_400x400.jpg";
  if (n.includes("warrior ii"))
    return "/assets/generated/exercise-warrior-2.dim_400x400.jpg";
  if (n.includes("tree pose"))
    return "/assets/generated/exercise-tree-pose.dim_400x400.jpg";
  if (n.includes("child") || n.includes("balasana"))
    return "/assets/generated/exercise-childs-pose.dim_400x400.jpg";
  if (n.includes("seated forward bend"))
    return "/assets/generated/exercise-seated-forward-bend.dim_400x400.jpg";
  if (n.includes("savasana") || n.includes("corpse pose"))
    return "/assets/generated/exercise-savasana.dim_400x400.jpg";
  if (n.includes("barbell bench press"))
    return "/assets/generated/exercise-barbell-bench-press.dim_400x400.jpg";
  if (n.includes("incline dumbbell press") || n.includes("incline db press"))
    return "/assets/generated/exercise-incline-db-press.dim_400x400.jpg";
  if (n.includes("cable fly"))
    return "/assets/generated/exercise-cable-fly.dim_400x400.jpg";
  if (n.includes("dips") && !n.includes("chair"))
    return "/assets/generated/exercise-dips.dim_400x400.jpg";
  if (n.includes("barbell curl"))
    return "/assets/generated/exercise-barbell-curl.dim_400x400.jpg";
  if (n.includes("incline dumbbell curl") || n.includes("incline db curl"))
    return "/assets/generated/exercise-incline-db-curl.dim_400x400.jpg";
  if (n.includes("close-grip bench") || n.includes("close grip bench"))
    return "/assets/generated/exercise-close-grip-bench.dim_400x400.jpg";
  if (n.includes("tricep rope") || n.includes("rope pushdown"))
    return "/assets/generated/exercise-tricep-rope-pushdown.dim_400x400.jpg";
  if (n.includes("deadlift") && !n.includes("romanian") && !n.includes("single dumbbell"))
    return "/assets/generated/exercise-deadlift.dim_400x400.jpg";
  if (n.includes("pull-up") || n.includes("pull up") || n.includes("pullup"))
    return "/assets/generated/exercise-pullups.dim_400x400.jpg";
  if (n.includes("barbell row"))
    return "/assets/generated/exercise-barbell-rows.dim_400x400.jpg";
  if (n.includes("seated cable row"))
    return "/assets/generated/exercise-seated-cable-row.dim_400x400.jpg";
  if (n.includes("overhead barbell press"))
    return "/assets/generated/exercise-overhead-barbell-press.dim_400x400.jpg";
  if (n.includes("face pull"))
    return "/assets/generated/exercise-face-pulls.dim_400x400.jpg";
  if (n.includes("cable crunch"))
    return "/assets/generated/exercise-cable-crunch.dim_400x400.jpg";
  if (n.includes("decline sit"))
    return "/assets/generated/exercise-decline-situps.dim_400x400.jpg";
  if (n.includes("plank") && !n.includes("side") && !n.includes("hold"))
    return "/assets/generated/exercise-plank.dim_400x400.jpg";
  if (n.includes("standing calf raise"))
    return "/assets/generated/exercise-standing-calf-raises.dim_400x400.jpg";
  if (n.includes("seated calf raise"))
    return "/assets/generated/exercise-seated-calf-raises.dim_400x400.jpg";
  if (n.includes("donkey calf raise"))
    return "/assets/generated/exercise-donkey-calf-raises.dim_400x400.jpg";
  if (n.includes("hip thrust"))
    return "/assets/generated/exercise-barbell-hip-thrust.dim_400x400.jpg";
  if (n.includes("bulgarian split squat") || n.includes("bulgarian") && n.includes("split"))
    return "/assets/generated/exercise-bulgarian-split-squat.dim_400x400.jpg";
  if (n.includes("glute bridge"))
    return "/assets/generated/exercise-glute-bridge.dim_400x400.jpg";
  if (n.includes("cable kickback"))
    return "/assets/generated/exercise-cable-kickbacks.dim_400x400.jpg";
  if (n.includes("back extension"))
    return "/assets/generated/exercise-back-extensions.dim_400x400.jpg";
  if (n.includes("good morning"))
    return "/assets/generated/exercise-good-mornings.dim_400x400.jpg";
  if (n.includes("arm circle"))
    return "/assets/generated/exercise-arm-circles.dim_400x400.jpg";
  if (n.includes("hammer curl"))
    return "/assets/generated/hammer-curls-alternating.dim_800x500.png";
  return null;
}
function getExerciseInstructions(name) {
  const n = name.toLowerCase();
  if (n.includes("hammer curl") && (n.includes("altern") || n.includes("alternating")))
    return [
      "Stand upright, hold a dumbbell in each hand with palms facing inward (neutral grip, thumbs up)",
      "Curl one arm up toward your shoulder while keeping the other straight",
      "Lower slowly and alternate arms",
      "Keep elbows pinned to your sides throughout"
    ];
  if (n.includes("hammer curl") && n.includes("both"))
    return [
      "Stand upright, hold a dumbbell in each hand with neutral grip (thumbs pointing up)",
      "Curl BOTH dumbbells up toward your shoulders at the same time",
      "Squeeze at the top, then lower slowly",
      "Keep elbows pinned to sides — do not swing"
    ];
  if (n.includes("hammer curl"))
    return [
      "Stand upright, hold a dumbbell in each hand with neutral grip (thumbs pointing up)",
      "Curl one arm up toward your shoulder while keeping the other straight",
      "Lower slowly and alternate arms",
      "Keep elbows pinned to your sides throughout"
    ];
  if (n.includes("leaning back row"))
    return [
      "Stand with feet shoulder-width apart and lean your upper body slightly backward (~20-30 degrees)",
      "Hold dumbbells in both hands hanging in front of you",
      "Pull both dumbbells up toward your hips in a rowing motion",
      "Squeeze shoulder blades together at the top, lower slowly"
    ];
  if (n.includes("hanging leg raise"))
    return [
      "Hang from a pull-up bar with arms fully extended, grip slightly wider than shoulders",
      "Keep your body straight and core tight",
      "Raise both legs up until they are parallel to the floor (or higher)",
      "Lower slowly — do not swing your body for momentum"
    ];
  if (n.includes("cable crunch"))
    return [
      "Kneel in front of the cable machine, grip the rope attachment with both hands at either side of your head",
      "Keep hips stationary — do not sit back",
      "Crunch your upper body downward toward your knees by contracting your abs",
      "Slowly return to starting position while keeping tension on the cable"
    ];
  if (n.includes("donkey calf raise"))
    return [
      "Bend forward at the hips (~90 degrees) with hands resting on a bench or support",
      "Keep legs straight and rise up onto the balls of your feet",
      "Hold at the top for 1 second squeezing the calves",
      "Lower slowly for full range of motion"
    ];
  if (n.includes("burpee"))
    return [
      "Start standing — drop your hands to the floor and jump both feet back to a push-up position",
      "Perform one push-up (chest to floor)",
      "Jump your feet forward toward your hands",
      "Explosively jump up with arms raised overhead — that is one full rep"
    ];
  if (n.includes("jumping jack"))
    return [
      "Stand upright with feet together and arms at your sides",
      "Jump feet out wide while raising arms overhead",
      "Jump back to starting position",
      "Maintain a steady rhythm throughout"
    ];
  if (n.includes("declined push"))
    return [
      "Place your feet on an elevated surface (chair or bench) with hands on the floor",
      "Lower your chest toward the floor",
      "Push back up keeping body straight",
      "Targets upper chest and front shoulders"
    ];
  if (n.includes("inclined push"))
    return [
      "Place hands on an elevated surface (bench or chair)",
      "Lower your chest toward the surface",
      "Push back up",
      "Easier variation — good for building foundational strength"
    ];
  if (n.includes("push up") || n.includes("push-up"))
    return [
      "Start in a high plank — hands slightly wider than shoulder-width",
      "Lower your chest to the floor keeping body in a straight line",
      "Push back up to starting position",
      "Keep core tight — do not let hips sag"
    ];
  if (n.includes("alternate curl"))
    return [
      "Stand holding a dumbbell in each hand with palms facing forward",
      "Curl one arm up toward your shoulder",
      "Lower and repeat on the other side",
      "Keep upper arms stationary — only forearms move"
    ];
  if (n.includes("bicep curl") && n.includes("both"))
    return [
      "Hold a dumbbell in each hand, palms facing forward",
      "Curl both arms up toward your shoulders simultaneously",
      "Squeeze biceps at the top",
      "Lower slowly — full range of motion"
    ];
  if (n.includes("chair dip"))
    return [
      "Place hands on the edge of a chair behind you, legs extended",
      "Lower your body by bending elbows to about 90 degrees",
      "Push back up to starting position",
      "Keep back close to the chair throughout"
    ];
  if (n.includes("skull crusher"))
    return [
      "Stand and hold one dumbbell overhead with both hands (or one in each hand)",
      "Lower the weight behind your head by bending elbows",
      "Extend arms back overhead, squeezing triceps",
      "Keep upper arms close to head — only elbows move"
    ];
  if (n.includes("cobra"))
    return [
      "Lie face down with hands under shoulders",
      "Press up lifting chest off floor, keeping hips down",
      "Hold and breathe deeply",
      "Stretches the lower back and abdomen"
    ];
  if (n.includes("cat cow"))
    return [
      "Start on hands and knees in tabletop position",
      "Cow: drop belly toward floor, lift head and tailbone (inhale)",
      "Cat: round spine toward ceiling, tuck chin to chest (exhale)",
      "Flow between both smoothly with breath"
    ];
  if (n.includes("child") || n.includes("balasana"))
    return [
      "Kneel and sit back on heels, then fold forward stretching arms out",
      "Rest forehead on the floor",
      "Breathe deeply, relaxing the lower back and hips",
      "Hold the stretch — do not force it"
    ];
  if (n.includes("crucifix"))
    return [
      "Lie on your back with arms extended out to sides like a cross",
      "Lift one knee and rotate to touch the opposite hand",
      "Alternate sides in a controlled motion",
      "Keep shoulders on the floor as much as possible"
    ];
  if (n.includes("hollow body"))
    return [
      "Lie on your back and press lower back into the floor",
      "Lift shoulders and legs off the floor keeping arms overhead or at sides",
      "Hold the position with core braced",
      "Do not let lower back arch off the floor"
    ];
  if (n.includes("side plank"))
    return [
      "Start in a side plank — one forearm on floor, body in straight line",
      "Dip your hip to the floor, then raise back up",
      "Keep core braced throughout",
      "Complete all reps on one side before switching"
    ];
  if (n.includes("leg raise"))
    return [
      "Lie flat on your back with legs straight",
      "Keep arms at sides and lower back pressed to floor",
      "Raise legs to 90 degrees, lower slowly",
      "Do not let legs touch the floor between reps"
    ];
  if (n.includes("leaning rear fly") || n.includes("leaning rear flye"))
    return [
      "Hinge forward at hips, dumbbells hanging in front of you",
      "Raise both arms out to the sides with slight elbow bend",
      "Squeeze rear deltoids at the top",
      "Lower slowly — control the weight"
    ];
  if (n.includes("rear delt fly") || n.includes("alternative rear") || n.includes("alt rear"))
    return [
      "Hinge forward at hips, raise one arm out to the side at a time",
      "Alternate sides, squeezing rear delt at the top",
      "Keep torso still throughout",
      "Light weight, focus on the squeeze"
    ];
  if (n.includes("front raise"))
    return [
      "Stand holding dumbbells in front of thighs, palms down",
      "Raise arms straight in front of you to shoulder height",
      "Lower slowly",
      "Keep core tight — avoid using momentum"
    ];
  if (n.includes("lateral raise"))
    return [
      "Stand holding dumbbells at sides, palms facing inward",
      "Raise arms out to sides to shoulder height",
      "Lower slowly with control",
      "Slight bend in elbows — do not shrug shoulders"
    ];
  if (n.includes("goblet squat"))
    return [
      "Hold a dumbbell vertically at chest height with both hands",
      "Stand feet slightly wider than shoulder-width, toes turned out",
      "Squat down keeping chest up and elbows inside knees",
      "Drive through heels to return to standing"
    ];
  if (n.includes("sumo squat"))
    return [
      "Stand with feet wider than shoulder-width, toes pointed out",
      "Hold a dumbbell in front for balance or hands at sides",
      "Squat down keeping knees tracking over toes",
      "Focus on inner thighs and glutes"
    ];
  if (n.includes("seated calf raise"))
    return [
      "Sit on bench with weight on thighs, balls of feet on edge",
      "Lower heels toward floor for full stretch",
      "Rise up on toes as high as possible",
      "Keep movement slow and controlled"
    ];
  if (n.includes("standing calf raise"))
    return [
      "Stand with feet hip-width on a step edge (heels hanging off)",
      "Rise onto balls of feet as high as possible",
      "Lower heels below step level for full stretch",
      "Slow and controlled movements"
    ];
  if (n.includes("calf raise"))
    return [
      "Stand with feet shoulder-width apart",
      "Rise onto the balls of your feet as high as possible",
      "Hold briefly at the top",
      "Lower slowly for full stretch"
    ];
  if (n.includes("bulgarian split squat"))
    return [
      "Place rear foot elevated on bench, hold dumbbells at sides",
      "Lower back knee toward floor",
      "Front knee should stay over front foot",
      "Push through front heel to return"
    ];
  if (n.includes("bulgarian"))
    return [
      "Place one foot elevated behind you on a bench or chair",
      "Lower your back knee toward the floor in a lunge",
      "Front knee stays over the front foot",
      "Push through front heel to stand back up"
    ];
  if (n.includes("romanian deadlift"))
    return [
      "Hold dumbbells in front of thighs, slight bend in knees",
      "Hinge at hips pushing them back, lower weights along legs",
      "Feel the stretch in hamstrings at the bottom",
      "Drive hips forward to return to standing"
    ];
  if (n.includes("barbell bench press"))
    return [
      "Lie on bench, grip bar slightly wider than shoulders",
      "Lower bar to mid-chest with elbows at 45-75 degrees",
      "Press bar up until arms are fully extended",
      "Keep feet flat and back slightly arched"
    ];
  if (n.includes("incline dumbbell press"))
    return [
      "Sit on incline bench (30-45 degrees), dumbbells at shoulder height",
      "Press both dumbbells up and slightly inward",
      "Lower slowly to starting position",
      "Targets upper chest"
    ];
  if (n.includes("cable fly"))
    return [
      "Stand centered between two cable machines with handles at chest height",
      "Grip handles and bring arms forward in an arc motion",
      "Squeeze chest at the peak of the movement",
      "Slowly return to starting position"
    ];
  if (n.includes("dips") && !n.includes("chair"))
    return [
      "Grip parallel bars and hold yourself up with arms straight",
      "Lower body by bending elbows until upper arms are parallel to floor",
      "Press back up to starting position",
      "Lean slightly forward to target chest"
    ];
  if (n.includes("incline dumbbell curl"))
    return [
      "Sit on incline bench, dumbbells hanging at sides",
      "Curl both arms up, elbows stay behind torso",
      "Greater stretch at bottom than standing curls",
      "Lower slowly for full range of motion"
    ];
  if (n.includes("barbell curl"))
    return [
      "Stand with barbell, underhand grip shoulder-width",
      "Curl bar up toward shoulders keeping elbows at sides",
      "Squeeze at the top",
      "Lower slowly"
    ];
  if (n.includes("close-grip bench") || n.includes("close grip bench"))
    return [
      "Grip barbell with hands about shoulder-width (narrower than bench press)",
      "Lower bar to lower chest",
      "Keep elbows close to body",
      "Press up — targets triceps"
    ];
  if (n.includes("tricep rope") || n.includes("rope pushdown"))
    return [
      "Grip rope attachment on high cable with both hands",
      "Keep elbows pinned at sides",
      "Push rope down until arms fully extended, spreading rope slightly at bottom",
      "Slowly return to starting position"
    ];
  if (n.includes("deadlift") && !n.includes("romanian"))
    return [
      "Stand with bar over feet, hip-width stance",
      "Grip bar just outside legs, flat back",
      "Push floor away and lift bar keeping it close to body",
      "Lock hips at top — reverse movement to lower"
    ];
  if (n.includes("pull-up") || n.includes("pull up") || n.includes("pullup"))
    return [
      "Hang from bar with overhand grip, slightly wider than shoulders",
      "Pull yourself up until chin clears the bar",
      "Lower slowly with control",
      "Dead hang at the bottom before each rep"
    ];
  if (n.includes("barbell row"))
    return [
      "Hinge forward holding barbell, back flat, looking down",
      "Pull bar to lower chest/upper abs",
      "Squeeze shoulder blades together",
      "Lower slowly"
    ];
  if (n.includes("seated cable row"))
    return [
      "Sit at cable row machine, feet on platform, grab handle",
      "Pull handle to your lower abs, squeezing shoulder blades",
      "Keep back upright and core tight",
      "Slowly extend arms back to starting position"
    ];
  if (n.includes("overhead barbell press"))
    return [
      "Stand with barbell at upper chest, grip shoulder-width",
      "Press bar overhead until arms fully extended",
      "Lower slowly to collarbone",
      "Keep core braced throughout"
    ];
  if (n.includes("face pull"))
    return [
      "Attach rope to high cable, pull toward face splitting the rope",
      "Elbows go out and back at shoulder height",
      "Squeeze rear delts at the peak",
      "Great for shoulder health and posture"
    ];
  if (n.includes("decline sit"))
    return [
      "Secure feet on decline bench, hands behind head or crossed on chest",
      "Lower back toward the bench with control",
      "Rise back up contracting abs",
      "Do not pull on neck — use core"
    ];
  if (n.includes("plank hold"))
    return [
      "Hold push-up or forearm plank position",
      "Body should form a straight line",
      "Brace every muscle — core, glutes, quads",
      "Focus on breathing — do not hold breath"
    ];
  if (n.includes("plank") && !n.includes("side"))
    return [
      "Hold a push-up position with arms straight or on forearms",
      "Keep body in a straight line from head to heels",
      "Brace core, glutes, and quads",
      "Breathe steadily — do not hold breath"
    ];
  if (n.includes("standing calf raise"))
    return [
      "Stand with feet hip-width on a step edge (heels hanging off)",
      "Rise onto balls of feet as high as possible",
      "Lower heels below step level for full stretch",
      "Slow and controlled movements"
    ];
  if (n.includes("hip thrust"))
    return [
      "Sit with upper back on bench, barbell over hips",
      "Drive hips up by squeezing glutes until body is in a straight line",
      "Hold at top for a second",
      "Lower slowly — do not touch floor between reps"
    ];
  if (n.includes("glute bridge"))
    return [
      "Lie on back, knees bent, feet flat on floor",
      "Drive hips up by squeezing glutes",
      "Hold at top, then lower slowly",
      "Keep core braced throughout"
    ];
  if (n.includes("cable kickback"))
    return [
      "Face cable machine, attach ankle strap, hinge slightly at hip",
      "Kick leg straight back squeezing glute at the top",
      "Lower slowly",
      "Keep hips square — do not rotate"
    ];
  if (n.includes("back extension"))
    return [
      "Lie face down on a hyperextension bench or floor",
      "Lower torso toward floor, then raise back to parallel",
      "Squeeze lower back muscles at the top",
      "Keep movement controlled — avoid hyperextending"
    ];
  if (n.includes("good morning"))
    return [
      "Stand with barbell on upper back or hands behind head",
      "Hinge forward at hips keeping back flat",
      "Lower until torso is near parallel to floor",
      "Drive hips forward to return to standing"
    ];
  if (n.includes("arm circle"))
    return [
      "Extend arms out to sides",
      "Make controlled circular motions",
      "Reverse direction halfway through",
      "Great shoulder warm-up"
    ];
  if (n.includes("mountain climber"))
    return [
      "Start in high plank position",
      "Drive one knee toward chest, then quickly switch legs",
      "Keep hips level and core tight",
      "Maintain a steady pace"
    ];
  if (n.includes("jump squat"))
    return [
      "Stand feet shoulder-width, squat down halfway",
      "Explode up jumping off the floor",
      "Land softly with knees bent",
      "Immediately go into the next rep"
    ];
  if (n.includes("high knee"))
    return [
      "Stand and run in place driving knees up to hip height",
      "Pump arms in coordination with legs",
      "Stay on the balls of your feet",
      "Keep a fast steady rhythm"
    ];
  if (n.includes("downward dog"))
    return [
      "Start on hands and knees, push hips up and back",
      "Straighten legs as much as comfortable, heels reach toward floor",
      "Head between arms, spine long",
      "Hold and breathe deeply"
    ];
  if (n.includes("warrior i") && !n.includes("warrior ii"))
    return [
      "Step one foot forward in a lunge, back foot angled 45 degrees",
      "Bend front knee over ankle",
      "Raise arms overhead, square hips forward",
      "Hold and breathe"
    ];
  if (n.includes("warrior ii"))
    return [
      "Stand in a wide stance, front foot pointing forward, back foot 90 degrees",
      "Bend front knee over ankle",
      "Extend arms out to sides at shoulder height",
      "Gaze over front hand"
    ];
  if (n.includes("tree pose"))
    return [
      "Stand on one leg, place the other foot on inner thigh or calf (not knee)",
      "Bring hands to prayer at chest or raise overhead",
      "Fix gaze on a still point for balance",
      "Hold, then switch sides"
    ];
  if (n.includes("seated forward bend"))
    return [
      "Sit with legs extended straight",
      "Hinge at hips reaching hands toward feet",
      "Keep back as flat as possible",
      "Hold and breathe — do not bounce"
    ];
  if (n.includes("savasana") || n.includes("corpse pose"))
    return [
      "Lie flat on back, arms at sides, palms up",
      "Close eyes and relax every muscle",
      "Breathe naturally",
      "Full body recovery pose — hold for 1-2 minutes"
    ];
  if (n.includes("low back row"))
    return [
      "Hinge forward with a flat back, dumbbell in one hand",
      "Pull the dumbbell up toward your hip",
      "Keep elbow close to body throughout",
      "Lower slowly, full stretch at bottom"
    ];
  return [
    "Focus on controlled form over speed",
    "Breathe steadily throughout",
    "Rest if you feel sharp pain"
  ];
}
const WORKOUT_PLANS = [
  {
    id: "tuesday",
    category: "home",
    title: "CHEST, BICEPS & TRICEPS WORKOUT (TEENS)",
    day: "Tuesday",
    emoji: "💪",
    description: "No gym needed — use bags or something heavy with a good grip instead of dumbbells",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Declined Push Ups", type: "STRENGTH", sets: 3, reps: "15 reps" },
      { name: "Push Ups", type: "STRENGTH", sets: 3, reps: "20 reps" },
      { name: "Inclined Push Ups", type: "STRENGTH", sets: 2, reps: "25 reps" },
      { name: "Alternate Curls", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Hammer Curls (Alternating)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Bicep Curls (Both Hands)",
        type: "STRENGTH",
        sets: 2,
        reps: "6–8 reps"
      },
      {
        name: "Hammer Curls (Both Hands)",
        type: "STRENGTH",
        sets: 2,
        reps: "6–8 reps"
      },
      { name: "Chair Dips", type: "STRENGTH", sets: 2, reps: "30 reps" },
      {
        name: "Overhead Skull Crushers",
        type: "STRENGTH",
        sets: 2,
        reps: "12 reps"
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  },
  {
    id: "wednesday",
    category: "home",
    title: "ABS WORKOUT",
    day: "Wednesday",
    emoji: "🔥",
    description: "Core-focused bodyweight training — no equipment needed",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Crucifix Crunches", type: "STRENGTH", sets: 3, reps: "12 reps" },
      {
        name: "Hollow Body Hold",
        type: "STRENGTH",
        sets: 3,
        reps: "30 sec hold"
      },
      { name: "Leg Raises", type: "STRENGTH", sets: 3, reps: "12 reps" },
      {
        name: "Side Plank Raises (Left Side)",
        type: "STRENGTH",
        sets: 2,
        reps: "15 reps"
      },
      {
        name: "Side Plank Raises (Right Side)",
        type: "STRENGTH",
        sets: 2,
        reps: "15 reps"
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  },
  {
    id: "thursday",
    category: "home",
    title: "BACK & SHOULDERS WORKOUT",
    day: "Thursday",
    emoji: "🏋️",
    description: "Build your back and shoulders using bags or household items",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      {
        name: "Leaning Back Rows",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Single Dumbbell Low Back Rows",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Leaning Rear Flyes",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Alternative Rear Delt Flyes",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Front Raises", type: "STRENGTH", sets: 2, reps: "6–8 reps" },
      { name: "Lateral Raises", type: "STRENGTH", sets: 2, reps: "6–8 reps" },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  },
  {
    id: "friday",
    category: "home",
    title: "LEGS WORKOUT",
    day: "Friday",
    emoji: "🦵",
    description: "Strengthen your legs with bag squats and bodyweight exercises",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Goblet Squats", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Sumo Squats", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Calf Raises", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Bulgarian Squats (Left Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Bulgarian Squats (Right Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Single Dumbbell Romanian Deadlifts",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  }
];
const GYM_PLANS = [
  {
    id: "gym-chest-biceps-triceps-v2",
    title: "CHEST, BICEPS & TRICEPS – GYM",
    day: "Tuesday – Gym",
    emoji: "💪",
    description: "Gym-specific movements for maximum chest, biceps, and triceps gains.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Arm Circles", type: "WARMUP", duration: 30 },
      { name: "High Knees", type: "WARMUP", duration: 30 },
      {
        name: "Barbell Bench Press",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Incline Dumbbell Press",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Cable Fly", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Dips", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Barbell Curl", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Incline Dumbbell Curl",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Hammer Curl", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Close-Grip Bench Press",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Tricep Rope Pushdown",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Skull Crushers", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  },
  {
    id: "gym-back-shoulders-v2",
    title: "BACK & SHOULDERS – GYM",
    day: "Wednesday – Gym",
    emoji: "🏋️",
    description: "Pull heavy for a wider back and broader shoulders.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Arm Circles", type: "WARMUP", duration: 30 },
      { name: "High Knees", type: "WARMUP", duration: 30 },
      { name: "Deadlift", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Pull-Ups", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Barbell Rows", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Seated Cable Row",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Overhead Barbell Press",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Dumbbell Lateral Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Rear Delt Fly", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Face Pulls", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  },
  {
    id: "gym-abs-calves-v2",
    title: "ABS & CALVES – GYM",
    day: "Friday – Gym",
    emoji: "🔥",
    description: "Core and calf definition with gym equipment.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "High Knees", type: "WARMUP", duration: 30 },
      {
        name: "Hanging Leg Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Cable Crunch", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Decline Sit-ups", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Plank", type: "WARMUP", duration: 60 },
      {
        name: "Standing Calf Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Seated Calf Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Donkey Calf Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  },
  {
    id: "gym-glutes-lower-back-v2",
    title: "GLUTES & LOWER BACK – GYM",
    day: "Saturday – Gym",
    emoji: "🦵",
    description: "Build powerful glutes and a strong lower back.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "High Knees", type: "WARMUP", duration: 30 },
      {
        name: "Barbell Hip Thrust",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Bulgarian Split Squat (Left Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Bulgarian Split Squat (Right Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Glute Bridge", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Cable Kickbacks (Left Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Cable Kickbacks (Right Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      {
        name: "Romanian Deadlift",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps"
      },
      { name: "Back Extensions", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Good Mornings", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  }
];
const FAT_LOSS_PLANS = [
  {
    id: "fatloss-teens",
    title: "FAT LOSS WORKOUT – TEENS",
    day: "Any Day",
    emoji: "🔥",
    description: "No equipment needed. Use your bodyweight to burn fat and build endurance.",
    category: "fatloss",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Burpees", type: "STRENGTH", sets: 3, reps: "10 reps" },
      { name: "High Knees", type: "WARMUP", duration: 30 },
      { name: "Mountain Climbers", type: "WARMUP", duration: 30 },
      { name: "Jump Squats", type: "STRENGTH", sets: 3, reps: "15 reps" },
      { name: "Push Ups", type: "STRENGTH", sets: 3, reps: "15 reps" },
      { name: "Plank Hold", type: "WARMUP", duration: 30 },
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 30 }
    ]
  }
];
const YOGA_PLANS = [
  {
    id: "yoga-full-body",
    title: "YOGA SESSION – FULL BODY",
    day: "Any Day",
    emoji: "🧘",
    description: "Hold each pose with steady breathing. Great for flexibility and mental calm.",
    category: "yoga",
    exercises: [
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 60 },
      {
        name: "Downward Dog (Adho Mukha Svanasana)",
        type: "STRETCH",
        duration: 30
      },
      { name: "Warrior I – Left Side", type: "STRETCH", duration: 30 },
      { name: "Warrior I – Right Side", type: "STRETCH", duration: 30 },
      { name: "Warrior II – Left Side", type: "STRETCH", duration: 30 },
      { name: "Warrior II – Right Side", type: "STRETCH", duration: 30 },
      { name: "Tree Pose – Left", type: "STRETCH", duration: 30 },
      { name: "Tree Pose – Right", type: "STRETCH", duration: 30 },
      { name: "Child's Pose (Balasana)", type: "STRETCH", duration: 60 },
      { name: "Cobra Pose (Bhujangasana)", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Seated Forward Bend", type: "STRETCH", duration: 30 },
      { name: "Corpse Pose (Savasana)", type: "STRETCH", duration: 60 }
    ]
  }
];
function getMusclesTargeted(name) {
  const n = name.toLowerCase();
  if (n.includes("jumping jack") || n.includes("burpee"))
    return "Full Body, Cardio";
  if (n.includes("high knee")) return "Quads, Hip Flexors, Cardio";
  if (n.includes("arm circle")) return "Shoulders, Rotator Cuff";
  if (n.includes("declined push") || n.includes("decline push"))
    return "Lower Chest, Triceps, Front Deltoids";
  if (n.includes("inclined push") || n.includes("incline push"))
    return "Upper Chest, Triceps, Front Deltoids";
  if (n.includes("push up") || n.includes("pushup"))
    return "Chest, Triceps, Front Deltoids";
  if (n.includes("alternate curl")) return "Biceps, Forearms";
  if (n.includes("hammer curl") && n.includes("both"))
    return "Biceps, Brachialis, Forearms";
  if (n.includes("hammer curl")) return "Biceps, Brachialis, Forearms";
  if (n.includes("bicep curl")) return "Biceps";
  if (n.includes("barbell curl")) return "Biceps";
  if (n.includes("incline dumbbell curl")) return "Biceps (Long Head)";
  if (n.includes("chair dip") || n.includes("dip") && !n.includes("rear"))
    return "Triceps, Chest, Front Deltoids";
  if (n.includes("skull crusher") || n.includes("skullcrusher"))
    return "Triceps (Long Head)";
  if (n.includes("tricep rope") || n.includes("rope pushdown"))
    return "Triceps";
  if (n.includes("close-grip bench") || n.includes("close grip bench"))
    return "Triceps, Inner Chest";
  if (n.includes("cable fly") || n.includes("cable flye"))
    return "Chest, Front Deltoids";
  if (n.includes("incline dumbbell press"))
    return "Upper Chest, Triceps, Front Deltoids";
  if (n.includes("barbell bench press") || n.includes("bench press"))
    return "Chest, Triceps, Front Deltoids";
  if (n.includes("leaning back row")) return "Lats, Rhomboids, Biceps";
  if (n.includes("low back row") || n.includes("single dumbbell") && n.includes("row"))
    return "Lats, Rhomboids, Biceps";
  if (n.includes("barbell row")) return "Lats, Rhomboids, Biceps";
  if (n.includes("seated cable row")) return "Lats, Rhomboids, Biceps";
  if (n.includes("pull-up") || n.includes("pull up") || n.includes("pullup"))
    return "Lats, Biceps, Rear Deltoids";
  if (n.includes("deadlift") && n.includes("romanian"))
    return "Hamstrings, Glutes, Lower Back";
  if (n.includes("deadlift")) return "Hamstrings, Glutes, Lower Back, Traps";
  if (n.includes("leaning rear flye") || n.includes("alternative rear delt"))
    return "Rear Deltoids, Rhomboids";
  if (n.includes("rear delt fly") || n.includes("rear delt flye"))
    return "Rear Deltoids, Rhomboids";
  if (n.includes("face pull")) return "Rear Deltoids, Rotator Cuff, Traps";
  if (n.includes("front raise")) return "Front Deltoids";
  if (n.includes("lateral raise") || n.includes("dumbbell lateral"))
    return "Side Deltoids";
  if (n.includes("overhead barbell press") || n.includes("overhead press"))
    return "Deltoids, Triceps, Traps";
  if (n.includes("crucifix crunch")) return "Core, Obliques";
  if (n.includes("hollow body")) return "Core, Hip Flexors";
  if (n.includes("hanging leg raise")) return "Lower Abs, Hip Flexors";
  if (n.includes("leg raise")) return "Lower Abs, Hip Flexors";
  if (n.includes("cable crunch")) return "Abs";
  if (n.includes("decline sit")) return "Upper Abs";
  if (n.includes("side plank")) return "Obliques, Core";
  if (n.includes("plank")) return "Core, Shoulders, Glutes";
  if (n.includes("mountain climber")) return "Core, Shoulders, Cardio";
  if (n.includes("jump squat")) return "Quads, Glutes, Calves, Cardio";
  if (n.includes("goblet squat")) return "Quads, Glutes, Core";
  if (n.includes("sumo squat")) return "Inner Thighs, Glutes, Quads";
  if (n.includes("bulgarian split squat") || n.includes("bulgarian squat"))
    return "Quads, Glutes, Hamstrings";
  if (n.includes("barbell hip thrust")) return "Glutes, Hamstrings";
  if (n.includes("glute bridge")) return "Glutes, Hamstrings";
  if (n.includes("cable kickback")) return "Glutes";
  if (n.includes("back extension")) return "Lower Back, Glutes";
  if (n.includes("good morning")) return "Hamstrings, Lower Back, Glutes";
  if (n.includes("standing calf raise")) return "Calves (Gastrocnemius)";
  if (n.includes("seated calf raise")) return "Calves (Soleus)";
  if (n.includes("donkey calf raise")) return "Calves (Gastrocnemius)";
  if (n.includes("calf raise")) return "Calves";
  if (n.includes("cobra")) return "Spine, Chest, Abs";
  if (n.includes("cat cow")) return "Spine, Core";
  if (n.includes("child")) return "Lower Back, Hips, Thighs";
  if (n.includes("downward dog"))
    return "Hamstrings, Calves, Shoulders, Upper Back";
  if (n.includes("warrior")) return "Quads, Hip Flexors, Core";
  if (n.includes("tree pose")) return "Core, Glutes, Balance";
  if (n.includes("seated forward bend")) return "Hamstrings, Lower Back";
  if (n.includes("corpse pose") || n.includes("savasana"))
    return "Full Body Relaxation";
  return "Full Body";
}
const ALL_PLANS_BY_CATEGORY = {
  home: WORKOUT_PLANS,
  gym: GYM_PLANS,
  fatloss: FAT_LOSS_PLANS,
  yoga: YOGA_PLANS
};
function buildSteps(exercises) {
  const steps = [];
  for (let idx = 0; idx < exercises.length; idx++) {
    const ex = exercises[idx];
    if (ex.type === "WARMUP" || ex.type === "STRETCH") {
      steps.push({
        kind: "timed",
        exerciseIndex: idx,
        exercise: ex,
        duration: ex.duration
      });
    } else {
      const totalSets = ex.sets;
      for (let s = 1; s <= totalSets; s++) {
        steps.push({
          kind: "strength",
          exerciseIndex: idx,
          exercise: ex,
          setNum: s,
          totalSets
        });
        steps.push({ kind: "rest", afterExerciseIndex: idx, afterSetNum: s });
      }
    }
    steps.push({ kind: "rest", afterExerciseIndex: idx, afterSetNum: 0 });
  }
  return steps;
}
function estimateMinutes(exercises) {
  let total = 0;
  for (const ex of exercises) {
    if (ex.type === "WARMUP" || ex.type === "STRETCH") {
      total += ex.duration ?? 30;
    } else {
      total += (ex.sets ?? 1) * 60;
      total += ((ex.sets ?? 1) - 1) * 30;
    }
    total += 30;
  }
  return Math.round(total / 60);
}
function useCountdown(initial, running, onDone) {
  const [seconds, setSeconds] = reactExports.useState(initial);
  const doneRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    setSeconds(initial);
    doneRef.current = false;
  }, [initial]);
  reactExports.useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1e3);
    return () => clearTimeout(id);
  }, [running, seconds, onDone]);
  return seconds;
}
function WorkoutOverlay({
  exercises,
  onClose
}) {
  const steps = buildSteps(exercises);
  const totalExercises = exercises.length;
  const [stepIndex, setStepIndex] = reactExports.useState(0);
  const [, setTimerKey] = reactExports.useState(0);
  const [restActive, setRestActive] = reactExports.useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = reactExports.useState(30);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const currentExerciseIdx = step.kind === "rest" ? step.afterExerciseIndex : step.exerciseIndex;
  const progressPct = Math.round(
    (currentExerciseIdx + 1) / totalExercises * 100
  );
  const { actor } = useActor();
  const [rewardModal, setRewardModal] = reactExports.useState(false);
  const [reward, setReward] = reactExports.useState(
    null
  );
  const [bonusAdCountdown, setBonusAdCountdown] = reactExports.useState(null);
  const [bonusClaimed, setBonusClaimed] = reactExports.useState(false);
  const completeWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return { xpGained: BigInt(50), coinsGained: BigInt(10) };
      const b = actor;
      return b.completeWorkout();
    },
    onSuccess: (data) => {
      setReward({ xp: Number(data.xpGained), coins: Number(data.coinsGained) });
      setRewardModal(true);
    },
    onError: () => {
      ue.success("💪 Workout complete! Great job!");
      onClose();
    }
  });
  const addBonusMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return BigInt(0);
      const b = actor;
      return b.addBonusCoins(BigInt(1));
    },
    onSuccess: () => {
      setBonusClaimed(true);
      ue.success("+1 bonus coin earned! 🪙");
    }
  });
  const startBonusAd = () => {
    setBonusAdCountdown(5);
  };
  reactExports.useEffect(() => {
    if (bonusAdCountdown === null) return;
    if (bonusAdCountdown <= 0) {
      setBonusAdCountdown(null);
      addBonusMutation.mutate();
      return;
    }
    const id = setTimeout(() => setBonusAdCountdown((n) => (n ?? 1) - 1), 1e3);
    return () => clearTimeout(id);
  }, [bonusAdCountdown]);
  const advance = reactExports.useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      setTimerKey((k) => k + 1);
    } else {
      completeWorkoutMutation.mutate();
    }
  }, [stepIndex, steps.length, completeWorkoutMutation]);
  reactExports.useEffect(() => {
    setRestActive(false);
    setRestSecondsLeft(30);
  }, [stepIndex]);
  reactExports.useEffect(() => {
    if (!restActive) return;
    if (restSecondsLeft <= 0) {
      setRestActive(false);
      setRestSecondsLeft(30);
      return;
    }
    const id = setTimeout(() => setRestSecondsLeft((s) => s - 1), 1e3);
    return () => clearTimeout(id);
  }, [restActive, restSecondsLeft]);
  const isAutoTimer = step.kind === "timed" || step.kind === "rest";
  const timerDuration = step.kind === "timed" ? step.duration : step.kind === "rest" ? 30 : 0;
  const seconds = useCountdown(timerDuration, isAutoTimer, advance);
  const R = 56;
  const circ = 2 * Math.PI * R;
  const fill = isAutoTimer ? seconds / timerDuration * circ : circ;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    rewardModal && reward && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[200] flex items-center justify-center",
        style: { background: "rgba(0,0,0,0.85)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            className: "mx-4 rounded-3xl p-7 text-center space-y-4 max-w-sm w-full",
            style: { background: "#1F1F1F", border: "2px solid #D4AF37" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl", children: "🏆" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl text-white", children: "Workout Complete!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-6 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-display font-black text-3xl",
                      style: { color: "#D4AF37" },
                      children: [
                        "+",
                        reward.xp
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/50 font-body", children: "XP" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-display font-black text-3xl",
                      style: { color: "#D4AF37" },
                      children: [
                        "+",
                        reward.coins
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/50 font-body", children: "Coins 🪙" })
                ] })
              ] }),
              !bonusClaimed && bonusAdCountdown === null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "workout.watch_bonus_ad.button",
                  onClick: startBonusAd,
                  className: "w-full py-3 rounded-xl font-display font-bold text-sm",
                  style: {
                    background: "rgba(212,175,55,0.15)",
                    border: "1px solid rgba(212,175,55,0.4)",
                    color: "#D4AF37"
                  },
                  children: "📺 Watch ad for +1 bonus coin"
                }
              ),
              bonusAdCountdown !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "w-full py-3 rounded-xl font-display font-bold text-sm text-white/50",
                  style: { background: "rgba(255,255,255,0.05)" },
                  children: [
                    "Ad ends in ",
                    bonusAdCountdown,
                    "s..."
                  ]
                }
              ),
              bonusClaimed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "text-sm font-display font-bold",
                  style: { color: "#22c55e" },
                  children: "✅ Bonus coin claimed!"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "workout.complete.close_button",
                  onClick: () => {
                    setRewardModal(false);
                    onClose();
                  },
                  className: "w-full py-3 rounded-xl font-display font-black text-base",
                  style: { background: "#D4AF37", color: "#1F1F1F" },
                  children: "Awesome! 💪"
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 flex flex-col",
        style: { background: "#1F1F1F" },
        "data-ocid": "workout.progress_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "h-full",
              style: { background: "#D4AF37" },
              initial: { width: 0 },
              animate: { width: `${progressPct}%` },
              transition: { duration: 0.5 }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 pt-4 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/50 text-sm font-body", children: [
              "Exercise ",
              currentExerciseIdx + 1,
              " of ",
              totalExercises
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "workout.close_button",
                onClick: onClose,
                className: "w-9 h-9 rounded-full flex items-center justify-center",
                style: { background: "rgba(255,255,255,0.08)" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 text-white" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center px-6 gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -24 },
              transition: { duration: 0.3 },
              className: "flex flex-col items-center gap-6 w-full max-w-sm",
              children: [
                step.kind === "rest" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-2xl font-display font-black tracking-wide",
                      style: { color: "#D4AF37" },
                      children: "Rest Time — 30 seconds"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleTimer,
                    {
                      seconds,
                      R,
                      circ,
                      fill
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-body", children: step.afterSetNum === 0 ? "Next exercise coming up..." : "Next set coming up..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "workout.skip_rest_button",
                      onClick: advance,
                      className: "text-white/40 text-sm underline font-body",
                      children: "Skip Rest"
                    }
                  )
                ] }),
                step.kind === "timed" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: step.exercise.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "workout.next_button",
                      onClick: advance,
                      className: "w-full h-14 text-base font-display font-black rounded-2xl",
                      style: { background: "#D4AF37", color: "#1F1F1F" },
                      children: isLastStep ? "Finish Workout 🏁" : "Skip →  Next Exercise"
                    }
                  ),
                  getExerciseImage(step.exercise.name) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: getExerciseImage(step.exercise.name) ?? "",
                      alt: step.exercise.name,
                      className: "w-48 h-48 rounded-2xl object-cover mx-auto",
                      style: { border: "1px solid rgba(212,175,55,0.35)" },
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-display font-black text-3xl text-center leading-tight", children: step.exercise.name }),
                  (() => {
                    const muscles = getMusclesTargeted(step.exercise.name);
                    return muscles ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-body uppercase tracking-widest",
                          style: { color: "rgba(212,175,55,0.6)" },
                          children: "💪 Muscles:"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-display font-bold",
                          style: { color: "#D4AF37" },
                          children: muscles
                        }
                      )
                    ] }) : null;
                  })(),
                  (() => {
                    const instrs = getExerciseInstructions(step.exercise.name);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "w-full rounded-xl px-4 py-3",
                        style: {
                          background: "rgba(20,20,20,0.85)",
                          borderLeft: "3px solid #D4AF37",
                          border: "1px solid rgba(212,175,55,0.2)",
                          borderLeftWidth: "3px",
                          borderLeftColor: "#D4AF37"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs font-display font-bold uppercase tracking-widest mb-2",
                              style: { color: "#D4AF37" },
                              children: "How to do it"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex flex-col gap-1", children: instrs.map((instr, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "li",
                            {
                              className: "flex gap-2 text-xs font-body text-white/75 leading-snug",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "font-bold shrink-0",
                                    style: { color: "#D4AF37" },
                                    children: [
                                      i + 1,
                                      "."
                                    ]
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: instr })
                              ]
                            },
                            `instr-${i}-${instr.slice(0, 10)}`
                          )) })
                        ]
                      }
                    );
                  })(),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleTimer,
                    {
                      seconds,
                      R,
                      circ,
                      fill
                    }
                  )
                ] }),
                step.kind === "strength" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: "STRENGTH" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": "workout.next_button",
                      onClick: advance,
                      className: "w-full h-14 text-base font-display font-black rounded-2xl",
                      style: { background: "#D4AF37", color: "#1F1F1F" },
                      children: isLastStep ? "Finish Workout 🏁" : step.setNum < step.totalSets ? "Done ✓  Next Set" : "Done ✓  Next Exercise"
                    }
                  ),
                  getExerciseImage(step.exercise.name) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: getExerciseImage(step.exercise.name) ?? "",
                      alt: step.exercise.name,
                      className: "w-48 h-48 rounded-2xl object-cover mx-auto",
                      style: { border: "1px solid rgba(212,175,55,0.35)" },
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-display font-black text-3xl text-center leading-tight", children: step.exercise.name }),
                  (() => {
                    const muscles = getMusclesTargeted(step.exercise.name);
                    return muscles ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-center flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-body uppercase tracking-widest",
                          style: { color: "rgba(212,175,55,0.6)" },
                          children: "💪 Muscles:"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs font-display font-bold",
                          style: { color: "#D4AF37" },
                          children: muscles
                        }
                      )
                    ] }) : null;
                  })(),
                  (() => {
                    const instrs = getExerciseInstructions(step.exercise.name);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "w-full rounded-xl px-4 py-3",
                        style: {
                          background: "rgba(20,20,20,0.85)",
                          borderLeft: "3px solid #D4AF37",
                          border: "1px solid rgba(212,175,55,0.2)",
                          borderLeftWidth: "3px",
                          borderLeftColor: "#D4AF37"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "p",
                            {
                              className: "text-xs font-display font-bold uppercase tracking-widest mb-2",
                              style: { color: "#D4AF37" },
                              children: "How to do it"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex flex-col gap-1", children: instrs.map((instr, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "li",
                            {
                              className: "flex gap-2 text-xs font-body text-white/75 leading-snug",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "font-bold shrink-0",
                                    style: { color: "#D4AF37" },
                                    children: [
                                      i + 1,
                                      "."
                                    ]
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: instr })
                              ]
                            },
                            `instr-${i}-${instr.slice(0, 10)}`
                          )) })
                        ]
                      }
                    );
                  })(),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-2xl px-8 py-5 text-center",
                      style: {
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.3)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "text-5xl font-display font-black mb-1",
                            style: { color: "#D4AF37" },
                            children: step.exercise.reps
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/50 text-sm font-body", children: [
                          "Set ",
                          step.setNum,
                          " of ",
                          step.totalSets
                        ] })
                      ]
                    }
                  ),
                  step.exercise.note ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-amber-400/60 text-xs font-body text-center font-semibold", children: [
                    "💡 ",
                    step.exercise.note
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 text-xs font-body text-center", children: "Images show dumbbells — you can also use bags or anything heavy with a good grip 💪" })
                ] })
              ]
            },
            stepIndex
          ) }) })
        ]
      }
    )
  ] });
}
function CircleTimer({
  seconds,
  R,
  circ,
  fill
}) {
  const size = R * 2 + 24;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex items-center justify-center",
      style: { width: size, height: size },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            "aria-hidden": "true",
            width: size,
            height: size,
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              transform: "rotate(-90deg)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: size / 2,
                  cy: size / 2,
                  r: R,
                  fill: "none",
                  stroke: "rgba(255,255,255,0.1)",
                  strokeWidth: 8
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: size / 2,
                  cy: size / 2,
                  r: R,
                  fill: "none",
                  stroke: "#D4AF37",
                  strokeWidth: 8,
                  strokeDasharray: circ,
                  strokeDashoffset: circ - fill,
                  strokeLinecap: "round",
                  style: { transition: "stroke-dashoffset 0.9s linear" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-display font-black text-5xl",
            style: { color: "#D4AF37" },
            children: seconds
          }
        )
      ]
    }
  );
}
function TypeBadge({ type }) {
  const label = type === "WARMUP" ? "Warm Up" : type === "STRETCH" ? "Stretch" : "Strength";
  const color = type === "WARMUP" ? "rgba(255,180,0,0.2)" : type === "STRETCH" ? "rgba(80,200,120,0.2)" : "rgba(212,175,55,0.2)";
  const text = type === "WARMUP" ? "#FFB400" : type === "STRETCH" ? "#50C878" : "#D4AF37";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "px-4 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-widest",
      style: { background: color, color: text },
      children: label
    }
  );
}
function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = reactExports.useState(null);
  const [selectedExercise, setSelectedExercise] = reactExports.useState(
    null
  );
  const [reps, setReps] = reactExports.useState(10);
  const [logModalOpen, setLogModalOpen] = reactExports.useState(false);
  const [workoutActive, setWorkoutActive] = reactExports.useState(false);
  const [activeCategory, setActiveCategory] = reactExports.useState(
    "home"
  );
  const [fatLossAdOpen, setFatLossAdOpen] = reactExports.useState(false);
  const [yogaAdOpen, setYogaAdOpen] = reactExports.useState(false);
  const [fatLossUnlocked, setFatLossUnlocked] = reactExports.useState(false);
  const [yogaUnlocked, setYogaUnlocked] = reactExports.useState(false);
  const [activeWorkoutExercises, setActiveWorkoutExercises] = reactExports.useState([]);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: exercises, isLoading: exercisesLoading } = useExercisesByCategory(selectedCategory);
  const { mutateAsync: logWorkout, isPending: isLogging } = useLogWorkoutSession();
  const handleLogSession = async () => {
    if (!selectedExercise) return;
    try {
      await logWorkout({ exerciseId: selectedExercise.id, reps: BigInt(reps) });
      ue.success(`🎉 Session logged! +${reps * 5} XP earned!`, {
        description: `${reps} reps of ${selectedExercise.name}`
      });
      setLogModalOpen(false);
      setSelectedExercise(null);
    } catch {
      ue.error("Could not log session. Please try again.");
    }
  };
  const handleStartWorkout = (plan) => {
    setActiveWorkoutExercises(plan.exercises);
    setWorkoutActive(true);
  };
  const difficultyColor = {
    [Difficulty.easy]: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    [Difficulty.medium]: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
    [Difficulty.hard]: "bg-destructive/20 text-destructive border-destructive/30"
  };
  const difficultyLabel = {
    [Difficulty.easy]: "Easy",
    [Difficulty.medium]: "Medium",
    [Difficulty.hard]: "Hard"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: workoutActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
      WorkoutOverlay,
      {
        exercises: activeWorkoutExercises,
        onClose: () => setWorkoutActive(false)
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "px-4 pt-12 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      selectedCategory && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setSelectedCategory(null),
          className: "w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-black", children: selectedCategory ? selectedCategory : "Train" }),
        !selectedCategory && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Pick a plan and get to work 💪" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 px-4 space-y-3", children: [
      !selectedCategory && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3 },
          className: "space-y-3 mb-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex rounded-2xl overflow-hidden p-1 gap-1",
                style: {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(212,175,55,0.15)"
                },
                children: [
                  { key: "home", label: "Home", emoji: "🏠" },
                  { key: "gym", label: "Gym", emoji: "🏋️" },
                  { key: "fatloss", label: "Fat Loss", emoji: "🔥" },
                  { key: "yoga", label: "Yoga", emoji: "🧘" }
                ].map(({ key, label, emoji }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": `train.${key}.tab`,
                    onClick: () => {
                      if (key === "fatloss" && !fatLossUnlocked) {
                        setFatLossAdOpen(true);
                      } else if (key === "yoga" && !yogaUnlocked) {
                        setYogaAdOpen(true);
                      } else {
                        setActiveCategory((prev) => prev === key ? null : key);
                      }
                    },
                    className: "flex-1 flex flex-col items-center py-2 px-1 rounded-xl text-xs font-display font-bold transition-all duration-200",
                    style: activeCategory === key ? { background: "#D4AF37", color: "#1F1F1F" } : {
                      background: "transparent",
                      color: "rgba(255,255,255,0.45)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none mb-0.5", children: emoji }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-none", children: label })
                    ]
                  },
                  key
                ))
              }
            ),
            activeCategory && ALL_PLANS_BY_CATEGORY[activeCategory].map((plan, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.07 },
                className: "rounded-2xl p-4",
                style: {
                  background: "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
                  border: "1px solid rgba(212,175,55,0.35)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0",
                        style: { background: "rgba(212,175,55,0.2)" },
                        children: plan.emoji
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-display font-black text-xs uppercase tracking-widest mb-0.5",
                          style: { color: "rgba(212,175,55,0.6)" },
                          children: plan.day
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "h2",
                        {
                          className: "font-display font-black text-sm leading-tight mb-0.5",
                          style: { color: "#D4AF37" },
                          children: plan.title
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs font-body leading-snug", children: plan.description }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/30 text-xs font-body", children: [
                          plan.exercises.length,
                          " exercises"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20 text-xs", children: "•" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/30 text-xs font-body", children: [
                          "~",
                          estimateMinutes(plan.exercises),
                          " min"
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": `workout.plan.start_button.${index + 1}`,
                      onClick: () => handleStartWorkout(plan),
                      className: "w-full mt-3 h-11 font-display font-black text-sm rounded-xl",
                      style: { background: "#D4AF37", color: "#1F1F1F" },
                      children: "Start Workout ▶"
                    }
                  )
                ]
              },
              plan.id
            ))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !selectedCategory ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -10 },
          transition: { duration: 0.25 },
          children: categoriesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl" }, i)) }) : !categories || categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "exercises.empty_state",
              className: "card-sporty p-8 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🏋️" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: "Exercises Coming Soon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Check back later — workouts are being added!" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: categories.map((cat, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.button,
            {
              "data-ocid": `exercises.category.item.${index + 1}`,
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              onClick: () => setSelectedCategory(cat.name),
              className: "w-full card-sporty p-4 flex items-center justify-between hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "w-5 h-5 text-neon-green" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground", children: cat.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: cat.description })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-neon-green transition-colors" })
              ]
            },
            cat.name
          )) })
        },
        "categories"
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 10 },
          transition: { duration: 0.25 },
          children: exercisesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }, i)) }) : !exercises || exercises.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "exercises.empty_state",
              className: "card-sporty p-8 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🔍" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: "No exercises yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Exercises for this category are coming soon!" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: exercises.map((exercise, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.05 },
              className: "card-sporty p-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base", children: exercise.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `text-xs border ${difficultyColor[exercise.difficulty]}`,
                        variant: "outline",
                        children: difficultyLabel[exercise.difficulty]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mb-2", children: exercise.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-xs text-muted-foreground font-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "w-3 h-3 text-neon-cyan" }),
                    "Target: ",
                    exercise.targetReps.toString(),
                    " reps"
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: () => {
                      setSelectedExercise(exercise);
                      setReps(Number(exercise.targetReps));
                      setLogModalOpen(true);
                    },
                    className: "bg-primary text-primary-foreground font-body font-semibold shrink-0",
                    children: "Log"
                  }
                )
              ] })
            },
            exercise.id.toString()
          )) })
        },
        "exercises"
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RewardedAdModal,
      {
        open: fatLossAdOpen,
        onComplete: () => {
          setFatLossUnlocked(true);
          setFatLossAdOpen(false);
          setActiveCategory("fatloss");
        },
        onCancel: () => setFatLossAdOpen(false),
        title: "Unlock Fat Loss Workouts",
        description: "Watch a short ad to unlock Fat Loss workout plans"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RewardedAdModal,
      {
        open: yogaAdOpen,
        onComplete: () => {
          setYogaUnlocked(true);
          setYogaAdOpen(false);
          setActiveCategory("yoga");
        },
        onCancel: () => setYogaAdOpen(false),
        title: "Unlock Yoga Workouts",
        description: "Watch a short ad to unlock Yoga workout plans"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: logModalOpen, onOpenChange: setLogModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "Log Session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground font-body", children: selectedExercise == null ? void 0 : selectedExercise.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground font-body mb-3", children: "How many reps?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: () => setReps((r) => Math.max(1, r - 1)),
                className: "w-12 h-12 rounded-full border-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                value: reps,
                onChange: (e) => setReps(Math.max(1, Number.parseInt(e.target.value) || 1)),
                className: "w-20 text-center text-2xl font-display font-bold bg-input border-border h-14",
                min: 1
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: () => setReps((r) => r + 1),
                className: "w-12 h-12 rounded-full border-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1 font-body",
              onClick: () => setLogModalOpen(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "exercises.log.submit_button",
              className: "flex-1 bg-primary text-primary-foreground font-body font-semibold glow-green",
              onClick: handleLogSession,
              disabled: isLogging,
              children: isLogging ? "Logging..." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 mr-1" }),
                " Log +XP"
              ] })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ExercisesPage as default
};
