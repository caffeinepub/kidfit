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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Apple, Eye, EyeOff, Loader2, Lock, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useCreateCheckoutSession, useUserRole } from "../hooks/useQueries";

interface DietEntry {
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

const AD_UNLOCK_KEY = "diet_nonveg_unlocked_until";
const AD_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

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

function isNonVegUnlocked(): boolean {
  try {
    const val = localStorage.getItem(AD_UNLOCK_KEY);
    if (!val) return false;
    return Date.now() < Number.parseInt(val, 10);
  } catch {
    return false;
  }
}

function unlockNonVeg() {
  localStorage.setItem(AD_UNLOCK_KEY, String(Date.now() + AD_DURATION_MS));
}

export default function DietPage() {
  const { data: roleData } = useUserRole();
  const isAdmin = roleData === UserRole.admin;
  const createCheckout = useCreateCheckoutSession();

  const [entries, setEntries] = useState<DietEntry[]>(() => loadDietEntries());
  const [addOpen, setAddOpen] = useState(false);

  // Ad gate state for non-veg
  const [nonVegUnlocked, setNonVegUnlocked] = useState(isNonVegUnlocked);
  const [adCountdown, setAdCountdown] = useState(0);
  const [adRunning, setAdRunning] = useState(false);
  const adTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Veg payment state
  const vegUnlocked = new URLSearchParams(window.location.search).has(
    "veg_success",
  );
  const [stripeLoading, setStripeLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    category: "",
    calories: "",
    description: "",
    protein: "",
    carbs: "",
    fats: "",
    isVeg: true,
  });

  useEffect(() => {
    setEntries(loadDietEntries());
  }, []);

  // Clean up URL param after successful payment
  useEffect(() => {
    if (vegUnlocked && window.location.search.includes("veg_success")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("veg_success");
      window.history.replaceState({}, "", url.toString());
      toast.success("🥗 Veg diet plan unlocked! Welcome to healthy eating!");
    }
  }, [vegUnlocked]);

  const handleWatchAd = () => {
    if (adRunning) return;
    setAdRunning(true);
    setAdCountdown(15);
    adTimerRef.current = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(adTimerRef.current!);
          adTimerRef.current = null;
          setAdRunning(false);
          unlockNonVeg();
          setNonVegUnlocked(true);
          toast.success("🍗 Non-veg diet unlocked for 5 hours!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubscribeVeg = async () => {
    setStripeLoading(true);
    try {
      const successUrl = `${window.location.href.split("?")[0]}?veg_success=1`;
      const cancelUrl = window.location.href.split("?")[0];
      const url = await createCheckout.mutateAsync({
        items: [
          {
            productName: "Veg Diet Plan",
            currency: "inr",
            quantity: 1n,
            priceInCents: 3000n,
            productDescription: "Weekly veg diet plan access",
          },
        ],
        successUrl,
        cancelUrl,
      });
      window.location.href = url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setStripeLoading(false);
    }
  };

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
      isVeg: form.isVeg,
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
      isVeg: true,
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

  const vegEntries = entries.filter((e) => e.isVeg !== false);
  const nonVegEntries = entries.filter((e) => e.isVeg === false);

  const renderEntryCard = (entry: DietEntry, idx: number) => (
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
              className={`text-xs font-display font-bold uppercase tracking-wider ${
                CATEGORY_COLORS[entry.category] ?? "text-muted-foreground"
              }`}
            >
              {entry.category}
            </span>
            <span className="text-xs bg-muted/40 text-muted-foreground rounded-full px-2 py-0.5 font-body">
              {entry.calories} kcal
            </span>
            <span
              className={`text-xs rounded-full px-2 py-0.5 font-body ${
                entry.isVeg !== false
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {entry.isVeg !== false ? "🥦 Veg" : "🍗 Non-Veg"}
            </span>
          </div>
          <h3 className="font-display font-bold text-base">{entry.name}</h3>
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
  );

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

      <main className="flex-1 px-4">
        <Tabs defaultValue="veg" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2 bg-muted/30 border border-border">
            <TabsTrigger
              data-ocid="diet.veg_tab"
              value="veg"
              className="font-body text-sm gap-2"
            >
              🥦 Veg
            </TabsTrigger>
            <TabsTrigger
              data-ocid="diet.nonveg_tab"
              value="nonveg"
              className="font-body text-sm gap-2"
            >
              🍗 Non-Veg
            </TabsTrigger>
          </TabsList>

          {/* ===== VEG TAB ===== */}
          <TabsContent value="veg" className="space-y-4">
            {!vegUnlocked ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-sporty p-8 text-center space-y-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.06 150), oklch(0.18 0.08 90 / 0.3))",
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-4xl mx-auto">
                  🥗
                </div>
                <h2 className="font-display font-black text-2xl">
                  Veg Diet Plan
                </h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed max-w-[260px] mx-auto">
                  Get weekly vegetarian meal plans curated for teen athletes.
                  Balanced nutrition to fuel your workouts and recovery.
                </p>
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: "oklch(0.15 0.05 150 / 0.4)",
                    borderColor: "oklch(0.55 0.18 150 / 0.3)",
                  }}
                >
                  <div className="font-display font-black text-3xl text-neon-green">
                    ₹30
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
                    per week
                  </div>
                </div>
                <Button
                  data-ocid="diet.subscribe_button"
                  onClick={handleSubscribeVeg}
                  disabled={stripeLoading}
                  className="w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green"
                >
                  {stripeLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Lock className="w-5 h-5 mr-2" />
                  )}
                  {stripeLoading
                    ? "Opening checkout..."
                    : "Subscribe for ₹30/week"}
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-body text-neon-green">
                  <Eye className="w-4 h-4" />
                  <span>Veg diet plan active</span>
                </div>
                {vegEntries.length === 0 ? (
                  <motion.div
                    data-ocid="diet.empty_state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-sporty p-8 text-center"
                  >
                    <div className="text-5xl mb-3">🥦</div>
                    <h3 className="font-display font-bold text-lg mb-1">
                      No veg entries yet
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Admin will add veg diet entries soon!
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {vegEntries.map((entry, idx) =>
                      renderEntryCard(entry, idx),
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* ===== NON-VEG TAB ===== */}
          <TabsContent value="nonveg" className="space-y-4">
            {!nonVegUnlocked ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-sporty p-8 text-center space-y-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.14 0.04 30), oklch(0.18 0.06 22 / 0.3))",
                }}
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-4xl mx-auto">
                  🍗
                </div>
                <h2 className="font-display font-black text-2xl">
                  Non-Veg Diet Plan
                </h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed max-w-[260px] mx-auto">
                  Free non-veg meal plans for teen athletes. High-protein meals
                  for muscle building and recovery. Watch a short ad to unlock!
                </p>
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: "oklch(0.15 0.06 42 / 0.4)",
                    borderColor: "oklch(0.55 0.18 42 / 0.3)",
                  }}
                >
                  <div
                    className="font-display font-black text-3xl"
                    style={{ color: "oklch(0.85 0.22 90)" }}
                  >
                    FREE
                  </div>
                  <div className="text-xs text-muted-foreground font-body">
                    watch a 15s ad to unlock for 5 hours
                  </div>
                </div>

                {adRunning ? (
                  <div className="space-y-3">
                    <div
                      className="rounded-xl p-6 border text-center"
                      style={{
                        background: "oklch(0.12 0.04 42 / 0.6)",
                        borderColor: "oklch(0.55 0.18 42 / 0.4)",
                      }}
                    >
                      <div
                        className="font-display font-black text-5xl mb-2"
                        style={{ color: "oklch(0.85 0.22 90)" }}
                      >
                        {adCountdown}
                      </div>
                      <div className="text-sm text-muted-foreground font-body">
                        Ad playing... {adCountdown}s remaining
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2 mt-3">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${((15 - adCountdown) / 15) * 100}%`,
                            background: "oklch(0.85 0.22 90)",
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-body text-center">
                      🎬 Simulating ad — this is where a real ad plays
                    </p>
                  </div>
                ) : (
                  <Button
                    data-ocid="diet.watch_ad_button"
                    onClick={handleWatchAd}
                    className="w-full h-14 font-display font-bold text-lg"
                    style={{
                      background: "oklch(0.55 0.18 42)",
                      color: "oklch(0.95 0.02 42)",
                    }}
                  >
                    <EyeOff className="w-5 h-5 mr-2" />
                    Watch 15s Ad — Unlock Free
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-body text-neon-orange">
                    <Eye className="w-4 h-4" />
                    <span>Non-veg diet unlocked (5 hrs)</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem(AD_UNLOCK_KEY);
                      setNonVegUnlocked(false);
                    }}
                    className="text-xs text-muted-foreground h-7"
                  >
                    Re-lock
                  </Button>
                </div>
                {nonVegEntries.length === 0 ? (
                  <motion.div
                    data-ocid="diet.empty_state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-sporty p-8 text-center"
                  >
                    <div className="text-5xl mb-3">🍗</div>
                    <h3 className="font-display font-bold text-lg mb-1">
                      No non-veg entries yet
                    </h3>
                    <p className="text-sm text-muted-foreground font-body">
                      Admin will add non-veg diet entries soon!
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {nonVegEntries.map((entry, idx) =>
                      renderEntryCard(entry, idx),
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
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
                placeholder="e.g. Grilled Chicken Breast"
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
                    value={form[field.key as keyof typeof form] as string}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    className="bg-muted/30 border-border font-body text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
              <Label className="text-sm font-body">🥦 Vegetarian</Label>
              <Switch
                checked={form.isVeg}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isVeg: v }))}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setAddOpen(false)}
                className="flex-1 border-border font-body"
                data-ocid="diet.cancel_button"
              >
                Cancel
              </Button>
              <Button
                data-ocid="diet.submit_button"
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
