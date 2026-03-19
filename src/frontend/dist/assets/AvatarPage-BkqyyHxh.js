import { c as createLucideIcon, g as useActor, P as useQueryClient, C as useQuery, r as reactExports, h as useMutation, j as jsxRuntimeExports, u as ue } from "./index-BMP_gf0E.js";
import { B as Button } from "./button-Dlld_0XW.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-QrPv_BvR.js";
import { u as useCoins } from "./useCoins-BraRle4K.js";
import { A as ArrowLeft } from "./arrow-left-Eex_lU7W.js";
import { m as motion } from "./proxy-DOnFFgue.js";
import { L as LoaderCircle } from "./loader-circle-D8-oEJkZ.js";
import "./index-CLkwpl38.js";
import "./index-T_lPEKOu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }]
];
const ShoppingBag = createLucideIcon("shopping-bag", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
];
const WandSparkles = createLucideIcon("wand-sparkles", __iconNode);
const SKIN_TONES = [
  { id: "light", label: "Light", color: "#FDBCB4" },
  { id: "medium", label: "Medium", color: "#C68642" },
  { id: "dark", label: "Dark", color: "#8D5524" },
  { id: "cool", label: "Cool", color: "#FFD1DC" }
];
const HAIR_STYLES = [
  { id: "default", label: "Default", free: true },
  { id: "spiky", label: "Spiky", free: false },
  { id: "afro", label: "Afro", free: false },
  { id: "wavy", label: "Wavy", free: true },
  { id: "buzz", label: "Buzz Cut", free: true }
];
const HAIR_COLORS = [
  { id: "black", label: "Black", color: "#1a1a1a" },
  { id: "brown", label: "Brown", color: "#7B3F00" },
  { id: "blonde", label: "Blonde", color: "#F0D060" },
  { id: "gold", label: "Gold", color: "#D4AF37" },
  { id: "red", label: "Red", color: "#CC2200" },
  { id: "blue", label: "Blue", color: "#2255CC" }
];
const FACE_PARTS = [
  { id: "default", label: "Default", emoji: "😐", free: true },
  { id: "happy", label: "Happy", emoji: "😄", free: true },
  { id: "cool", label: "Cool", emoji: "😎", free: true },
  { id: "fierce", label: "Fierce", emoji: "😤", free: true },
  { id: "sleepy", label: "Sleepy", emoji: "😴", free: true }
];
const OUTFITS = [
  { id: "default", label: "Default", color: "#666", free: true },
  { id: "red-hoodie", label: "Red Hoodie", color: "#CC2200", free: false },
  { id: "blue-jersey", label: "Blue Jersey", color: "#2255CC", free: false },
  {
    id: "gold-champion",
    label: "Gold Champion",
    color: "#D4AF37",
    free: false
  },
  { id: "black-ninja", label: "Black Ninja", color: "#111", free: true }
];
const ACCESSORIES = [
  { id: "none", label: "None", emoji: "", free: true },
  { id: "crown", label: "Crown", emoji: "👑", free: false },
  { id: "headband", label: "Headband", emoji: "🎽", free: true },
  { id: "glasses", label: "Glasses", emoji: "🕶️", free: true },
  { id: "cap", label: "Cap", emoji: "🧢", free: true }
];
const SHOP_ITEMS = [
  {
    id: "outfit:red-hoodie",
    label: "Red Hoodie",
    category: "outfit",
    img: "/assets/generated/avatar-outfit-red-hoodie-transparent.dim_200x200.png",
    price: 30
  },
  {
    id: "outfit:blue-jersey",
    label: "Blue Jersey",
    category: "outfit",
    img: "/assets/generated/avatar-outfit-blue-jersey-transparent.dim_200x200.png",
    price: 30
  },
  {
    id: "outfit:gold-champion",
    label: "Gold Champion",
    category: "outfit",
    img: "/assets/generated/avatar-outfit-gold-champion-transparent.dim_200x200.png",
    price: 30
  },
  {
    id: "hair:spiky",
    label: "Spiky Hair",
    category: "hair",
    img: "/assets/generated/avatar-hair-spiky-transparent.dim_200x200.png",
    price: 30
  },
  {
    id: "hair:afro",
    label: "Afro Hair",
    category: "hair",
    img: "/assets/generated/avatar-hair-afro-transparent.dim_200x200.png",
    price: 30
  },
  {
    id: "accessory:crown",
    label: "Gold Crown",
    category: "accessory",
    img: "/assets/generated/avatar-accessory-crown-transparent.dim_200x200.png",
    price: 30
  }
];
function getSkinColor(id) {
  var _a;
  return ((_a = SKIN_TONES.find((s) => s.id === id)) == null ? void 0 : _a.color) ?? "#FDBCB4";
}
function getHairColor(id) {
  var _a;
  return ((_a = HAIR_COLORS.find((h) => h.id === id)) == null ? void 0 : _a.color) ?? "#1a1a1a";
}
function getOutfitColor(id) {
  var _a;
  return ((_a = OUTFITS.find((o) => o.id === id)) == null ? void 0 : _a.color) ?? "#666";
}
function getFaceEmoji(id) {
  var _a;
  return ((_a = FACE_PARTS.find((f) => f.id === id)) == null ? void 0 : _a.emoji) ?? "😐";
}
function getAccessoryEmoji(id) {
  var _a;
  return ((_a = ACCESSORIES.find((a) => a.id === id)) == null ? void 0 : _a.emoji) ?? "";
}
function HairShape({ style, color }) {
  if (style === "afro") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: "-22px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90px",
          height: "70px",
          borderRadius: "50%",
          background: color,
          zIndex: 0
        }
      }
    );
  }
  if (style === "spiky") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: "-28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "4px",
          zIndex: 0
        },
        children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: "10px",
              height: `${20 + (i % 3 === 1 ? 14 : i % 2 === 0 ? 8 : 4)}px`,
              background: color,
              borderRadius: "50% 50% 0 0",
              transform: `rotate(${(i - 2) * 12}deg)`,
              transformOrigin: "bottom center"
            }
          },
          i
        ))
      }
    );
  }
  if (style === "wavy") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "76px",
          height: "24px",
          borderRadius: "40% 40% 20% 20%",
          background: color,
          zIndex: 0
        }
      }
    );
  }
  if (style === "buzz") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "72px",
          height: "14px",
          borderRadius: "50% 50% 0 0",
          background: color,
          zIndex: 0
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "70px",
        height: "20px",
        borderRadius: "50% 50% 0 0",
        background: color,
        zIndex: 0
      }
    }
  );
}
function AvatarPreview({
  avatar,
  size = 120
}) {
  const scale = size / 120;
  const skinColor = getSkinColor(avatar.skinTone);
  const hairColor = getHairColor(avatar.hairColor);
  const outfitColor = getOutfitColor(avatar.outfit);
  const faceEmoji = getFaceEmoji(avatar.face);
  const accessoryEmoji = getAccessoryEmoji(avatar.accessory);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        position: "relative",
        width: `${120 * scale}px`,
        height: `${160 * scale}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      children: [
        accessoryEmoji && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              fontSize: `${28 * scale}px`,
              position: "absolute",
              top: `${-8 * scale}px`,
              zIndex: 10,
              lineHeight: 1
            },
            children: accessoryEmoji
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              position: "relative",
              width: `${70 * scale}px`,
              height: `${70 * scale}px`,
              borderRadius: "50%",
              background: skinColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: `${16 * scale}px`,
              zIndex: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              overflow: "visible"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    transform: `scale(${scale})`,
                    transformOrigin: "top center"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(HairShape, { style: avatar.hair, color: hairColor })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: `${30 * scale}px`,
                    zIndex: 3,
                    position: "relative"
                  },
                  children: faceEmoji
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              width: `${60 * scale}px`,
              height: `${70 * scale}px`,
              borderRadius: "12px 12px 8px 8px",
              background: outfitColor,
              marginTop: `${4 * scale}px`,
              zIndex: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
            }
          }
        )
      ]
    }
  );
}
function AvatarPage({ onBack }) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: coins = BigInt(0) } = useCoins();
  const { data: avatarData } = useQuery({
    queryKey: ["myAvatar"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyAvatar();
    },
    enabled: !!actor
  });
  const { data: ownedItems = [] } = useQuery({
    queryKey: ["myOwnedItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyOwnedItems();
    },
    enabled: !!actor
  });
  const [avatar, setAvatar] = reactExports.useState({
    skinTone: "light",
    hair: "default",
    hairColor: "black",
    face: "default",
    outfit: "default",
    accessory: "none"
  });
  reactExports.useEffect(() => {
    if (avatarData) setAvatar(avatarData);
  }, [avatarData]);
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (!actor) throw new Error("No actor");
      await actor.saveAvatarCustomization(
        data.skinTone,
        data.hair,
        data.hairColor,
        data.face,
        data.outfit,
        data.accessory
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAvatar"] });
      ue.success("Avatar saved! 🎨");
    },
    onError: () => ue.error("Failed to save avatar")
  });
  const purchaseMutation = useMutation({
    mutationFn: async (itemId) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.purchaseAvatarItem(itemId);
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOwnedItems"] });
      queryClient.invalidateQueries({ queryKey: ["myCoins"] });
      ue.success("Item purchased! 🛍️");
    },
    onError: (err) => ue.error(err.message || "Purchase failed")
  });
  const isItemOwned = (itemId) => ownedItems.includes(itemId);
  const canSelect = (category, id, isFree) => {
    if (isFree) return true;
    const itemId = `${category}:${id}`;
    return isItemOwned(itemId);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-screen pb-24",
      style: { background: "#1F1F1F" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 pt-12 pb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "avatar.back_button",
              onClick: onBack,
              className: "w-10 h-10 rounded-full flex items-center justify-center",
              style: { background: "rgba(255,255,255,0.08)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5 text-white" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-xl font-black text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-5 h-5", style: { color: "#D4AF37" } }),
            "My Avatar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 text-sm font-display font-bold",
              style: { color: "#D4AF37" },
              children: [
                "🪙 ",
                Number(coins)
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "customize", className: "flex-1 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "w-full mb-4",
              style: { background: "rgba(255,255,255,0.06)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    value: "customize",
                    "data-ocid": "avatar.customize.tab",
                    className: "flex-1 font-display font-bold",
                    children: "✏️ Customize"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "shop",
                    "data-ocid": "avatar.shop.tab",
                    className: "flex-1 font-display font-bold",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 mr-1" }),
                      "Shop"
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "customize", className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                className: "flex justify-center py-6",
                style: {
                  background: "rgba(212,175,55,0.06)",
                  borderRadius: "24px",
                  border: "1px solid rgba(212,175,55,0.2)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarPreview, { avatar, size: 140 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Skin Tone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: SKIN_TONES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "avatar.skin_tone.toggle",
                onClick: () => setAvatar((a) => ({ ...a, skinTone: s.id })),
                className: "flex flex-col items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-full transition-all",
                      style: {
                        background: s.color,
                        border: avatar.skinTone === s.id ? "3px solid #D4AF37" : "2px solid rgba(255,255,255,0.2)",
                        boxShadow: avatar.skinTone === s.id ? "0 0 10px rgba(212,175,55,0.5)" : "none"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/60 font-body", children: s.label })
                ]
              },
              s.id
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Hair Style", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: HAIR_STYLES.map((h) => {
              const owned = canSelect("hair", h.id, h.free);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "avatar.hair_style.toggle",
                  disabled: !owned,
                  onClick: () => owned && setAvatar((a) => ({ ...a, hair: h.id })),
                  className: "px-3 py-1.5 rounded-xl text-sm font-display font-bold transition-all",
                  style: {
                    background: avatar.hair === h.id ? "#D4AF37" : "rgba(255,255,255,0.08)",
                    color: avatar.hair === h.id ? "#1F1F1F" : owned ? "#fff" : "rgba(255,255,255,0.3)",
                    border: avatar.hair === h.id ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.12)"
                  },
                  children: [
                    h.label,
                    !owned && " 🔒"
                  ]
                },
                h.id
              );
            }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Hair Color", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: HAIR_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "avatar.hair_color.toggle",
                onClick: () => setAvatar((a) => ({ ...a, hairColor: c.id })),
                className: "flex flex-col items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-8 h-8 rounded-full transition-all",
                      style: {
                        background: c.color,
                        border: avatar.hairColor === c.id ? "3px solid #D4AF37" : "2px solid rgba(255,255,255,0.2)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/60 font-body", children: c.label })
                ]
              },
              c.id
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Face", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: FACE_PARTS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "avatar.face.toggle",
                onClick: () => setAvatar((a) => ({ ...a, face: f.id })),
                className: "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                style: {
                  background: avatar.face === f.id ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)",
                  border: avatar.face === f.id ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: f.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/60 font-body", children: f.label })
                ]
              },
              f.id
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Outfit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: OUTFITS.map((o) => {
              const owned = canSelect("outfit", o.id, o.free);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "avatar.outfit.toggle",
                  disabled: !owned,
                  onClick: () => owned && setAvatar((a) => ({ ...a, outfit: o.id })),
                  className: "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  style: {
                    background: avatar.outfit === o.id ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)",
                    border: avatar.outfit === o.id ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    opacity: owned ? 1 : 0.5
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-8 h-8 rounded-lg",
                        style: { background: o.color }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/60 font-body", children: [
                      o.label,
                      !owned && " 🔒"
                    ] })
                  ]
                },
                o.id
              );
            }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Accessories", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ACCESSORIES.map((a) => {
              const owned = canSelect("accessory", a.id, a.free);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "avatar.accessory.toggle",
                  disabled: !owned,
                  onClick: () => owned && setAvatar((av) => ({ ...av, accessory: a.id })),
                  className: "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  style: {
                    background: avatar.accessory === a.id ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)",
                    border: avatar.accessory === a.id ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    opacity: owned ? 1 : 0.5
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: a.emoji || "—" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/60 font-body", children: [
                      a.label,
                      !owned && " 🔒"
                    ] })
                  ]
                },
                a.id
              );
            }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "avatar.save_button",
                onClick: () => saveMutation.mutate(avatar),
                disabled: saveMutation.isPending,
                className: "w-full h-14 text-base font-display font-black rounded-2xl mb-4",
                style: { background: "#D4AF37", color: "#1F1F1F" },
                children: [
                  saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
                  "Save Avatar"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "shop", className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-white text-lg", children: "Avatar Shop" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "text-sm font-display font-bold",
                  style: { color: "#D4AF37" },
                  children: [
                    "🪙 ",
                    Number(coins),
                    " Coins"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 font-body mb-4", children: "Complete workouts to earn coins. Each item costs 30 🪙" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: SHOP_ITEMS.map((item) => {
              const owned = isItemOwned(item.id);
              const isPurchasing = purchaseMutation.isPending;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  className: "rounded-2xl overflow-hidden flex flex-col",
                  style: {
                    background: "rgba(255,255,255,0.05)",
                    border: owned ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.1)"
                  },
                  "data-ocid": `avatar.shop.item.${SHOP_ITEMS.indexOf(item) + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: item.img,
                        alt: item.label,
                        className: "w-full h-32 object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-white text-sm mb-2", children: item.label }),
                      owned ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "text-xs font-display font-bold px-3 py-1.5 rounded-xl text-center",
                          style: {
                            background: "rgba(212,175,55,0.2)",
                            color: "#D4AF37"
                          },
                          children: "✓ Owned"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          "data-ocid": "avatar.shop.buy_button",
                          size: "sm",
                          disabled: isPurchasing || Number(coins) < item.price,
                          onClick: () => purchaseMutation.mutate(item.id),
                          className: "w-full font-display font-bold rounded-xl text-xs",
                          style: { background: "#D4AF37", color: "#1F1F1F" },
                          children: isPurchasing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : "Buy 30 🪙"
                        }
                      )
                    ] })
                  ]
                },
                item.id
              );
            }) })
          ] })
        ] })
      ]
    }
  );
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl p-4",
      style: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h3",
          {
            className: "font-display font-bold text-sm mb-3",
            style: { color: "#D4AF37" },
            children: title
          }
        ),
        children
      ]
    }
  );
}
export {
  AvatarPreview,
  AvatarPage as default
};
