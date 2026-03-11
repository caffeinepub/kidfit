import { q as useUserRole, r as reactExports, j as jsxRuntimeExports, A as Apple, u as ue } from "./index-Ds68Gk-i.js";
import { B as Button } from "./button-ChmPTUV4.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BAzUMPbs.js";
import { I as Input } from "./input-B8QgdVby.js";
import { L as Label } from "./label-MUQWjP8u.js";
import { T as Trash2, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, e as Textarea } from "./textarea-CsETOjqD.js";
import { U as UserRole } from "./backend.d-AW0U9QfA.js";
import { P as Plus } from "./plus-26URbSrV.js";
import { m as motion } from "./proxy-DDybWlNs.js";
import "./index-0ZPC2Wmr.js";
import "./index-ClSqgCQh.js";
import "./check-gd791CSQ.js";
const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Pre-workout",
  "Post-workout"
];
const CATEGORY_COLORS = {
  Breakfast: "text-neon-orange",
  Lunch: "text-neon-green",
  Dinner: "text-chart-4",
  Snack: "text-neon-cyan",
  "Pre-workout": "text-chart-5",
  "Post-workout": "text-chart-2"
};
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
const MOTIVATIONAL_QUOTE = '"Let food be thy medicine and medicine be thy food." — Your body is a temple, fuel it well! 🥦💪';
function DietPage() {
  const { data: roleData } = useUserRole();
  const isAdmin = roleData === UserRole.admin;
  const [entries, setEntries] = reactExports.useState(() => loadDietEntries());
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    category: "",
    calories: "",
    description: "",
    protein: "",
    carbs: "",
    fats: ""
  });
  reactExports.useEffect(() => {
    setEntries(loadDietEntries());
  }, []);
  const handleAddEntry = () => {
    if (!form.name.trim() || !form.category || !form.calories) {
      ue.error("Please fill in name, category, and calories.");
      return;
    }
    const newEntry = {
      id: `diet_${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      calories: Number.parseInt(form.calories, 10) || 0,
      description: form.description.trim(),
      protein: Number.parseFloat(form.protein) || 0,
      carbs: Number.parseFloat(form.carbs) || 0,
      fats: Number.parseFloat(form.fats) || 0
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
      fats: ""
    });
    setAddOpen(false);
    ue.success("Diet entry added!");
  };
  const handleDeleteEntry = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveDietEntries(updated);
    ue.success("Entry removed.");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen gradient-mesh pb-36", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-black flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Apple, { className: "w-6 h-6 text-neon-green" }),
          "Diet & Nutrition"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body", children: "Fuel your workouts right" })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "diet.add.button",
          onClick: () => setAddOpen(true),
          size: "sm",
          className: "bg-primary text-primary-foreground font-display font-bold gap-1 glow-green",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Entry"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-4 space-y-4", children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-ocid": "diet.page",
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "card-sporty p-8 text-center relative overflow-hidden",
              style: {
                background: "linear-gradient(135deg, oklch(0.14 0.04 265), oklch(0.18 0.06 150 / 0.3))"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 text-9xl opacity-5 select-none pointer-events-none translate-x-4 -translate-y-4", children: "🥗" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-4xl mx-auto mb-4", children: "🍎" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl mb-2", children: "Coming Soon" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body leading-relaxed max-w-[260px] mx-auto", children: "Your diet plans will appear here. Check back soon! Healthy eating is a key part of your fitness journey." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "card-sporty p-4",
              style: {
                background: "linear-gradient(135deg, oklch(0.15 0.04 265), oklch(0.18 0.08 195 / 0.2))"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body italic text-center leading-relaxed", children: MOTIVATIONAL_QUOTE })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
            {
              emoji: "💧",
              title: "Hydrate",
              tip: "Drink 8 glasses of water daily"
            },
            {
              emoji: "🥩",
              title: "Protein",
              tip: "Eat protein after workouts"
            },
            {
              emoji: "🍌",
              title: "Energy",
              tip: "Carbs fuel your workouts"
            },
            {
              emoji: "😴",
              title: "Recovery",
              tip: "Sleep 8-9 hours a night"
            }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-sporty p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-1", children: item.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-xs mb-0.5", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground font-body", children: item.tip })
          ] }, item.title)) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "card-sporty p-4",
              style: {
                background: "linear-gradient(135deg, oklch(0.15 0.04 265), oklch(0.18 0.08 195 / 0.2))"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body italic text-center", children: MOTIVATIONAL_QUOTE })
            }
          ),
          entries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              "data-ocid": `diet.item.${idx + 1}`,
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: idx * 0.05 },
              className: "card-sporty p-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-xs font-display font-bold uppercase tracking-wider ${CATEGORY_COLORS[entry.category] ?? "text-muted-foreground"}`,
                        children: entry.category
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs bg-muted/40 text-muted-foreground rounded-full px-2 py-0.5 font-body", children: [
                      entry.calories,
                      " kcal"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-base", children: entry.name }),
                  entry.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body mt-0.5 line-clamp-2", children: entry.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-body text-muted-foreground", children: [
                      "P:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                        entry.protein,
                        "g"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-body text-muted-foreground", children: [
                      "C:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                        entry.carbs,
                        "g"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-body text-muted-foreground", children: [
                      "F:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                        entry.fats,
                        "g"
                      ] })
                    ] })
                  ] })
                ] }),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => handleDeleteEntry(entry.id),
                    className: "shrink-0 w-8 h-8 text-muted-foreground hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            },
            entry.id
          ))
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border max-w-sm max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-black text-xl", children: "Add Diet Entry" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "diet.name.input",
              placeholder: "e.g. Banana Smoothie",
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              className: "bg-muted/30 border-border font-body"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Category *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => setForm((f) => ({ ...f, category: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "diet.category.select",
                    className: "bg-muted/30 border-border font-body",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Calories *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "diet.calories.input",
              type: "number",
              placeholder: "e.g. 350",
              value: form.calories,
              onChange: (e) => setForm((f) => ({ ...f, calories: e.target.value })),
              className: "bg-muted/30 border-border font-body"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              placeholder: "Brief description...",
              value: form.description,
              onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })),
              className: "bg-muted/30 border-border font-body resize-none",
              rows: 2
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
          { key: "protein", label: "Protein (g)" },
          { key: "carbs", label: "Carbs (g)" },
          { key: "fats", label: "Fats (g)" }
        ].map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground font-body uppercase tracking-wider", children: field.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              placeholder: "0",
              value: form[field.key],
              onChange: (e) => setForm((f) => ({ ...f, [field.key]: e.target.value })),
              className: "bg-muted/30 border-border font-body text-sm"
            }
          )
        ] }, field.key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setAddOpen(false),
              className: "flex-1 border-border font-body",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "diet.submit.button",
              onClick: handleAddEntry,
              className: "flex-1 bg-primary text-primary-foreground font-display font-bold glow-green",
              children: "Add Entry"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  DietPage as default
};
