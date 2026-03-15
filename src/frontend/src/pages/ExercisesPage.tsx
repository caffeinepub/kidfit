import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronRight,
  Dumbbell,
  Minus,
  Plus,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Difficulty } from "../backend.d";
import type { Exercise } from "../backend.d";
import {
  useCategories,
  useExercisesByCategory,
  useLogWorkoutSession,
} from "../hooks/useQueries";

// ─── Exercise Image Lookup ───────────────────────────────────────────────────

function getExerciseImage(name: string): string | null {
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
  if (
    n.includes("hammer curl") &&
    (n.includes("altern") || n.includes("alternating"))
  )
    return "/assets/generated/exercise-hammer-curls-alt.dim_400x400.jpg";
  if (n.includes("bicep curl") && n.includes("both"))
    return "/assets/generated/exercise-bicep-curls-both.dim_400x400.jpg";
  if (n.includes("hammer curl") && n.includes("both"))
    return "/assets/generated/exercise-hammer-curls-both.dim_400x400.jpg";
  if (n.includes("chair dip"))
    return "/assets/generated/exercise-chair-dips.dim_400x400.jpg";
  if (n.includes("skull crusher"))
    return "/assets/generated/exercise-skull-crushers.dim_400x400.jpg";
  if (n.includes("cobra"))
    return "/assets/generated/exercise-cobra-pose.dim_400x400.jpg";
  if (n.includes("cat cow"))
    return "/assets/generated/exercise-cat-cow-pose.dim_400x400.jpg";
  if (
    (n.includes("tadasana") || n.includes("mountain pose")) &&
    !n.includes("mountain climber")
  )
    return "/assets/generated/exercise-tadasana.dim_400x400.jpg";
  if (n.includes("crucifix"))
    return "/assets/generated/exercise-crucifix-crunches.dim_400x400.jpg";
  if (n.includes("hollow body"))
    return "/assets/generated/exercise-hollow-body-hold.dim_400x400.jpg";
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
  return null;
}

// ─── Workout Plan Data ──────────────────────────────────────────────────────

type ExerciseType = "WARMUP" | "STRENGTH" | "STRETCH";

interface WorkoutExercise {
  name: string;
  type: ExerciseType;
  sets?: number;
  reps?: string;
  duration?: number; // seconds
  note?: string;
}

type WorkoutCategory = "home" | "gym" | "fatloss" | "yoga";

interface WorkoutPlan {
  id: string;
  title: string;
  day: string;
  emoji: string;
  description: string;
  exercises: WorkoutExercise[];
  category: WorkoutCategory;
}

const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "tuesday",
    category: "home" as WorkoutCategory,
    title: "CHEST, BICEPS & TRICEPS WORKOUT (TEENS)",
    day: "Tuesday",
    emoji: "💪",
    description:
      "No gym needed — use bags or something heavy with a good grip instead of dumbbells",
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
        reps: "8–10 reps",
      },
      {
        name: "Bicep Curls (Both Hands)",
        type: "STRENGTH",
        sets: 2,
        reps: "6–8 reps",
      },
      {
        name: "Hammer Curls (Both Hands)",
        type: "STRENGTH",
        sets: 2,
        reps: "6–8 reps",
      },
      { name: "Chair Dips", type: "STRENGTH", sets: 2, reps: "30 reps" },
      {
        name: "Overhead Skull Crushers",
        type: "STRENGTH",
        sets: 2,
        reps: "12 reps",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
  {
    id: "wednesday",
    category: "home" as WorkoutCategory,
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
        reps: "30 sec hold",
      },
      { name: "Leg Raises", type: "STRENGTH", sets: 3, reps: "12 reps" },
      {
        name: "Side Plank Raises (Left Side)",
        type: "STRENGTH",
        sets: 2,
        reps: "15 reps",
      },
      {
        name: "Side Plank Raises (Right Side)",
        type: "STRENGTH",
        sets: 2,
        reps: "15 reps",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
  {
    id: "thursday",
    category: "home" as WorkoutCategory,
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
        reps: "8–10 reps",
      },
      {
        name: "Single Dumbbell Low Back Rows",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
      },
      {
        name: "Leaning Rear Flyes",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
      },
      {
        name: "Alternative Rear Delt Flyes",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
      },
      { name: "Front Raises", type: "STRENGTH", sets: 2, reps: "6–8 reps" },
      { name: "Lateral Raises", type: "STRENGTH", sets: 2, reps: "6–8 reps" },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
  {
    id: "friday",
    category: "home" as WorkoutCategory,
    title: "LEGS WORKOUT",
    day: "Friday",
    emoji: "🦵",
    description:
      "Strengthen your legs with bag squats and bodyweight exercises",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      { name: "Goblet Squats", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Sumo Squats", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      { name: "Calf Raises", type: "STRENGTH", sets: 2, reps: "8–10 reps" },
      {
        name: "Bulgarian Squats (Left Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
      },
      {
        name: "Bulgarian Squats (Right Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
      },
      {
        name: "Single Dumbbell Romanian Deadlifts",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
];

const GYM_PLANS: WorkoutPlan[] = [
  {
    id: "gym-chest-biceps-triceps",
    title: "CHEST, BICEPS & TRICEPS – GYM",
    day: "Tuesday – Gym",
    emoji: "💪",
    description:
      "Same movements, heavier load. Use gym equipment for maximum gains.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      {
        name: "Declined Push Ups",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Push Ups",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Inclined Push Ups",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Alternate Curls",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Hammer Curls (Alternating)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Bicep Curls (Both Hands)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Hammer Curls (Both Hands)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Chair Dips",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Overhead Skull Crushers",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
  {
    id: "gym-abs",
    title: "ABS WORKOUT – GYM",
    day: "Wednesday – Gym",
    emoji: "🔥",
    description:
      "Core-focused training with heavier resistance for maximum abs definition.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      {
        name: "Crucifix Crunches",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Hollow Body Hold",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Leg Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Side Plank Raises (Left Side)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Side Plank Raises (Right Side)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
  {
    id: "gym-back-shoulders",
    title: "BACK & SHOULDERS – GYM",
    day: "Thursday – Gym",
    emoji: "🏋️",
    description: "Pull heavy for a wider back and stronger shoulders.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      {
        name: "Leaning Back Rows",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Single Dumbbell Low Back Rows",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Leaning Rear Flyes",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Alternative Rear Delt Flyes",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Front Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Lateral Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
  {
    id: "gym-legs",
    title: "LEGS – GYM",
    day: "Friday – Gym",
    emoji: "🦵",
    description: "Heavier loads for stronger legs. Focus on form first.",
    category: "gym",
    exercises: [
      { name: "Jumping Jacks", type: "WARMUP", duration: 60 },
      {
        name: "Goblet Squats",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Sumo Squats",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Calf Raises",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Bulgarian Squats (Left Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Bulgarian Squats (Right Leg)",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      {
        name: "Single Dumbbell Romanian Deadlifts",
        type: "STRENGTH",
        sets: 2,
        reps: "8–10 reps",
        note: "More weight, less reps and sets",
      },
      { name: "Cobra Pose", type: "STRETCH", duration: 30 },
      { name: "Cat Cow Pose", type: "STRETCH", duration: 30 },
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
];

const FAT_LOSS_PLANS: WorkoutPlan[] = [
  {
    id: "fatloss-teens",
    title: "FAT LOSS WORKOUT – TEENS",
    day: "Any Day",
    emoji: "🔥",
    description:
      "No equipment needed. Use your bodyweight to burn fat and build endurance.",
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
      { name: "Tadasana (Mountain Pose)", type: "STRETCH", duration: 30 },
    ],
  },
];

const YOGA_PLANS: WorkoutPlan[] = [
  {
    id: "yoga-full-body",
    title: "YOGA SESSION – FULL BODY",
    day: "Any Day",
    emoji: "🧘",
    description:
      "Hold each pose with steady breathing. Great for flexibility and mental calm.",
    category: "yoga",
    exercises: [
      { name: "Mountain Pose (Tadasana)", type: "STRETCH", duration: 60 },
      {
        name: "Downward Dog (Adho Mukha Svanasana)",
        type: "STRETCH",
        duration: 30,
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
      { name: "Corpse Pose (Savasana)", type: "STRETCH", duration: 60 },
    ],
  },
];

const ALL_PLANS_BY_CATEGORY: Record<WorkoutCategory, WorkoutPlan[]> = {
  home: WORKOUT_PLANS,
  gym: GYM_PLANS,
  fatloss: FAT_LOSS_PLANS,
  yoga: YOGA_PLANS,
};

// Build flat steps from a given exercises array
type Step =
  | {
      kind: "timed";
      exerciseIndex: number;
      exercise: WorkoutExercise;
      duration: number;
    }
  | {
      kind: "strength";
      exerciseIndex: number;
      exercise: WorkoutExercise;
      setNum: number;
      totalSets: number;
    }
  | { kind: "rest"; afterExerciseIndex: number; afterSetNum: number };

function buildSteps(exercises: WorkoutExercise[]): Step[] {
  const steps: Step[] = [];
  for (let idx = 0; idx < exercises.length; idx++) {
    const ex = exercises[idx];
    if (ex.type === "WARMUP" || ex.type === "STRETCH") {
      steps.push({
        kind: "timed",
        exerciseIndex: idx,
        exercise: ex,
        duration: ex.duration!,
      });
    } else {
      const totalSets = ex.sets!;
      for (let s = 1; s <= totalSets; s++) {
        steps.push({
          kind: "strength",
          exerciseIndex: idx,
          exercise: ex,
          setNum: s,
          totalSets,
        });
        if (s < totalSets) {
          steps.push({ kind: "rest", afterExerciseIndex: idx, afterSetNum: s });
        }
      }
    }
    // Add rest between exercises (but not after the last one)
    if (idx < exercises.length - 1) {
      steps.push({ kind: "rest", afterExerciseIndex: idx, afterSetNum: 0 });
    }
  }
  return steps;
}

// Estimate workout duration in minutes
function estimateMinutes(exercises: WorkoutExercise[]): number {
  let total = 0;
  for (const ex of exercises) {
    if (ex.type === "WARMUP" || ex.type === "STRETCH") {
      total += ex.duration ?? 30;
    } else {
      total += (ex.sets ?? 1) * 60; // ~1 min per set
      total += ((ex.sets ?? 1) - 1) * 30; // rest between sets
    }
    total += 30; // rest between exercises
  }
  return Math.round(total / 60);
}

// ─── Countdown Timer Hook ───────────────────────────────────────────────────

function useCountdown(initial: number, running: boolean, onDone: () => void) {
  const [seconds, setSeconds] = useState(initial);
  const doneRef = useRef(false);

  useEffect(() => {
    setSeconds(initial);
    doneRef.current = false;
  }, [initial]);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, seconds, onDone]);

  return seconds;
}

// ─── Workout Overlay ────────────────────────────────────────────────────────

function WorkoutOverlay({
  exercises,
  onClose,
}: {
  exercises: WorkoutExercise[];
  onClose: () => void;
}) {
  const steps = buildSteps(exercises);
  const totalExercises = exercises.length;

  const [stepIndex, setStepIndex] = useState(0);
  const [, setTimerKey] = useState(0);

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  // Compute overall exercise progress
  const currentExerciseIdx =
    step.kind === "rest" ? step.afterExerciseIndex : step.exerciseIndex;
  const progressPct = Math.round(
    ((currentExerciseIdx + 1) / totalExercises) * 100,
  );

  const advance = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      setTimerKey((k) => k + 1);
    } else {
      toast.success("💪 Workout complete! Great job!");
      onClose();
    }
  }, [stepIndex, steps.length, onClose]);

  // Determine timer params
  const isAutoTimer = step.kind === "timed" || step.kind === "rest";
  const timerDuration =
    step.kind === "timed" ? step.duration : step.kind === "rest" ? 30 : 0;

  const seconds = useCountdown(timerDuration, isAutoTimer, advance);

  // Circumference for circular timer SVG
  const R = 56;
  const circ = 2 * Math.PI * R;
  const fill = isAutoTimer ? (seconds / timerDuration) * circ : circ;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#1F1F1F" }}
      data-ocid="workout.progress_panel"
    >
      {/* Progress bar */}
      <div className="h-1 w-full bg-white/10">
        <motion.div
          className="h-full"
          style={{ background: "#D4AF37" }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-white/50 text-sm font-body">
          Exercise {currentExerciseIdx + 1} of {totalExercises}
        </span>
        <button
          type="button"
          data-ocid="workout.close_button"
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            {/* REST step */}
            {step.kind === "rest" && (
              <>
                <span
                  className="text-3xl font-display font-black tracking-widest"
                  style={{ color: "#D4AF37" }}
                >
                  REST
                </span>
                <CircleTimer seconds={seconds} R={R} circ={circ} fill={fill} />
                <p className="text-white/40 text-sm font-body">
                  {step.afterSetNum === 0
                    ? "Next exercise coming up..."
                    : "Next set coming up..."}
                </p>
                <button
                  type="button"
                  data-ocid="workout.skip_rest_button"
                  onClick={advance}
                  className="text-white/40 text-sm underline font-body"
                >
                  Skip Rest
                </button>
              </>
            )}

            {/* TIMED step (warmup/stretch) */}
            {step.kind === "timed" && (
              <>
                <TypeBadge type={step.exercise.type} />
                {getExerciseImage(step.exercise.name) && (
                  <img
                    src={getExerciseImage(step.exercise.name) ?? ""}
                    alt={step.exercise.name}
                    className="w-48 h-48 rounded-2xl object-cover mx-auto"
                    style={{ border: "1px solid rgba(212,175,55,0.35)" }}
                  />
                )}
                <h2 className="text-white font-display font-black text-3xl text-center leading-tight">
                  {step.exercise.name}
                </h2>
                <CircleTimer seconds={seconds} R={R} circ={circ} fill={fill} />
                <p className="text-white/40 text-sm font-body">
                  Auto-advancing when done
                </p>
              </>
            )}

            {/* STRENGTH step */}
            {step.kind === "strength" && (
              <>
                <TypeBadge type="STRENGTH" />
                {getExerciseImage(step.exercise.name) && (
                  <img
                    src={getExerciseImage(step.exercise.name) ?? ""}
                    alt={step.exercise.name}
                    className="w-48 h-48 rounded-2xl object-cover mx-auto"
                    style={{ border: "1px solid rgba(212,175,55,0.35)" }}
                  />
                )}
                <h2 className="text-white font-display font-black text-3xl text-center leading-tight">
                  {step.exercise.name}
                </h2>
                <div
                  className="rounded-2xl px-8 py-5 text-center"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                >
                  <div
                    className="text-5xl font-display font-black mb-1"
                    style={{ color: "#D4AF37" }}
                  >
                    {step.exercise.reps}
                  </div>
                  <div className="text-white/50 text-sm font-body">
                    Set {step.setNum} of {step.totalSets}
                  </div>
                </div>
                {step.exercise.note ? (
                  <p className="text-amber-400/60 text-xs font-body text-center font-semibold">
                    💡 {step.exercise.note}
                  </p>
                ) : (
                  <p className="text-white/30 text-xs font-body text-center">
                    Use bags or household items instead of dumbbells
                  </p>
                )}
                <Button
                  data-ocid="workout.next_button"
                  onClick={advance}
                  className="w-full h-14 text-base font-display font-black rounded-2xl"
                  style={{ background: "#D4AF37", color: "#1F1F1F" }}
                >
                  {isLastStep
                    ? "Finish Workout 🏁"
                    : step.setNum < step.totalSets
                      ? "Done ✓  Next Set"
                      : "Done ✓  Next Exercise"}
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Finish button for last timed step */}
      {isLastStep && step.kind === "timed" && seconds <= 0 && (
        <div className="px-6 pb-8">
          <Button
            data-ocid="workout.next_button"
            onClick={() => {
              toast.success("💪 Workout complete! Great job!");
              onClose();
            }}
            className="w-full h-14 text-base font-display font-black rounded-2xl"
            style={{ background: "#D4AF37", color: "#1F1F1F" }}
          >
            Finish Workout 🏁
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function CircleTimer({
  seconds,
  R,
  circ,
  fill,
}: {
  seconds: number;
  R: number;
  circ: number;
  fill: number;
}) {
  const size = R * 2 + 24;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={8}
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear" }}
        />
      </svg>
      <span
        className="font-display font-black text-5xl"
        style={{ color: "#D4AF37" }}
      >
        {seconds}
      </span>
    </div>
  );
}

function TypeBadge({ type }: { type: ExerciseType }) {
  const label =
    type === "WARMUP" ? "Warm Up" : type === "STRETCH" ? "Stretch" : "Strength";
  const color =
    type === "WARMUP"
      ? "rgba(255,180,0,0.2)"
      : type === "STRETCH"
        ? "rgba(80,200,120,0.2)"
        : "rgba(212,175,55,0.2)";
  const text =
    type === "WARMUP" ? "#FFB400" : type === "STRETCH" ? "#50C878" : "#D4AF37";
  return (
    <span
      className="px-4 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-widest"
      style={{ background: color, color: text }}
    >
      {label}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [reps, setReps] = useState(10);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<WorkoutCategory | null>(
    "home",
  );
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState<
    WorkoutExercise[]
  >([]);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: exercises, isLoading: exercisesLoading } =
    useExercisesByCategory(selectedCategory);
  const { mutateAsync: logWorkout, isPending: isLogging } =
    useLogWorkoutSession();

  const handleLogSession = async () => {
    if (!selectedExercise) return;
    try {
      await logWorkout({ exerciseId: selectedExercise.id, reps: BigInt(reps) });
      toast.success(`🎉 Session logged! +${reps * 5} XP earned!`, {
        description: `${reps} reps of ${selectedExercise.name}`,
      });
      setLogModalOpen(false);
      setSelectedExercise(null);
    } catch {
      toast.error("Could not log session. Please try again.");
    }
  };

  const handleStartWorkout = (plan: WorkoutPlan) => {
    setActiveWorkoutExercises(plan.exercises);
    setWorkoutActive(true);
  };

  const difficultyColor: Record<Difficulty, string> = {
    [Difficulty.easy]: "bg-chart-2/20 text-chart-2 border-chart-2/30",
    [Difficulty.medium]:
      "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
    [Difficulty.hard]:
      "bg-destructive/20 text-destructive border-destructive/30",
  };

  const difficultyLabel: Record<Difficulty, string> = {
    [Difficulty.easy]: "Easy",
    [Difficulty.medium]: "Medium",
    [Difficulty.hard]: "Hard",
  };

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      {/* Workout Overlay */}
      <AnimatePresence>
        {workoutActive && (
          <WorkoutOverlay
            exercises={activeWorkoutExercises}
            onClose={() => setWorkoutActive(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="font-display text-2xl font-black">
              {selectedCategory ? selectedCategory : "Train"}
            </h1>
            {!selectedCategory && (
              <p className="text-muted-foreground text-sm font-body">
                Pick a plan and get to work 💪
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-3">
        {/* ── Workout Plans with category tabs ── */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mb-1"
          >
            {/* Category Tabs */}
            <div
              className="flex rounded-2xl overflow-hidden p-1 gap-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              {(
                [
                  { key: "home", label: "Home", emoji: "🏠" },
                  { key: "gym", label: "Gym", emoji: "🏋️" },
                  { key: "fatloss", label: "Fat Loss", emoji: "🔥" },
                  { key: "yoga", label: "Yoga", emoji: "🧘" },
                ] as { key: WorkoutCategory; label: string; emoji: string }[]
              ).map(({ key, label, emoji }) => (
                <button
                  type="button"
                  key={key}
                  data-ocid={`train.${key}.tab`}
                  onClick={() =>
                    setActiveCategory((prev) => (prev === key ? null : key))
                  }
                  className="flex-1 flex flex-col items-center py-2 px-1 rounded-xl text-xs font-display font-bold transition-all duration-200"
                  style={
                    activeCategory === key
                      ? { background: "#D4AF37", color: "#1F1F1F" }
                      : {
                          background: "transparent",
                          color: "rgba(255,255,255,0.45)",
                        }
                  }
                >
                  <span className="text-base leading-none mb-0.5">{emoji}</span>
                  <span className="leading-none">{label}</span>
                </button>
              ))}
            </div>

            {/* Plan cards for active category */}
            {activeCategory &&
              ALL_PLANS_BY_CATEGORY[activeCategory].map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="rounded-2xl p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)",
                    border: "1px solid rgba(212,175,55,0.35)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: "rgba(212,175,55,0.2)" }}
                    >
                      {plan.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-display font-black text-xs uppercase tracking-widest mb-0.5"
                        style={{ color: "rgba(212,175,55,0.6)" }}
                      >
                        {plan.day}
                      </div>
                      <h2
                        className="font-display font-black text-sm leading-tight mb-0.5"
                        style={{ color: "#D4AF37" }}
                      >
                        {plan.title}
                      </h2>
                      <p className="text-white/40 text-xs font-body leading-snug">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-white/30 text-xs font-body">
                          {plan.exercises.length} exercises
                        </span>
                        <span className="text-white/20 text-xs">•</span>
                        <span className="text-white/30 text-xs font-body">
                          ~{estimateMinutes(plan.exercises)} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    data-ocid={`workout.plan.start_button.${index + 1}`}
                    onClick={() => handleStartWorkout(plan)}
                    className="w-full mt-3 h-11 font-display font-black text-sm rounded-xl"
                    style={{ background: "#D4AF37", color: "#1F1F1F" }}
                  >
                    Start Workout ▶
                  </Button>
                </motion.div>
              ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
            >
              {categoriesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              ) : !categories || categories.length === 0 ? (
                <div
                  data-ocid="exercises.empty_state"
                  className="card-sporty p-8 text-center"
                >
                  <div className="text-5xl mb-3">🏋️</div>
                  <h3 className="font-display font-bold text-lg mb-1">
                    Exercises Coming Soon
                  </h3>
                  <p className="text-muted-foreground text-sm font-body">
                    Check back later — workouts are being added!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat, index) => (
                    <motion.button
                      key={cat.name}
                      data-ocid={`exercises.category.item.${index + 1}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedCategory(cat.name)}
                      className="w-full card-sporty p-4 flex items-center justify-between hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-neon-green" />
                        </div>
                        <div className="text-left">
                          <div className="font-display font-bold text-sm text-foreground">
                            {cat.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-body">
                            {cat.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-neon-green transition-colors" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="exercises"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
            >
              {exercisesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : !exercises || exercises.length === 0 ? (
                <div
                  data-ocid="exercises.empty_state"
                  className="card-sporty p-8 text-center"
                >
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="font-display font-bold text-lg mb-1">
                    No exercises yet
                  </h3>
                  <p className="text-muted-foreground text-sm font-body">
                    Exercises for this category are coming soon!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id.toString()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card-sporty p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-base">
                              {exercise.name}
                            </h3>
                            <Badge
                              className={`text-xs border ${difficultyColor[exercise.difficulty]}`}
                              variant="outline"
                            >
                              {difficultyLabel[exercise.difficulty]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-body mb-2">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                            <span className="flex items-center gap-1">
                              <Dumbbell className="w-3 h-3 text-neon-cyan" />
                              Target: {exercise.targetReps.toString()} reps
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedExercise(exercise);
                            setReps(Number(exercise.targetReps));
                            setLogModalOpen(true);
                          }}
                          className="bg-primary text-primary-foreground font-body font-semibold shrink-0"
                        >
                          Log
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Log Session Modal */}
      <Dialog open={logModalOpen} onOpenChange={setLogModalOpen}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Log Session
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-body">
              {selectedExercise?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-body mb-3">
                How many reps?
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReps((r) => Math.max(1, r - 1))}
                  className="w-12 h-12 rounded-full border-border"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) =>
                    setReps(Math.max(1, Number.parseInt(e.target.value) || 1))
                  }
                  className="w-20 text-center text-2xl font-display font-bold bg-input border-border h-14"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReps((r) => r + 1)}
                  className="w-12 h-12 rounded-full border-border"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 font-body"
                onClick={() => setLogModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                data-ocid="exercises.log.submit_button"
                className="flex-1 bg-primary text-primary-foreground font-body font-semibold glow-green"
                onClick={handleLogSession}
                disabled={isLogging}
              >
                {isLogging ? (
                  "Logging..."
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-1" /> Log +XP
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
