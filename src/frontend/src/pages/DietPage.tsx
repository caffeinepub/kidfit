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
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { Apple, Crown, Eye, Loader2, Lock, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";
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

type AppPage =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin"
  | "leaderboard"
  | "avatar"
  | "premium";

interface DietPageProps {
  onNavigate?: (page: AppPage) => void;
}

export default function DietPage({ onNavigate }: DietPageProps) {
  const { data: roleData } = useUserRole();
  const isAdmin = roleData === UserRole.admin;
  const createCheckout = useCreateCheckoutSession();
  const { actor } = useActor();
  const { data: isPremium = false } = useQuery<boolean>({
    queryKey: ["isPremium"],
    queryFn: async () => {
      if (!actor) return false;
      return (
        actor as unknown as { isPremiumActive(): Promise<boolean> }
      ).isPremiumActive();
    },
    enabled: !!actor,
  });

  const [entries, setEntries] = useState<DietEntry[]>(() => loadDietEntries());
  const [addOpen, setAddOpen] = useState(false);

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
            priceInCents: 4000n,
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

      <main className="flex-1 px-4 space-y-4">
        {/* TABS */}
        <div
          className="flex rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            type="button"
            data-ocid="diet.veg.tab"
            className="flex-1 py-3 font-display font-bold text-sm"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
          >
            🥗 Veg Diet
          </button>
          <button
            type="button"
            data-ocid="diet.nonveg.tab"
            className="flex-1 py-3 font-display font-bold text-sm"
            style={{ color: isPremium ? "#D4AF37" : "rgba(255,255,255,0.4)" }}
          >
            🍗 Non-Veg {!isPremium && "🔒"}
          </button>
        </div>

        {/* Non-Veg Premium Gate */}
        {!isPremium && (
          <div
            className="rounded-2xl p-6 text-center space-y-4"
            style={{
              background: "rgba(212,175,55,0.06)",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
            data-ocid="diet.nonveg.locked.panel"
          >
            <Crown className="w-10 h-10 mx-auto" style={{ color: "#D4AF37" }} />
            <h3 className="font-display font-bold text-white text-base">
              Non-Veg Plan is Premium Only
            </h3>
            <p className="text-xs text-white/50 font-body">
              Upgrade to Premium to access chicken, eggs, tuna, turkey and more
              high-protein non-veg meal plans.
            </p>
            <button
              type="button"
              data-ocid="diet.upgrade_premium.button"
              onClick={() => onNavigate?.("premium")}
              className="w-full py-3 rounded-2xl font-display font-bold text-sm"
              style={{ background: "#D4AF37", color: "#1F1F1F" }}
            >
              👑 Upgrade to Premium
            </button>
          </div>
        )}

        {/* Non-Veg Content (premium only) */}
        {isPremium && (
          <div className="space-y-3" data-ocid="diet.nonveg.section">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              🍗 Non-Veg Meal Plans
              <span
                className="text-xs px-2 py-0.5 rounded-full font-body"
                style={{ background: "rgba(212,175,55,0.2)", color: "#D4AF37" }}
              >
                Premium
              </span>
            </h3>
            {[
              {
                name: "Grilled Chicken Breast",
                cal: 165,
                protein: 31,
                carbs: 0,
                fats: 4,
                desc: "High-protein lean muscle builder",
              },
              {
                name: "Whole Eggs",
                cal: 155,
                protein: 13,
                carbs: 1,
                fats: 11,
                desc: "Complete amino acid profile",
              },
              {
                name: "Tuna (canned in water)",
                cal: 109,
                protein: 25,
                carbs: 0,
                fats: 1,
                desc: "Low fat, ultra high protein",
              },
              {
                name: "Ground Turkey",
                cal: 149,
                protein: 19,
                carbs: 0,
                fats: 8,
                desc: "Lean, versatile protein source",
              },
            ].map((item, idx) => (
              <div
                key={item.name}
                data-ocid={`diet.nonveg.item.${idx + 1}` as string}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-display font-bold text-white text-sm">
                    {item.name}
                  </span>
                  <span
                    className="text-xs font-body"
                    style={{ color: "#D4AF37" }}
                  >
                    {item.cal} kcal
                  </span>
                </div>
                <p className="text-xs text-white/50 font-body mb-2">
                  {item.desc}
                </p>
                <div className="flex gap-3 text-xs font-body text-white/40">
                  <span>P: {item.protein}g</span>
                  <span>C: {item.carbs}g</span>
                  <span>F: {item.fats}g</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== VEG DIET ===== */}
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
            <h2 className="font-display font-black text-2xl">Veg Diet Plan</h2>
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
                ₹40
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
              {stripeLoading ? "Opening checkout..." : "Subscribe for ₹40/week"}
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
                {vegEntries.map((entry, idx) => renderEntryCard(entry, idx))}
              </div>
            )}
          </div>
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
                placeholder="e.g. Grilled Paneer"
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
