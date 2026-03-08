import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Apple, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useUserRole } from "../hooks/useQueries";

interface DietEntry {
  id: string;
  name: string;
  category: string;
  calories: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
}

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Pre-workout",
  "Post-workout",
];

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "text-neon-orange",
  Lunch: "text-neon-green",
  Dinner: "text-chart-4",
  Snack: "text-neon-cyan",
  "Pre-workout": "text-chart-5",
  "Post-workout": "text-chart-2",
};

function loadDietEntries(): DietEntry[] {
  try {
    const stored = localStorage.getItem("kidfit_diet_entries");
    if (stored) return JSON.parse(stored) as DietEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveDietEntries(entries: DietEntry[]) {
  localStorage.setItem("kidfit_diet_entries", JSON.stringify(entries));
}

const MOTIVATIONAL_QUOTE =
  '"Let food be thy medicine and medicine be thy food." — Your body is a temple, fuel it well! 🥦💪';

export default function DietPage() {
  const { data: roleData } = useUserRole();
  const isAdmin = roleData === UserRole.admin;

  const [entries, setEntries] = useState<DietEntry[]>(() => loadDietEntries());
  const [addOpen, setAddOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    category: "",
    calories: "",
    description: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  useEffect(() => {
    // Reload entries on mount in case admin panel added some
    setEntries(loadDietEntries());
  }, []);

  const handleAddEntry = () => {
    if (!form.name.trim() || !form.category || !form.calories) {
      toast.error("Please fill in name, category, and calories.");
      return;
    }
    const newEntry: DietEntry = {
      id: `diet_${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      calories: Number.parseInt(form.calories, 10) || 0,
      description: form.description.trim(),
      protein: Number.parseFloat(form.protein) || 0,
      carbs: Number.parseFloat(form.carbs) || 0,
      fats: Number.parseFloat(form.fats) || 0,
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    saveDietEntries(updated);
    setForm({
      name: "",
      category: "",
      calories: "",
      description: "",
      protein: "",
      carbs: "",
      fats: "",
    });
    setAddOpen(false);
    toast.success("Diet entry added!");
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveDietEntries(updated);
    toast.success("Entry removed.");
  };

  return (
    <div className="flex flex-col min-h-screen gradient-mesh pb-36">
      <header className="px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black flex items-center gap-2">
            <Apple className="w-6 h-6 text-neon-green" />
            Diet & Nutrition
          </h1>
          <p className="text-muted-foreground text-sm font-body">
            Fuel your workouts right
          </p>
        </div>
        {isAdmin && (
          <Button
            data-ocid="diet.add.button"
            onClick={() => setAddOpen(true)}
            size="sm"
            className="bg-primary text-primary-foreground font-display font-bold gap-1 glow-green"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </Button>
        )}
      </header>

      <main className="flex-1 px-4 space-y-4">
        {/* Empty state or entries */}
        {entries.length === 0 ? (
          <motion.div
            data-ocid="diet.page"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Coming Soon Card */}
            <div
              className="card-sporty p-8 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 150 / 0.3))",
              }}
            >
              <div className="absolute top-0 right-0 text-9xl opacity-5 select-none pointer-events-none translate-x-4 -translate-y-4">
                🥗
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-4xl mx-auto mb-4">
                🍎
              </div>
              <h2 className="font-display font-black text-2xl mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground text-sm font-body leading-relaxed max-w-[260px] mx-auto">
                Your diet plans will appear here. Check back soon! Healthy
                eating is a key part of your fitness journey.
              </p>
            </div>

            {/* Motivational quote */}
            <div
              className="card-sporty p-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.15 0.04 265), oklch(0.18 0.08 195 / 0.2))",
              }}
            >
              <p className="text-sm text-muted-foreground font-body italic text-center leading-relaxed">
                {MOTIVATIONAL_QUOTE}
              </p>
            </div>

            {/* Tip cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  emoji: "💧",
                  title: "Hydrate",
                  tip: "Drink 8 glasses of water daily",
                },
                {
                  emoji: "🥩",
                  title: "Protein",
                  tip: "Eat protein after workouts",
                },
                {
                  emoji: "🍌",
                  title: "Energy",
                  tip: "Carbs fuel your workouts",
                },
                {
                  emoji: "😴",
                  title: "Recovery",
                  tip: "Sleep 8-9 hours a night",
                },
              ].map((item) => (
                <div key={item.title} className="card-sporty p-3 text-center">
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="font-display font-bold text-xs mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-body">
                    {item.tip}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Quote */}
            <div
              className="card-sporty p-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.15 0.04 265), oklch(0.18 0.08 195 / 0.2))",
              }}
            >
              <p className="text-xs text-muted-foreground font-body italic text-center">
                {MOTIVATIONAL_QUOTE}
              </p>
            </div>

            {/* Entries */}
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                data-ocid={`diet.item.${idx + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card-sporty p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-display font-bold uppercase tracking-wider ${CATEGORY_COLORS[entry.category] ?? "text-muted-foreground"}`}
                      >
                        {entry.category}
                      </span>
                      <span className="text-xs bg-muted/40 text-muted-foreground rounded-full px-2 py-0.5 font-body">
                        {entry.calories} kcal
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base">
                      {entry.name}
                    </h3>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-2">
                      <span className="text-xs font-body text-muted-foreground">
                        P:{" "}
                        <span className="text-foreground font-semibold">
                          {entry.protein}g
                        </span>
                      </span>
                      <span className="text-xs font-body text-muted-foreground">
                        C:{" "}
                        <span className="text-foreground font-semibold">
                          {entry.carbs}g
                        </span>
                      </span>
                      <span className="text-xs font-body text-muted-foreground">
                        F:{" "}
                        <span className="text-foreground font-semibold">
                          {entry.fats}g
                        </span>
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="shrink-0 w-8 h-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Add Diet Entry Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl">
              Add Diet Entry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                Name *
              </Label>
              <Input
                data-ocid="diet.name.input"
                placeholder="e.g. Banana Smoothie"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="bg-muted/30 border-border font-body"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  data-ocid="diet.category.select"
                  className="bg-muted/30 border-border font-body"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                Calories *
              </Label>
              <Input
                data-ocid="diet.calories.input"
                type="number"
                placeholder="e.g. 350"
                value={form.calories}
                onChange={(e) =>
                  setForm((f) => ({ ...f, calories: e.target.value }))
                }
                className="bg-muted/30 border-border font-body"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-body uppercase tracking-wider">
                Description
              </Label>
              <Textarea
                placeholder="Brief description..."
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="bg-muted/30 border-border font-body resize-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "protein", label: "Protein (g)" },
                { key: "carbs", label: "Carbs (g)" },
                { key: "fats", label: "Fats (g)" },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
                    {field.label}
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setAddOpen(false)}
                className="flex-1 border-border font-body"
              >
                Cancel
              </Button>
              <Button
                data-ocid="diet.submit.button"
                onClick={handleAddEntry}
                className="flex-1 bg-primary text-primary-foreground font-display font-bold glow-green"
              >
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
