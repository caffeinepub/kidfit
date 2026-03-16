import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Save, ShoppingBag, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AvatarData } from "../backend.d";
import type { backendInterface } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useCoins } from "../hooks/useCoins";

interface AvatarPageProps {
  onBack: () => void;
}

const SKIN_TONES = [
  { id: "light", label: "Light", color: "#FDBCB4" },
  { id: "medium", label: "Medium", color: "#C68642" },
  { id: "dark", label: "Dark", color: "#8D5524" },
  { id: "cool", label: "Cool", color: "#FFD1DC" },
];

const HAIR_STYLES = [
  { id: "default", label: "Default", free: true },
  { id: "spiky", label: "Spiky", free: false },
  { id: "afro", label: "Afro", free: false },
  { id: "wavy", label: "Wavy", free: true },
  { id: "buzz", label: "Buzz Cut", free: true },
];

const HAIR_COLORS = [
  { id: "black", label: "Black", color: "#1a1a1a" },
  { id: "brown", label: "Brown", color: "#7B3F00" },
  { id: "blonde", label: "Blonde", color: "#F0D060" },
  { id: "gold", label: "Gold", color: "#D4AF37" },
  { id: "red", label: "Red", color: "#CC2200" },
  { id: "blue", label: "Blue", color: "#2255CC" },
];

const FACE_PARTS = [
  { id: "default", label: "Default", emoji: "😐", free: true },
  { id: "happy", label: "Happy", emoji: "😄", free: true },
  { id: "cool", label: "Cool", emoji: "😎", free: true },
  { id: "fierce", label: "Fierce", emoji: "😤", free: true },
  { id: "sleepy", label: "Sleepy", emoji: "😴", free: true },
];

const OUTFITS = [
  { id: "default", label: "Default", color: "#666", free: true },
  { id: "red-hoodie", label: "Red Hoodie", color: "#CC2200", free: false },
  { id: "blue-jersey", label: "Blue Jersey", color: "#2255CC", free: false },
  {
    id: "gold-champion",
    label: "Gold Champion",
    color: "#D4AF37",
    free: false,
  },
  { id: "black-ninja", label: "Black Ninja", color: "#111", free: true },
];

const ACCESSORIES = [
  { id: "none", label: "None", emoji: "", free: true },
  { id: "crown", label: "Crown", emoji: "👑", free: false },
  { id: "headband", label: "Headband", emoji: "🎽", free: true },
  { id: "glasses", label: "Glasses", emoji: "🕶️", free: true },
  { id: "cap", label: "Cap", emoji: "🧢", free: true },
];

const SHOP_ITEMS = [
  {
    id: "outfit:red-hoodie",
    label: "Red Hoodie",
    category: "outfit",
    img: "/assets/generated/avatar-outfit-red-hoodie-transparent.dim_200x200.png",
    price: 30,
  },
  {
    id: "outfit:blue-jersey",
    label: "Blue Jersey",
    category: "outfit",
    img: "/assets/generated/avatar-outfit-blue-jersey-transparent.dim_200x200.png",
    price: 30,
  },
  {
    id: "outfit:gold-champion",
    label: "Gold Champion",
    category: "outfit",
    img: "/assets/generated/avatar-outfit-gold-champion-transparent.dim_200x200.png",
    price: 30,
  },
  {
    id: "hair:spiky",
    label: "Spiky Hair",
    category: "hair",
    img: "/assets/generated/avatar-hair-spiky-transparent.dim_200x200.png",
    price: 30,
  },
  {
    id: "hair:afro",
    label: "Afro Hair",
    category: "hair",
    img: "/assets/generated/avatar-hair-afro-transparent.dim_200x200.png",
    price: 30,
  },
  {
    id: "accessory:crown",
    label: "Gold Crown",
    category: "accessory",
    img: "/assets/generated/avatar-accessory-crown-transparent.dim_200x200.png",
    price: 30,
  },
];

function getSkinColor(id: string) {
  return SKIN_TONES.find((s) => s.id === id)?.color ?? "#FDBCB4";
}
function getHairColor(id: string) {
  return HAIR_COLORS.find((h) => h.id === id)?.color ?? "#1a1a1a";
}
function getOutfitColor(id: string) {
  return OUTFITS.find((o) => o.id === id)?.color ?? "#666";
}
function getFaceEmoji(id: string) {
  return FACE_PARTS.find((f) => f.id === id)?.emoji ?? "😐";
}
function getAccessoryEmoji(id: string) {
  return ACCESSORIES.find((a) => a.id === id)?.emoji ?? "";
}

function HairShape({ style, color }: { style: string; color: string }) {
  if (style === "afro") {
    return (
      <div
        style={{
          position: "absolute",
          top: "-22px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90px",
          height: "70px",
          borderRadius: "50%",
          background: color,
          zIndex: 0,
        }}
      />
    );
  }
  if (style === "spiky") {
    return (
      <div
        style={{
          position: "absolute",
          top: "-28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "4px",
          zIndex: 0,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "10px",
              height: `${20 + (i % 3 === 1 ? 14 : i % 2 === 0 ? 8 : 4)}px`,
              background: color,
              borderRadius: "50% 50% 0 0",
              transform: `rotate(${(i - 2) * 12}deg)`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>
    );
  }
  if (style === "wavy") {
    return (
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "76px",
          height: "24px",
          borderRadius: "40% 40% 20% 20%",
          background: color,
          zIndex: 0,
        }}
      />
    );
  }
  if (style === "buzz") {
    return (
      <div
        style={{
          position: "absolute",
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "72px",
          height: "14px",
          borderRadius: "50% 50% 0 0",
          background: color,
          zIndex: 0,
        }}
      />
    );
  }
  // default - short hair
  return (
    <div
      style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "70px",
        height: "20px",
        borderRadius: "50% 50% 0 0",
        background: color,
        zIndex: 0,
      }}
    />
  );
}

export function AvatarPreview({
  avatar,
  size = 120,
}: { avatar: AvatarData; size?: number }) {
  const scale = size / 120;
  const skinColor = getSkinColor(avatar.skinTone);
  const hairColor = getHairColor(avatar.hairColor);
  const outfitColor = getOutfitColor(avatar.outfit);
  const faceEmoji = getFaceEmoji(avatar.face);
  const accessoryEmoji = getAccessoryEmoji(avatar.accessory);

  return (
    <div
      style={{
        position: "relative",
        width: `${120 * scale}px`,
        height: `${160 * scale}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Accessory above head */}
      {accessoryEmoji && (
        <div
          style={{
            fontSize: `${28 * scale}px`,
            position: "absolute",
            top: `${-8 * scale}px`,
            zIndex: 10,
            lineHeight: 1,
          }}
        >
          {accessoryEmoji}
        </div>
      )}
      {/* Head */}
      <div
        style={{
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
          overflow: "visible",
        }}
      >
        {/* Hair on head */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <HairShape style={avatar.hair} color={hairColor} />
        </div>
        {/* Face */}
        <span
          style={{
            fontSize: `${30 * scale}px`,
            zIndex: 3,
            position: "relative",
          }}
        >
          {faceEmoji}
        </span>
      </div>
      {/* Body */}
      <div
        style={{
          width: `${60 * scale}px`,
          height: `${70 * scale}px`,
          borderRadius: "12px 12px 8px 8px",
          background: outfitColor,
          marginTop: `${4 * scale}px`,
          zIndex: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

export default function AvatarPage({ onBack }: AvatarPageProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: coins = BigInt(0) } = useCoins();

  const { data: avatarData } = useQuery<AvatarData | null>({
    queryKey: ["myAvatar"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as unknown as backendInterface).getMyAvatar();
    },
    enabled: !!actor,
  });

  const { data: ownedItems = [] } = useQuery<string[]>({
    queryKey: ["myOwnedItems"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as backendInterface).getMyOwnedItems();
    },
    enabled: !!actor,
  });

  const [avatar, setAvatar] = useState<AvatarData>({
    skinTone: "light",
    hair: "default",
    hairColor: "black",
    face: "default",
    outfit: "default",
    accessory: "none",
  });

  useEffect(() => {
    if (avatarData) setAvatar(avatarData);
  }, [avatarData]);

  const saveMutation = useMutation({
    mutationFn: async (data: AvatarData) => {
      if (!actor) throw new Error("No actor");
      await (actor as unknown as backendInterface).saveAvatarCustomization(
        data.skinTone,
        data.hair,
        data.hairColor,
        data.face,
        data.outfit,
        data.accessory,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAvatar"] });
      toast.success("Avatar saved! 🎨");
    },
    onError: () => toast.error("Failed to save avatar"),
  });

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!actor) throw new Error("No actor");
      const result = await (
        actor as unknown as backendInterface
      ).purchaseAvatarItem(itemId);
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOwnedItems"] });
      queryClient.invalidateQueries({ queryKey: ["myCoins"] });
      toast.success("Item purchased! 🛍️");
    },
    onError: (err: Error) => toast.error(err.message || "Purchase failed"),
  });

  const isItemOwned = (itemId: string) => ownedItems.includes(itemId);

  const canSelect = (category: string, id: string, isFree: boolean) => {
    if (isFree) return true;
    const itemId = `${category}:${id}`;
    return isItemOwned(itemId);
  };

  return (
    <div
      className="flex flex-col min-h-screen pb-24"
      style={{ background: "#1F1F1F" }}
    >
      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center justify-between">
        <button
          type="button"
          data-ocid="avatar.back_button"
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="font-display text-xl font-black text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5" style={{ color: "#D4AF37" }} />
          My Avatar
        </h1>
        <div
          className="flex items-center gap-1 text-sm font-display font-bold"
          style={{ color: "#D4AF37" }}
        >
          🪙 {Number(coins)}
        </div>
      </header>

      <Tabs defaultValue="customize" className="flex-1 px-4">
        <TabsList
          className="w-full mb-4"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <TabsTrigger
            value="customize"
            data-ocid="avatar.customize.tab"
            className="flex-1 font-display font-bold"
          >
            ✏️ Customize
          </TabsTrigger>
          <TabsTrigger
            value="shop"
            data-ocid="avatar.shop.tab"
            className="flex-1 font-display font-bold"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Shop
          </TabsTrigger>
        </TabsList>

        {/* CUSTOMIZE TAB */}
        <TabsContent value="customize" className="space-y-5">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center py-6"
            style={{
              background: "rgba(212,175,55,0.06)",
              borderRadius: "24px",
              border: "1px solid rgba(212,175,55,0.2)",
            }}
          >
            <AvatarPreview avatar={avatar} size={140} />
          </motion.div>

          {/* Skin Tone */}
          <Section title="Skin Tone">
            <div className="flex gap-3 flex-wrap">
              {SKIN_TONES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  data-ocid="avatar.skin_tone.toggle"
                  onClick={() => setAvatar((a) => ({ ...a, skinTone: s.id }))}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-10 h-10 rounded-full transition-all"
                    style={{
                      background: s.color,
                      border:
                        avatar.skinTone === s.id
                          ? "3px solid #D4AF37"
                          : "2px solid rgba(255,255,255,0.2)",
                      boxShadow:
                        avatar.skinTone === s.id
                          ? "0 0 10px rgba(212,175,55,0.5)"
                          : "none",
                    }}
                  />
                  <span className="text-[10px] text-white/60 font-body">
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* Hair Style */}
          <Section title="Hair Style">
            <div className="flex gap-2 flex-wrap">
              {HAIR_STYLES.map((h) => {
                const owned = canSelect("hair", h.id, h.free);
                return (
                  <button
                    key={h.id}
                    type="button"
                    data-ocid="avatar.hair_style.toggle"
                    disabled={!owned}
                    onClick={() =>
                      owned && setAvatar((a) => ({ ...a, hair: h.id }))
                    }
                    className="px-3 py-1.5 rounded-xl text-sm font-display font-bold transition-all"
                    style={{
                      background:
                        avatar.hair === h.id
                          ? "#D4AF37"
                          : "rgba(255,255,255,0.08)",
                      color:
                        avatar.hair === h.id
                          ? "#1F1F1F"
                          : owned
                            ? "#fff"
                            : "rgba(255,255,255,0.3)",
                      border:
                        avatar.hair === h.id
                          ? "2px solid #D4AF37"
                          : "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {h.label}
                    {!owned && " 🔒"}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Hair Color */}
          <Section title="Hair Color">
            <div className="flex gap-3 flex-wrap">
              {HAIR_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-ocid="avatar.hair_color.toggle"
                  onClick={() => setAvatar((a) => ({ ...a, hairColor: c.id }))}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      background: c.color,
                      border:
                        avatar.hairColor === c.id
                          ? "3px solid #D4AF37"
                          : "2px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <span className="text-[10px] text-white/60 font-body">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* Face */}
          <Section title="Face">
            <div className="flex gap-2 flex-wrap">
              {FACE_PARTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  data-ocid="avatar.face.toggle"
                  onClick={() => setAvatar((a) => ({ ...a, face: f.id }))}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                  style={{
                    background:
                      avatar.face === f.id
                        ? "rgba(212,175,55,0.2)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      avatar.face === f.id
                        ? "2px solid #D4AF37"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-[10px] text-white/60 font-body">
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* Outfit */}
          <Section title="Outfit">
            <div className="flex gap-2 flex-wrap">
              {OUTFITS.map((o) => {
                const owned = canSelect("outfit", o.id, o.free);
                return (
                  <button
                    key={o.id}
                    type="button"
                    data-ocid="avatar.outfit.toggle"
                    disabled={!owned}
                    onClick={() =>
                      owned && setAvatar((a) => ({ ...a, outfit: o.id }))
                    }
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                    style={{
                      background:
                        avatar.outfit === o.id
                          ? "rgba(212,175,55,0.2)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        avatar.outfit === o.id
                          ? "2px solid #D4AF37"
                          : "1px solid rgba(255,255,255,0.1)",
                      opacity: owned ? 1 : 0.5,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg"
                      style={{ background: o.color }}
                    />
                    <span className="text-[10px] text-white/60 font-body">
                      {o.label}
                      {!owned && " 🔒"}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Accessories */}
          <Section title="Accessories">
            <div className="flex gap-2 flex-wrap">
              {ACCESSORIES.map((a) => {
                const owned = canSelect("accessory", a.id, a.free);
                return (
                  <button
                    key={a.id}
                    type="button"
                    data-ocid="avatar.accessory.toggle"
                    disabled={!owned}
                    onClick={() =>
                      owned && setAvatar((av) => ({ ...av, accessory: a.id }))
                    }
                    className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                    style={{
                      background:
                        avatar.accessory === a.id
                          ? "rgba(212,175,55,0.2)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        avatar.accessory === a.id
                          ? "2px solid #D4AF37"
                          : "1px solid rgba(255,255,255,0.1)",
                      opacity: owned ? 1 : 0.5,
                    }}
                  >
                    <span className="text-xl">{a.emoji || "—"}</span>
                    <span className="text-[10px] text-white/60 font-body">
                      {a.label}
                      {!owned && " 🔒"}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Save Button */}
          <Button
            data-ocid="avatar.save_button"
            onClick={() => saveMutation.mutate(avatar)}
            disabled={saveMutation.isPending}
            className="w-full h-14 text-base font-display font-black rounded-2xl mb-4"
            style={{ background: "#D4AF37", color: "#1F1F1F" }}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Avatar
          </Button>
        </TabsContent>

        {/* SHOP TAB */}
        <TabsContent value="shop" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display font-bold text-white text-lg">
              Avatar Shop
            </h2>
            <div
              className="text-sm font-display font-bold"
              style={{ color: "#D4AF37" }}
            >
              🪙 {Number(coins)} Coins
            </div>
          </div>
          <p className="text-xs text-white/50 font-body mb-4">
            Complete workouts to earn coins. Each item costs 30 🪙
          </p>
          <div className="grid grid-cols-2 gap-3">
            {SHOP_ITEMS.map((item) => {
              const owned = isItemOwned(item.id);
              const isPurchasing = purchaseMutation.isPending;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: owned
                      ? "1px solid rgba(212,175,55,0.5)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                  data-ocid={
                    `avatar.shop.item.${SHOP_ITEMS.indexOf(item) + 1}` as string
                  }
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <div className="font-display font-bold text-white text-sm mb-2">
                      {item.label}
                    </div>
                    {owned ? (
                      <div
                        className="text-xs font-display font-bold px-3 py-1.5 rounded-xl text-center"
                        style={{
                          background: "rgba(212,175,55,0.2)",
                          color: "#D4AF37",
                        }}
                      >
                        ✓ Owned
                      </div>
                    ) : (
                      <Button
                        data-ocid="avatar.shop.buy_button"
                        size="sm"
                        disabled={isPurchasing || Number(coins) < item.price}
                        onClick={() => purchaseMutation.mutate(item.id)}
                        className="w-full font-display font-bold rounded-xl text-xs"
                        style={{ background: "#D4AF37", color: "#1F1F1F" }}
                      >
                        {isPurchasing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Buy 30 🪙"
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3
        className="font-display font-bold text-sm mb-3"
        style={{ color: "#D4AF37" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
