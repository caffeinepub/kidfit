import { B as useUserRole, n as useCreateCheckoutSession, g as useActor, C as useQuery, r as reactExports, u as ue, j as jsxRuntimeExports, E as Apple } from "./index-BMP_gf0E.js";
import { B as Button } from "./button-Dlld_0XW.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DNyRF4RT.js";
import { I as Input } from "./input-qbWPKNY-.js";
import { L as Label } from "./label-D1Xghfze.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, T as Textarea, e as Switch, f as Trash2 } from "./textarea-CwAa6SPB.js";
import { U as UserRole } from "./backend.d-AW0U9QfA.js";
import { P as Plus } from "./plus-iriH4ZxE.js";
import { C as Crown } from "./crown-B7hLWwKz.js";
import { m as motion } from "./proxy-DOnFFgue.js";
import { L as LoaderCircle } from "./loader-circle-D8-oEJkZ.js";
import { L as Lock } from "./lock-Bh-NRLZp.js";
import { E as Eye } from "./eye-li3fSfPw.js";
import "./index-CLkwpl38.js";
import "./index-yp3nUpaI.js";
import "./index-T_lPEKOu.js";
import "./check-d7ZeZciF.js";
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
function DietPage({ onNavigate }) {
  const { data: roleData } = useUserRole();
  const isAdmin = roleData === UserRole.admin;
  const createCheckout = useCreateCheckoutSession();
  const { actor } = useActor();
  const { data: isPremium = false } = useQuery({
    queryKey: ["isPremium"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isPremiumActive();
    },
    enabled: !!actor
  });
  const [entries, setEntries] = reactExports.useState(() => loadDietEntries());
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const vegUnlocked = new URLSearchParams(window.location.search).has(
    "veg_success"
  );
  const [stripeLoading, setStripeLoading] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    category: "",
    calories: "",
    description: "",
    protein: "",
    carbs: "",
    fats: "",
    isVeg: true
  });
  reactExports.useEffect(() => {
    setEntries(loadDietEntries());
  }, []);
  reactExports.useEffect(() => {
    if (vegUnlocked && window.location.search.includes("veg_success")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("veg_success");
      window.history.replaceState({}, "", url.toString());
      ue.success("🥗 Veg diet plan unlocked! Welcome to healthy eating!");
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
            productDescription: "Weekly veg diet plan access"
          }
        ],
        successUrl,
        cancelUrl
      });
      window.location.href = url;
    } catch {
      ue.error("Could not start checkout. Please try again.");
    } finally {
      setStripeLoading(false);
    }
  };
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
      fats: Number.parseFloat(form.fats) || 0,
      isVeg: form.isVeg
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
      isVeg: true
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
  const vegEntries = entries.filter((e) => e.isVeg !== false);
  const renderEntryCard = (entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
  );
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
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 px-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex rounded-2xl overflow-hidden",
          style: {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "diet.veg.tab",
                className: "flex-1 py-3 font-display font-bold text-sm",
                style: { background: "rgba(34,197,94,0.15)", color: "#22c55e" },
                children: "🥗 Veg Diet"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "diet.nonveg.tab",
                className: "flex-1 py-3 font-display font-bold text-sm",
                style: { color: isPremium ? "#D4AF37" : "rgba(255,255,255,0.4)" },
                children: [
                  "🍗 Non-Veg ",
                  !isPremium && "🔒"
                ]
              }
            )
          ]
        }
      ),
      !isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl p-6 text-center space-y-4",
          style: {
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.2)"
          },
          "data-ocid": "diet.nonveg.locked.panel",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-10 h-10 mx-auto", style: { color: "#D4AF37" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-white text-base", children: "Non-Veg Plan is Premium Only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 font-body", children: "Upgrade to Premium to access chicken, eggs, tuna, turkey and more high-protein non-veg meal plans." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "diet.upgrade_premium.button",
                onClick: () => onNavigate == null ? void 0 : onNavigate("premium"),
                className: "w-full py-3 rounded-2xl font-display font-bold text-sm",
                style: { background: "#D4AF37", color: "#1F1F1F" },
                children: "👑 Upgrade to Premium"
              }
            )
          ]
        }
      ),
      isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "diet.nonveg.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-white text-base flex items-center gap-2", children: [
          "🍗 Non-Veg Meal Plans",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs px-2 py-0.5 rounded-full font-body",
              style: { background: "rgba(212,175,55,0.2)", color: "#D4AF37" },
              children: "Premium"
            }
          )
        ] }),
        [
          {
            name: "Grilled Chicken Breast",
            cal: 165,
            protein: 31,
            carbs: 0,
            fats: 4,
            desc: "High-protein lean muscle builder"
          },
          {
            name: "Whole Eggs",
            cal: 155,
            protein: 13,
            carbs: 1,
            fats: 11,
            desc: "Complete amino acid profile"
          },
          {
            name: "Tuna (canned in water)",
            cal: 109,
            protein: 25,
            carbs: 0,
            fats: 1,
            desc: "Low fat, ultra high protein"
          },
          {
            name: "Ground Turkey",
            cal: 149,
            protein: 19,
            carbs: 0,
            fats: 8,
            desc: "Lean, versatile protein source"
          }
        ].map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `diet.nonveg.item.${idx + 1}`,
            className: "rounded-2xl p-4",
            style: {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-white text-sm", children: item.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-xs font-body",
                    style: { color: "#D4AF37" },
                    children: [
                      item.cal,
                      " kcal"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 font-body mb-2", children: item.desc }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-xs font-body text-white/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "P: ",
                  item.protein,
                  "g"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "C: ",
                  item.carbs,
                  "g"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "F: ",
                  item.fats,
                  "g"
                ] })
              ] })
            ]
          },
          item.name
        ))
      ] }),
      !vegUnlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: "card-sporty p-8 text-center space-y-4",
          style: {
            background: "linear-gradient(135deg, oklch(0.14 0.06 150), oklch(0.18 0.08 90 / 0.3))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-4xl mx-auto", children: "🥗" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-black text-2xl", children: "Veg Diet Plan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-body leading-relaxed max-w-[260px] mx-auto", children: "Get weekly vegetarian meal plans curated for teen athletes. Balanced nutrition to fuel your workouts and recovery." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-4 border",
                style: {
                  background: "oklch(0.15 0.05 150 / 0.4)",
                  borderColor: "oklch(0.55 0.18 150 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-black text-3xl text-neon-green", children: "₹40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-body", children: "per week" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "diet.subscribe_button",
                onClick: handleSubscribeVeg,
                disabled: stripeLoading,
                className: "w-full h-14 bg-primary text-primary-foreground font-display font-bold text-lg glow-green",
                children: [
                  stripeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 mr-2" }),
                  stripeLoading ? "Opening checkout..." : "Subscribe for ₹40/week"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-body text-neon-green", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Veg diet plan active" })
        ] }),
        vegEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            "data-ocid": "diet.empty_state",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            className: "card-sporty p-8 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "🥦" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg mb-1", children: "No veg entries yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Admin will add veg diet entries soon!" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: vegEntries.map((entry, idx) => renderEntryCard(entry, idx)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border max-w-sm max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display font-black text-xl", children: "Add Diet Entry" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground font-body uppercase tracking-wider", children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "diet.name.input",
              placeholder: "e.g. Grilled Paneer",
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-body", children: "🥦 Vegetarian" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: form.isVeg,
              onCheckedChange: (v) => setForm((f) => ({ ...f, isVeg: v }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setAddOpen(false),
              className: "flex-1 border-border font-body",
              "data-ocid": "diet.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "diet.submit_button",
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
