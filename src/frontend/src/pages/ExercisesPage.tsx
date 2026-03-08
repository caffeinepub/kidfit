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
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Difficulty } from "../backend.d";
import type { Exercise } from "../backend.d";
import {
  useCategories,
  useExercisesByCategory,
  useLogWorkoutSession,
} from "../hooks/useQueries";

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [reps, setReps] = useState(10);
  const [logModalOpen, setLogModalOpen] = useState(false);

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
              {selectedCategory ? selectedCategory : "Exercise Library"}
            </h1>
            {!selectedCategory && (
              <p className="text-muted-foreground text-sm font-body">
                No gym needed 💪
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-3">
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
