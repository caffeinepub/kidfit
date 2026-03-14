import { q as useUserRole, F as useAddExerciseCategory, G as useAddExercise, H as useCreateTournament, I as useFinalizeTournament, J as useAddWorkoutPlan, K as useDeleteWorkoutPlan, L as useGetWorkoutPlans, r as reactExports, j as jsxRuntimeExports, D as Dumbbell, b as Trophy, E as Apple, n as DEMO_FREE_TOURNAMENTS, o as DEMO_PAID_TOURNAMENTS, u as ue } from "./index-j5uH3y76.js";
import { B as Button } from "./button-C3CVoxJl.js";
import { I as Input } from "./input-Bdg12VT6.js";
import { L as Label } from "./label-Dw93N1AF.js";
import { T as Textarea, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, f as Trash2, e as Switch } from "./textarea-DH-sNcYz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BQ57zWJY.js";
import { D as Difficulty, U as UserRole } from "./backend.d-AW0U9QfA.js";
import { S as Shield } from "./shield-BqyeD848.js";
import { U as Users } from "./users-tKg20Ufm.js";
import { m as motion } from "./proxy-DItxXm2Y.js";
import { P as Plus } from "./plus-DVUXeWlN.js";
import { L as LoaderCircle } from "./loader-circle-D4V2g_Ts.js";
import "./index-B56hFPeA.js";
import "./check-UMqkfBGt.js";
const DIET_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Pre-workout",
  "Post-workout"
];
function loadDietEntries() {
  try {
    const stored = localStorage.getItem("kidfit_diet_entries");
    if (stored) return JSON.parse(stored);
  } catch {
  }
  return [];
}
function saveDietEntries(entries) {
  localStorage.setItem("kidfit_diet_entries", JSON.stringify(entries));
}
function AdminPage() {
  const { data: roleData, isLoading: roleLoading } = useUserRole();
  const isAdmin = roleData === UserRole.admin;
  const addCategoryMutation = useAddExerciseCategory();
  const addExerciseMutation = useAddExercise();
  const createTournamentMutation = useCreateTournament();
  const finalizeTournamentMutation = useFinalizeTournament();
  const addWorkoutPlanMutation = useAddWorkoutPlan();
  const deleteWorkoutPlanMutation = useDeleteWorkoutPlan();
  const { data: workoutPlans = [], isLoading: plansLoading } = useGetWorkoutPlans();
  const [catForm, setCatForm] = reactExports.useState({ name: "", description: "" });
  const [exForm, setExForm] = reactExports.useState({
    name: "",
    category: "",
    description: "",
    difficulty: "easy",
    targetReps: ""
  });
  const [tForm, setTForm] = reactExports.useState({
    name: "",
    startDate: "",
    endDate: "",
    isPaid: false,
    entryFee: ""
  });
  const [dietEntries, setDietEntries] = reactExports.useState(
    () => loadDietEntries()
  );
  const [dietForm, setDietForm] = reactExports.useState({
    name: "",
    category: "",
    calories: "",
    description: "",
    protein: "",
    carbs: "",
    fats: "",
    isVeg: true
  });
  const [planForm, setPlanForm] = reactExports.useState({
    dayLabel: "",
    description: ""
  });
  const [planExercises, setPlanExercises] = reactExports.useState([
    { name: "", sets: "", reps: "", notes: "" }
  ]);
  reactExports.useEffect(() => {
    setDietEntries(loadDietEntries());
  }, []);
  if (roleLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen gradient-mesh flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" }) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen gradient-mesh flex flex-col items-center justify-center gap-4 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-16 h-16 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl text-center", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body text-center", children: "You don't have permission to view the admin panel." })
    ] });
  }
  const handleAddCategory = async () => {
    if (!catForm.name.trim()) {
      ue.error("Category name is required");
      return;
    }
    try {
      await addCategoryMutation.mutateAsync({
        name: catForm.name.trim(),
        description: catForm.description.trim()
      });
      setCatForm({ name: "", description: "" });
      ue.success("Exercise category added!");
    } catch {
      ue.error("Failed to add category. Please try again.");
    }
  };
  const handleAddExercise = async () => {
    if (!exForm.name.trim() || !exForm.category.trim()) {
      ue.error("Name and category are required");
      return;
    }
    try {
      await addExerciseMutation.mutateAsync({
        id: BigInt(Date.now()),
        name: exForm.name.trim(),
        category: exForm.category.trim(),
        description: exForm.description.trim(),
        difficulty: exForm.difficulty,
        targetReps: BigInt(Number.parseInt(exForm.targetReps, 10) || 10)
      });
      setExForm({
        name: "",
        category: "",
        description: "",
        difficulty: Difficulty.easy,
        targetReps: ""
      });
      ue.success("Exercise added!");
    } catch {
      ue.error("Failed to add exercise. Please try again.");
    }
  };
  const handleCreateTournament = async () => {
    if (!tForm.name.trim() || !tForm.startDate || !tForm.endDate) {
      ue.error("Name, start date, and end date are required");
      return;
    }
    try {
      const startMs = new Date(tForm.startDate).getTime();
      const endMs = new Date(tForm.endDate).getTime();
      const startNano = BigInt(startMs) * BigInt(1e6);
      const endNano = BigInt(endMs) * BigInt(1e6);
      const fee = tForm.isPaid ? BigInt(Number.parseInt(tForm.entryFee, 10) || 5e3) : BigInt(0);
      await createTournamentMutation.mutateAsync({
        name: tForm.name.trim(),
        startDate: startNano,
        endDate: endNano,
        entryFee: fee,
        isPaid: tForm.isPaid
      });
      setTForm({
        name: "",
        startDate: "",
        endDate: "",
        isPaid: false,
        entryFee: ""
      });
      ue.success("Tournament created!");
    } catch {
      ue.error("Failed to create tournament. Please try again.");
    }
  };
  const handleFinalize = async (id, name) => {
    try {
      await finalizeTournamentMutation.mutateAsync(id);
      ue.success(`${name} finalized!`);
    } catch {
      ue.error("Failed to finalize tournament.");
    }
  };
  const handleAddDietEntry = () => {
    if (!dietForm.name.trim() || !dietForm.category || !dietForm.calories) {
      ue.error("Name, category, and calories are required");
      return;
    }
    const newEntry = {
      id: `diet_${Date.now()}`,
      name: dietForm.name.trim(),
      category: dietForm.category,
      calories: Number.parseInt(dietForm.calories, 10) || 0,
      description: dietForm.description.trim(),
      protein: Number.parseFloat(dietForm.protein) || 0,
      carbs: Number.parseFloat(dietForm.carbs) || 0,
      fats: Number.parseFloat(dietForm.fats) || 0,
      isVeg: dietForm.isVeg
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
      isVeg: true
    });
    ue.success("Diet entry added!");
  };
  const handleDeleteDietEntry = (id) => {
    const updated = dietEntries.filter((e) => e.id !== id);
    setDietEntries(updated);
    saveDietEntries(updated);
    ue.success("Entry deleted.");
  };
  const addPlanExercise = () => {
    setPlanExercises((prev) => [
      ...prev,
      { name: "", sets: "", reps: "", notes: "" }
    ]);
  };
  const removePlanExercise = (idx) => {
    setPlanExercises((prev) => prev.filter((_, i) => i !== idx));
  };
  const updatePlanExercise = (idx, field, value) => {
    setPlanExercises(
      (prev) => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex)
    );
  };
  const handleAddWorkoutPlan = async () => {
    if (!planForm.dayLabel.trim()) {
      ue.error("Day label is required");
      return;
    }
    const validExercises = planExercises.filter((ex) => ex.name.trim());
    if (validExercises.length === 0) {
      ue.error("Add at least one exercise");
      return;
    }
    const exercises = validExercises.map((ex) => ({
      name: ex.name.trim(),
      sets: BigInt(Number.parseInt(ex.sets, 10) || 1),
      reps: BigInt(Number.parseInt(ex.reps, 10) || 10),
      notes: ex.notes.trim()
    }));
    try {
      await addWorkoutPlanMutation.mutateAsync({
        id: BigInt(0),
        // backend assigns real id
        dayLabel: planForm.dayLabel.trim(),
        description: planForm.description.trim(),
        exercises
      });
      setPlanForm({ dayLabel: "", description: "" });
      setPlanExercises([{ name: "", sets: "", reps: "", notes: "" }]);
      ue.success("Workout plan added!");
    } catch {
      ue.error("Failed to add workout plan. Please try again.");
    }
  };
  const handleDeleteWorkoutPlan = async (id) => {
    try {
      await deleteWorkoutPlanMutation.mutateAsync(id);
      ue.success("Workout plan deleted.");
    } catch {
      ue.error("Failed to delete workout plan.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-black flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-chart-4" }),
        "Admin Panel"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Manage content and tournaments" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "exercises", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full grid grid-cols-5 mb-4 bg-muted/30 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "exercises", className: "font-body text-xs gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Exercises" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            "data-ocid": "admin.workout_tab",
            value: "workouts",
            className: "font-body text-xs gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Workouts" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "tournaments",
            className: "font-body text-xs gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Events" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "diet", className: "font-body text-xs gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Apple, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Diet" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "users", className: "font-body text-xs gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Users" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "exercises", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            className: "card-sporty p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Add Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Category Name *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "admin.category.name.input",
                      placeholder: "e.g. Upper Body",
                      value: catForm.name,
                      onChange: (e) => setCatForm((f) => ({ ...f, name: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      placeholder: "Brief description...",
                      value: catForm.description,
                      onChange: (e) => setCatForm((f) => ({ ...f, description: e.target.value })),
                      className: "bg-muted/30 border-border font-body resize-none",
                      rows: 2
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "admin.category.submit.button",
                    onClick: handleAddCategory,
                    disabled: addCategoryMutation.isPending,
                    className: "w-full bg-primary text-primary-foreground font-display font-bold",
                    children: addCategoryMutation.isPending ? "Adding..." : "Add Category"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.05 },
            className: "card-sporty p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Add Exercise" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Exercise Name *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "admin.exercise.name.input",
                      placeholder: "e.g. Diamond Push-Ups",
                      value: exForm.name,
                      onChange: (e) => setExForm((f) => ({ ...f, name: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Category *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "e.g. Upper Body",
                      value: exForm.category,
                      onChange: (e) => setExForm((f) => ({ ...f, category: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      placeholder: "Describe the exercise...",
                      value: exForm.description,
                      onChange: (e) => setExForm((f) => ({ ...f, description: e.target.value })),
                      className: "bg-muted/30 border-border font-body resize-none",
                      rows: 2
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Difficulty" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: exForm.difficulty,
                        onValueChange: (v) => setExForm((f) => ({
                          ...f,
                          difficulty: v
                        })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/30 border-border font-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Difficulty.easy, children: "Easy" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Difficulty.medium, children: "Medium" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: Difficulty.hard, children: "Hard" })
                          ] })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Target Reps" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        placeholder: "e.g. 15",
                        value: exForm.targetReps,
                        onChange: (e) => setExForm((f) => ({ ...f, targetReps: e.target.value })),
                        className: "bg-muted/30 border-border font-body"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "admin.exercise.submit.button",
                    onClick: handleAddExercise,
                    disabled: addExerciseMutation.isPending,
                    className: "w-full bg-primary text-primary-foreground font-display font-bold",
                    children: addExerciseMutation.isPending ? "Adding..." : "Add Exercise"
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "workouts", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            className: "card-sporty p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Add Workout Plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Day Label *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "admin.workout_plan_input",
                      placeholder: "e.g. Day 1 - Upper Body",
                      value: planForm.dayLabel,
                      onChange: (e) => setPlanForm((f) => ({ ...f, dayLabel: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      placeholder: "Workout description...",
                      value: planForm.description,
                      onChange: (e) => setPlanForm((f) => ({
                        ...f,
                        description: e.target.value
                      })),
                      className: "bg-muted/30 border-border font-body resize-none",
                      rows: 2
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Exercises" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: addPlanExercise,
                        className: "h-7 text-xs border-border gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                          " Add Exercise"
                        ]
                      }
                    )
                  ] }),
                  planExercises.map((ex, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-display font-bold text-muted-foreground", children: [
                            "Exercise ",
                            idx + 1
                          ] }),
                          planExercises.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              variant: "ghost",
                              size: "icon",
                              onClick: () => removePlanExercise(idx),
                              className: "h-6 w-6 text-muted-foreground hover:text-destructive",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            placeholder: "Exercise name *",
                            value: ex.name,
                            onChange: (e) => updatePlanExercise(idx, "name", e.target.value),
                            className: "bg-muted/30 border-border font-body h-8 text-sm"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "number",
                              placeholder: "Sets (e.g. 3)",
                              value: ex.sets,
                              onChange: (e) => updatePlanExercise(idx, "sets", e.target.value),
                              className: "bg-muted/30 border-border font-body h-8 text-sm"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "number",
                              placeholder: "Reps (e.g. 10)",
                              value: ex.reps,
                              onChange: (e) => updatePlanExercise(idx, "reps", e.target.value),
                              className: "bg-muted/30 border-border font-body h-8 text-sm"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            placeholder: "Notes (optional)",
                            value: ex.notes,
                            onChange: (e) => updatePlanExercise(idx, "notes", e.target.value),
                            className: "bg-muted/30 border-border font-body h-8 text-sm"
                          }
                        )
                      ]
                    },
                    String(idx)
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "admin.workout_plan_submit_button",
                    onClick: handleAddWorkoutPlan,
                    disabled: addWorkoutPlanMutation.isPending,
                    className: "w-full bg-primary text-primary-foreground font-display font-bold",
                    children: addWorkoutPlanMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                      " ",
                      "Saving..."
                    ] }) : "Add Workout Plan"
                  }
                )
              ] })
            ]
          }
        ),
        plansLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" }) }) : workoutPlans.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wider", children: [
            "Current Plans (",
            workoutPlans.length,
            ")"
          ] }),
          workoutPlans.map((plan, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: idx * 0.04 },
              className: "card-sporty p-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm", children: plan.dayLabel }),
                  plan.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: plan.description }),
                  plan.exercises.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: plan.exercises.map((ex, ei) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-[10px] bg-muted/40 rounded-full px-2 py-0.5 font-body text-muted-foreground",
                      children: [
                        ex.name,
                        " ",
                        String(ex.sets),
                        "×",
                        String(ex.reps)
                      ]
                    },
                    String(ei)
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `admin.workout_plan_delete_button.${idx + 1}`,
                    variant: "ghost",
                    size: "icon",
                    onClick: () => handleDeleteWorkoutPlan(plan.id),
                    disabled: deleteWorkoutPlanMutation.isPending,
                    className: "shrink-0 w-8 h-8 text-muted-foreground hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            },
            plan.id.toString()
          ))
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "tournaments", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            className: "card-sporty p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Create Tournament" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Tournament Name *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "admin.tournament.name.input",
                      placeholder: "e.g. Summer Push-Up Blast",
                      value: tForm.name,
                      onChange: (e) => setTForm((f) => ({ ...f, name: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Start Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        value: tForm.startDate,
                        onChange: (e) => setTForm((f) => ({ ...f, startDate: e.target.value })),
                        className: "bg-muted/30 border-border font-body"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "End Date" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        value: tForm.endDate,
                        onChange: (e) => setTForm((f) => ({ ...f, endDate: e.target.value })),
                        className: "bg-muted/30 border-border font-body"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-body", children: "Paid Tournament (₹50)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: tForm.isPaid,
                      onCheckedChange: (v) => setTForm((f) => ({ ...f, isPaid: v }))
                    }
                  )
                ] }),
                tForm.isPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Entry Fee (paise)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      placeholder: "5000 = ₹50",
                      value: tForm.entryFee,
                      onChange: (e) => setTForm((f) => ({ ...f, entryFee: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "admin.tournament.submit.button",
                    onClick: handleCreateTournament,
                    disabled: createTournamentMutation.isPending,
                    className: "w-full bg-primary text-primary-foreground font-display font-bold",
                    children: createTournamentMutation.isPending ? "Creating..." : "Create Tournament"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wider", children: "Active Tournaments" }),
          [...DEMO_FREE_TOURNAMENTS, ...DEMO_PAID_TOURNAMENTS].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-sporty p-3 flex items-center justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm", children: t.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: t.isPaid ? `₹${Number(t.entryFee) / 100} entry` : "Free" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handleFinalize(t.id, t.name),
                    disabled: finalizeTournamentMutation.isPending,
                    className: "text-xs border-border font-body h-8",
                    children: "Finalize"
                  }
                )
              ]
            },
            t.id.toString()
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "diet", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            className: "card-sporty p-4 space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Add Diet Entry" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Name *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      "data-ocid": "admin.diet.name.input",
                      placeholder: "e.g. Banana Smoothie",
                      value: dietForm.name,
                      onChange: (e) => setDietForm((f) => ({ ...f, name: e.target.value })),
                      className: "bg-muted/30 border-border font-body"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Category *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: dietForm.category,
                        onValueChange: (v) => setDietForm((f) => ({ ...f, category: v })),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-muted/30 border-border font-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DIET_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Calories *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "number",
                        placeholder: "350",
                        value: dietForm.calories,
                        onChange: (e) => setDietForm((f) => ({ ...f, calories: e.target.value })),
                        className: "bg-muted/30 border-border font-body"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
                  { key: "protein", label: "Protein (g)" },
                  { key: "carbs", label: "Carbs (g)" },
                  { key: "fats", label: "Fats (g)" }
                ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground font-body", children: field.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      placeholder: "0",
                      value: dietForm[field.key],
                      onChange: (e) => setDietForm((f) => ({
                        ...f,
                        [field.key]: e.target.value
                      })),
                      className: "bg-muted/30 border-border font-body text-sm"
                    }
                  )
                ] }, field.key)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-body", children: "🥦 Vegetarian" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: dietForm.isVeg,
                      onCheckedChange: (v) => setDietForm((f) => ({ ...f, isVeg: v }))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "admin.diet.submit.button",
                    onClick: handleAddDietEntry,
                    className: "w-full bg-primary text-primary-foreground font-display font-bold",
                    children: "Add Diet Entry"
                  }
                )
              ] })
            ]
          }
        ),
        dietEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-sm text-muted-foreground uppercase tracking-wider", children: [
            "Current Entries (",
            dietEntries.length,
            ")"
          ] }),
          dietEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-sporty p-3 flex items-center justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm truncate", children: entry.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground font-body", children: [
                    entry.category,
                    " · ",
                    entry.calories,
                    " kcal ·",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: entry.isVeg ? "text-green-400" : "text-red-400",
                        children: entry.isVeg ? "🥦 Veg" : "🍗 Non-Veg"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "admin.diet.delete.button",
                    variant: "ghost",
                    size: "icon",
                    onClick: () => handleDeleteDietEntry(entry.id),
                    className: "shrink-0 w-8 h-8 text-muted-foreground hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ]
            },
            entry.id
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "users", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          className: "card-sporty p-8 text-center space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-12 h-12 text-muted-foreground mx-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg", children: "User Management" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "User management coming soon. You'll be able to view all registered athletes, assign roles, and manage XP here." })
          ]
        }
      ) })
    ] }) })
  ] });
}
export {
  AdminPage as default
};
