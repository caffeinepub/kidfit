import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Apple,
  Dumbbell,
  Loader2,
  Plus,
  Shield,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Difficulty, UserRole } from "../backend.d";
import type { WorkoutExercise } from "../backend.d";
import {
  DEMO_FREE_TOURNAMENTS,
  DEMO_PAID_TOURNAMENTS,
  useAddExercise,
  useAddExerciseCategory,
  useAddWorkoutPlan,
  useCreateTournament,
  useDeleteWorkoutPlan,
  useFinalizeTournament,
  useGetWorkoutPlans,
  useUserRole,
} from "../hooks/useQueries";

interface LocalDietEntry {
  id: string;
  name: string;
  category: string;
  calories: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
  isVeg: boolean;
}

const DIET_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Pre-workout",
  "Post-workout",
];

function loadDietEntries(): LocalDietEntry[] {
  try {
    const stored = localStorage.getItem("kidfit_diet_entries");
    if (stored) return JSON.parse(stored) as LocalDietEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveDietEntries(entries: LocalDietEntry[]) {
  localStorage.setItem("kidfit_diet_entries", JSON.stringify(entries));
}

interface WorkoutExerciseForm {
  name: string;
  sets: string;
  reps: string;
  notes: string;
}

export default function AdminPage() {
  const { data: roleData, isLoading: roleLoading } = useUserRole();
  const isAdmin = roleData === UserRole.admin;

  const addCategoryMutation = useAddExerciseCategory();
  const addExerciseMutation = useAddExercise();
  const createTournamentMutation = useCreateTournament();
  const finalizeTournamentMutation = useFinalizeTournament();
  const addWorkoutPlanMutation = useAddWorkoutPlan();
  const deleteWorkoutPlanMutation = useDeleteWorkoutPlan();
  const { data: workoutPlans = [], isLoading: plansLoading } =
    useGetWorkoutPlans();

  // Exercise category form
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  // Exercise form
  const [exForm, setExForm] = useState({
    name: "",
    category: "",
    description: "",
    difficulty: "easy" as Difficulty,
    targetReps: "",
  });

  // Tournament form
  const [tForm, setTForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isPaid: false,
    entryFee: "",
  });

  // Diet
  const [dietEntries, setDietEntries] = useState<LocalDietEntry[]>(() =>
    loadDietEntries(),
  );
  const [dietForm, setDietForm] = useState({
    name: "",
    category: "",
    calories: "",
    description: "",
    protein: "",
    carbs: "",
    fats: "",
    isVeg: true,
  });

  // Workout Plan form
  const [planForm, setPlanForm] = useState({
    dayLabel: "",
    description: "",
  });
  const [planExercises, setPlanExercises] = useState<WorkoutExerciseForm[]>([
    { name: "", sets: "", reps: "", notes: "" },
  ]);

  useEffect(() => {
    setDietEntries(loadDietEntries());
  }, []);

  if (roleLoading) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen gradient-mesh flex flex-col items-center justify-center gap-4 px-4">
        <Shield className="w-16 h-16 text-muted-foreground" />
        <h2 className="font-display font-black text-2xl text-center">
          Access Denied
        </h2>
        <p className="text-muted-foreground text-sm font-body text-center">
          You don't have permission to view the admin panel.
        </p>
      </div>
    );
  }

  const handleAddCategory = async () => {
    if (!catForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await addCategoryMutation.mutateAsync({
        name: catForm.name.trim(),
        description: catForm.description.trim(),
      });
      setCatForm({ name: "", description: "" });
      toast.success("Exercise category added!");
    } catch {
      toast.error("Failed to add category. Please try again.");
    }
  };

  const handleAddExercise = async () => {
    if (!exForm.name.trim() || !exForm.category.trim()) {
      toast.error("Name and category are required");
      return;
    }
    try {
      await addExerciseMutation.mutateAsync({
        id: BigInt(Date.now()),
        name: exForm.name.trim(),
        category: exForm.category.trim(),
        description: exForm.description.trim(),
        difficulty: exForm.difficulty,
        targetReps: BigInt(Number.parseInt(exForm.targetReps, 10) || 10),
      });
      setExForm({
        name: "",
        category: "",
        description: "",
        difficulty: Difficulty.easy,
        targetReps: "",
      });
      toast.success("Exercise added!");
    } catch {
      toast.error("Failed to add exercise. Please try again.");
    }
  };

  const handleCreateTournament = async () => {
    if (!tForm.name.trim() || !tForm.startDate || !tForm.endDate) {
      toast.error("Name, start date, and end date are required");
      return;
    }
    try {
      const startMs = new Date(tForm.startDate).getTime();
      const endMs = new Date(tForm.endDate).getTime();
      const startNano = BigInt(startMs) * BigInt(1_000_000);
      const endNano = BigInt(endMs) * BigInt(1_000_000);
      const fee = tForm.isPaid
        ? BigInt(Number.parseInt(tForm.entryFee, 10) || 5000)
        : BigInt(0);
      await createTournamentMutation.mutateAsync({
        name: tForm.name.trim(),
        startDate: startNano,
        endDate: endNano,
        entryFee: fee,
        isPaid: tForm.isPaid,
      });
      setTForm({
        name: "",
        startDate: "",
        endDate: "",
        isPaid: false,
        entryFee: "",
      });
      toast.success("Tournament created!");
    } catch {
      toast.error("Failed to create tournament. Please try again.");
    }
  };

  const handleFinalize = async (id: bigint, name: string) => {
    try {
      await finalizeTournamentMutation.mutateAsync(id);
      toast.success(`${name} finalized!`);
    } catch {
      toast.error("Failed to finalize tournament.");
    }
  };

  const handleAddDietEntry = () => {
    if (!dietForm.name.trim() || !dietForm.category || !dietForm.calories) {
      toast.error("Name, category, and calories are required");
      return;
    }
    const newEntry: LocalDietEntry = {
      id: `diet_${Date.now()}`,
      name: dietForm.name.trim(),
      category: dietForm.category,
      calories: Number.parseInt(dietForm.calories, 10) || 0,
      description: dietForm.description.trim(),
      protein: Number.parseFloat(dietForm.protein) || 0,
      carbs: Number.parseFloat(dietForm.carbs) || 0,
      fats: Number.parseFloat(dietForm.fats) || 0,
      isVeg: dietForm.isVeg,
    };
    const updated = [...dietEntries, newEntry];
    setDietEntries(updated);
    saveDietEntries(updated);
    setDietForm({
      name: "",
      category: "",
      calories: "",
      description: "",
      protein: "",
      carbs: "",
      fats: "",
      isVeg: true,
    });
    toast.success("Diet entry added!");
  };

  const handleDeleteDietEntry = (id: string) => {
    const updated = dietEntries.filter((e) => e.id !== id);
    setDietEntries(updated);
    saveDietEntries(updated);
    toast.success("Entry deleted.");
  };

  const addPlanExercise = () => {
    setPlanExercises((prev) => [
      ...prev,
      { name: "", sets: "", reps: "", notes: "" },
    ]);
  };

  const removePlanExercise = (idx: number) => {
    setPlanExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePlanExercise = (
    idx: number,
    field: keyof WorkoutExerciseForm,
    value: string,
  ) => {
    setPlanExercises((prev) =>
      prev.map((ex, i) => (i === idx ? { ...ex, [field]: value } : ex)),
    );
  };

  const handleAddWorkoutPlan = async () => {
    if (!planForm.dayLabel.trim()) {
      toast.error("Day label is required");
      return;
    }
    const validExercises = planExercises.filter((ex) => ex.name.trim());
    if (validExercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }
    const exercises: WorkoutExercise[] = validExercises.map((ex) => ({
      name: ex.name.trim(),
      sets: BigInt(Number.parseInt(ex.sets, 10) || 1),
      reps: BigInt(Number.parseInt(ex.reps, 10) || 10),
      notes: ex.notes.trim(),
    }));
    try {
      await addWorkoutPlanMutation.mutateAsync({
        id: BigInt(0), // backend assigns real id
        dayLabel: planForm.dayLabel.trim(),
        description: planForm.description.trim(),
        exercises,
      });
      setPlanForm({ dayLabel: "", description: "" });
      setPlanExercises([{ name: "", sets: "", reps: "", notes: "" }]);
      toast.success("Workout plan added!");
    } catch {
      toast.error("Failed to add workout plan. Please try again.");
    }
  };

  const handleDeleteWorkoutPlan = async (id: bigint) => {
    try {
      await deleteWorkoutPlanMutation.mutateAsync(id);
      toast.success("Workout plan deleted.");
    } catch {
      toast.error("Failed to delete workout plan.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      <header className="px-4 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black flex items-center gap-2">
          <Shield className="w-6 h-6 text-chart-4" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground text-sm font-body">
          Manage content and tournaments
        </p>
      </header>

      <main className="flex-1 px-4">
        <Tabs defaultValue="exercises">
          <TabsList className="w-full grid grid-cols-5 mb-4 bg-muted/30 border border-border">
            <TabsTrigger value="exercises" className="font-body text-xs gap-1">
              <Dumbbell className="w-3 h-3" />
              <span className="hidden sm:inline">Exercises</span>
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.workout_tab"
              value="workouts"
              className="font-body text-xs gap-1"
            >
              <Trophy className="w-3 h-3" />
              <span className="hidden sm:inline">Workouts</span>
            </TabsTrigger>
            <TabsTrigger
              value="tournaments"
              className="font-body text-xs gap-1"
            >
              <Trophy className="w-3 h-3" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="diet" className="font-body text-xs gap-1">
              <Apple className="w-3 h-3" />
              <span className="hidden sm:inline">Diet</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="font-body text-xs gap-1">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== EXERCISES TAB ===== */}
          <TabsContent value="exercises" className="space-y-4">
            {/* Add Category */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-sporty p-4 space-y-3"
            >
              <h2 className="font-display font-bold text-base">Add Category</h2>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Category Name *
                  </Label>
                  <Input
                    data-ocid="admin.category.name.input"
                    placeholder="e.g. Upper Body"
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Brief description..."
                    value={catForm.description}
                    onChange={(e) =>
                      setCatForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body resize-none"
                    rows={2}
                  />
                </div>
                <Button
                  data-ocid="admin.category.submit.button"
                  onClick={handleAddCategory}
                  disabled={addCategoryMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-display font-bold"
                >
                  {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                </Button>
              </div>
            </motion.div>

            {/* Add Exercise */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card-sporty p-4 space-y-3"
            >
              <h2 className="font-display font-bold text-base">Add Exercise</h2>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Exercise Name *
                  </Label>
                  <Input
                    data-ocid="admin.exercise.name.input"
                    placeholder="e.g. Diamond Push-Ups"
                    value={exForm.name}
                    onChange={(e) =>
                      setExForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Category *
                  </Label>
                  <Input
                    placeholder="e.g. Upper Body"
                    value={exForm.category}
                    onChange={(e) =>
                      setExForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Describe the exercise..."
                    value={exForm.description}
                    onChange={(e) =>
                      setExForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Difficulty
                    </Label>
                    <Select
                      value={exForm.difficulty}
                      onValueChange={(v) =>
                        setExForm((f) => ({
                          ...f,
                          difficulty: v as Difficulty,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-muted/30 border-border font-body">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Difficulty.easy}>Easy</SelectItem>
                        <SelectItem value={Difficulty.medium}>
                          Medium
                        </SelectItem>
                        <SelectItem value={Difficulty.hard}>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Target Reps
                    </Label>
                    <Input
                      type="number"
                      placeholder="e.g. 15"
                      value={exForm.targetReps}
                      onChange={(e) =>
                        setExForm((f) => ({ ...f, targetReps: e.target.value }))
                      }
                      className="bg-muted/30 border-border font-body"
                    />
                  </div>
                </div>
                <Button
                  data-ocid="admin.exercise.submit.button"
                  onClick={handleAddExercise}
                  disabled={addExerciseMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-display font-bold"
                >
                  {addExerciseMutation.isPending ? "Adding..." : "Add Exercise"}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* ===== WORKOUT PLANS TAB ===== */}
          <TabsContent value="workouts" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-sporty p-4 space-y-3"
            >
              <h2 className="font-display font-bold text-base">
                Add Workout Plan
              </h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Day Label *
                  </Label>
                  <Input
                    data-ocid="admin.workout_plan_input"
                    placeholder="e.g. Day 1 - Upper Body"
                    value={planForm.dayLabel}
                    onChange={(e) =>
                      setPlanForm((f) => ({ ...f, dayLabel: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Workout description..."
                    value={planForm.description}
                    onChange={(e) =>
                      setPlanForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    className="bg-muted/30 border-border font-body resize-none"
                    rows={2}
                  />
                </div>

                {/* Exercise List Builder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Exercises
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addPlanExercise}
                      className="h-7 text-xs border-border gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Exercise
                    </Button>
                  </div>

                  {planExercises.map((ex, idx) => (
                    <div
                      key={String(idx)}
                      className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-display font-bold text-muted-foreground">
                          Exercise {idx + 1}
                        </span>
                        {planExercises.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removePlanExercise(idx)}
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Exercise name *"
                        value={ex.name}
                        onChange={(e) =>
                          updatePlanExercise(idx, "name", e.target.value)
                        }
                        className="bg-muted/30 border-border font-body h-8 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Sets (e.g. 3)"
                          value={ex.sets}
                          onChange={(e) =>
                            updatePlanExercise(idx, "sets", e.target.value)
                          }
                          className="bg-muted/30 border-border font-body h-8 text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Reps (e.g. 10)"
                          value={ex.reps}
                          onChange={(e) =>
                            updatePlanExercise(idx, "reps", e.target.value)
                          }
                          className="bg-muted/30 border-border font-body h-8 text-sm"
                        />
                      </div>
                      <Input
                        placeholder="Notes (optional)"
                        value={ex.notes}
                        onChange={(e) =>
                          updatePlanExercise(idx, "notes", e.target.value)
                        }
                        className="bg-muted/30 border-border font-body h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  data-ocid="admin.workout_plan_submit_button"
                  onClick={handleAddWorkoutPlan}
                  disabled={addWorkoutPlanMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-display font-bold"
                >
                  {addWorkoutPlanMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Add Workout Plan"
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Existing Workout Plans */}
            {plansLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
              </div>
            ) : workoutPlans.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Current Plans ({workoutPlans.length})
                </h3>
                {workoutPlans.map((plan, idx) => (
                  <motion.div
                    key={plan.id.toString()}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="card-sporty p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-bold text-sm">
                          {plan.dayLabel}
                        </div>
                        {plan.description && (
                          <p className="text-xs text-muted-foreground font-body mt-0.5">
                            {plan.description}
                          </p>
                        )}
                        {plan.exercises.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {plan.exercises.map((ex, ei) => (
                              <span
                                key={String(ei)}
                                className="text-[10px] bg-muted/40 rounded-full px-2 py-0.5 font-body text-muted-foreground"
                              >
                                {ex.name} {String(ex.sets)}×{String(ex.reps)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        data-ocid={`admin.workout_plan_delete_button.${idx + 1}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteWorkoutPlan(plan.id)}
                        disabled={deleteWorkoutPlanMutation.isPending}
                        className="shrink-0 w-8 h-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </TabsContent>

          {/* ===== TOURNAMENTS TAB ===== */}
          <TabsContent value="tournaments" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-sporty p-4 space-y-3"
            >
              <h2 className="font-display font-bold text-base">
                Create Tournament
              </h2>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Tournament Name *
                  </Label>
                  <Input
                    data-ocid="admin.tournament.name.input"
                    placeholder="e.g. Summer Push-Up Blast"
                    value={tForm.name}
                    onChange={(e) =>
                      setTForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      value={tForm.startDate}
                      onChange={(e) =>
                        setTForm((f) => ({ ...f, startDate: e.target.value }))
                      }
                      className="bg-muted/30 border-border font-body"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      value={tForm.endDate}
                      onChange={(e) =>
                        setTForm((f) => ({ ...f, endDate: e.target.value }))
                      }
                      className="bg-muted/30 border-border font-body"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <Label className="text-sm font-body">
                    Paid Tournament (₹50)
                  </Label>
                  <Switch
                    checked={tForm.isPaid}
                    onCheckedChange={(v) =>
                      setTForm((f) => ({ ...f, isPaid: v }))
                    }
                  />
                </div>
                {tForm.isPaid && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Entry Fee (paise)
                    </Label>
                    <Input
                      type="number"
                      placeholder="5000 = ₹50"
                      value={tForm.entryFee}
                      onChange={(e) =>
                        setTForm((f) => ({ ...f, entryFee: e.target.value }))
                      }
                      className="bg-muted/30 border-border font-body"
                    />
                  </div>
                )}
                <Button
                  data-ocid="admin.tournament.submit.button"
                  onClick={handleCreateTournament}
                  disabled={createTournamentMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-display font-bold"
                >
                  {createTournamentMutation.isPending
                    ? "Creating..."
                    : "Create Tournament"}
                </Button>
              </div>
            </motion.div>

            {/* Active Tournaments */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">
                Active Tournaments
              </h3>
              {[...DEMO_FREE_TOURNAMENTS, ...DEMO_PAID_TOURNAMENTS].map((t) => (
                <div
                  key={t.id.toString()}
                  className="card-sporty p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-display font-bold text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-body">
                      {t.isPaid ? `₹${Number(t.entryFee) / 100} entry` : "Free"}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFinalize(t.id, t.name)}
                    disabled={finalizeTournamentMutation.isPending}
                    className="text-xs border-border font-body h-8"
                  >
                    Finalize
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ===== DIET TAB ===== */}
          <TabsContent value="diet" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-sporty p-4 space-y-3"
            >
              <h2 className="font-display font-bold text-base">
                Add Diet Entry
              </h2>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                    Name *
                  </Label>
                  <Input
                    data-ocid="admin.diet.name.input"
                    placeholder="e.g. Banana Smoothie"
                    value={dietForm.name}
                    onChange={(e) =>
                      setDietForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Category *
                    </Label>
                    <Select
                      value={dietForm.category}
                      onValueChange={(v) =>
                        setDietForm((f) => ({ ...f, category: v }))
                      }
                    >
                      <SelectTrigger className="bg-muted/30 border-border font-body">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIET_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                      Calories *
                    </Label>
                    <Input
                      type="number"
                      placeholder="350"
                      value={dietForm.calories}
                      onChange={(e) =>
                        setDietForm((f) => ({ ...f, calories: e.target.value }))
                      }
                      className="bg-muted/30 border-border font-body"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "protein", label: "Protein (g)" },
                    { key: "carbs", label: "Carbs (g)" },
                    { key: "fats", label: "Fats (g)" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground font-body">
                        {field.label}
                      </Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={
                          dietForm[field.key as keyof typeof dietForm] as string
                        }
                        onChange={(e) =>
                          setDietForm((f) => ({
                            ...f,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="bg-muted/30 border-border font-body text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <Label className="text-sm font-body">🥦 Vegetarian</Label>
                  <Switch
                    checked={dietForm.isVeg}
                    onCheckedChange={(v) =>
                      setDietForm((f) => ({ ...f, isVeg: v }))
                    }
                  />
                </div>
                <Button
                  data-ocid="admin.diet.submit.button"
                  onClick={handleAddDietEntry}
                  className="w-full bg-primary text-primary-foreground font-display font-bold"
                >
                  Add Diet Entry
                </Button>
              </div>
            </motion.div>

            {/* Diet entry list */}
            {dietEntries.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">
                  Current Entries ({dietEntries.length})
                </h3>
                {dietEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="card-sporty p-3 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm truncate">
                        {entry.name}
                      </div>
                      <div className="text-xs text-muted-foreground font-body">
                        {entry.category} · {entry.calories} kcal ·{" "}
                        <span
                          className={
                            entry.isVeg ? "text-green-400" : "text-red-400"
                          }
                        >
                          {entry.isVeg ? "🥦 Veg" : "🍗 Non-Veg"}
                        </span>
                      </div>
                    </div>
                    <Button
                      data-ocid="admin.diet.delete.button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDietEntry(entry.id)}
                      className="shrink-0 w-8 h-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ===== USERS TAB ===== */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-sporty p-8 text-center space-y-3"
            >
              <Users className="w-12 h-12 text-muted-foreground mx-auto" />
              <h2 className="font-display font-bold text-lg">
                User Management
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                User management coming soon. You'll be able to view all
                registered athletes, assign roles, and manage XP here.
              </p>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
