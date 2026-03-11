import { cn } from "@/lib/utils";
import {
  Apple,
  BarChart3,
  Dumbbell,
  Home,
  Swords,
  Target,
  Trophy,
  User,
} from "lucide-react";

type Page =
  | "home"
  | "exercises"
  | "pushups"
  | "tournaments"
  | "profile"
  | "battle"
  | "diet"
  | "admin"
  | "leaderboard";

interface BottomNavProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navRow1 = [
  { id: "home" as Page, label: "Home", icon: Home, ocid: "nav.home.link" },
  {
    id: "exercises" as Page,
    label: "Train",
    icon: Dumbbell,
    ocid: "nav.exercises.link",
  },
  {
    id: "pushups" as Page,
    label: "Push-Ups",
    icon: Target,
    ocid: "nav.pushups.link",
  },
  {
    id: "battle" as Page,
    label: "Battle",
    icon: Swords,
    ocid: "nav.battle.link",
  },
];

const navRow2 = [
  {
    id: "leaderboard" as Page,
    label: "Rank",
    icon: BarChart3,
    ocid: "nav.leaderboard.link",
  },
  {
    id: "tournaments" as Page,
    label: "Events",
    icon: Trophy,
    ocid: "nav.tournaments.link",
  },
  { id: "diet" as Page, label: "Diet", icon: Apple, ocid: "nav.diet.link" },
  {
    id: "profile" as Page,
    label: "Profile",
    icon: User,
    ocid: "nav.profile.link",
  },
];

function NavRow({
  items,
  current,
  onNavigate,
  isTopRow,
}: {
  items: typeof navRow1;
  current: Page;
  onNavigate: (page: Page) => void;
  isTopRow: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-4 h-10 ${isTopRow ? "border-b border-border/30" : ""}`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = current === item.id;
        return (
          <button
            key={item.id}
            type="button"
            data-ocid={item.ocid}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 transition-all duration-200 relative",
              isActive
                ? "text-neon-green"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-neon-green" />
            )}
            <Icon
              className={cn(
                "w-4 h-4 transition-all duration-200",
                isActive && "drop-shadow-[0_0_6px_oklch(0.85_0.22_130)]",
              )}
            />
            <span className="text-[8px] font-body font-medium leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Spacer for ad banner */}
      <div className="h-[60px] pointer-events-none" id="ad-spacer" />
      <div className="bg-card/95 backdrop-blur-md border-t border-border/60">
        <NavRow
          items={navRow1}
          current={current}
          onNavigate={onNavigate}
          isTopRow
        />
        <NavRow
          items={navRow2}
          current={current}
          onNavigate={onNavigate}
          isTopRow={false}
        />
      </div>
    </nav>
  );
}
