import { cn } from "@/lib/utils";
import {
  Apple,
  BarChart3,
  Dumbbell,
  Home,
  Swords,
  Target,
  User,
  Users,
} from "lucide-react";
import type { Page } from "../App";

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
    id: "friends" as Page,
    label: "Friends",
    icon: Users,
    ocid: "nav.friends.link",
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
      className={`grid grid-cols-4 h-11 ${
        isTopRow ? "border-b border-border/30" : ""
      }`}
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
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.82 0.17 90), transparent)",
                  boxShadow: "0 0 8px oklch(0.82 0.17 90 / 0.8)",
                }}
              />
            )}
            {isActive && (
              <span
                className="absolute inset-0 rounded-sm pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 50% 40%, oklch(0.82 0.17 90 / 0.12) 0%, transparent 70%)",
                }}
              />
            )}
            <Icon
              className={cn(
                "w-4 h-4 transition-all duration-200",
                isActive ? "scale-110" : "",
              )}
              style={
                isActive
                  ? {
                      color: "oklch(0.82 0.17 90)",
                      filter: "drop-shadow(0 0 6px oklch(0.82 0.17 90 / 0.7))",
                    }
                  : undefined
              }
            />
            <span
              className={cn(
                "text-[8px] font-body font-medium leading-none transition-all duration-200",
                isActive ? "font-bold" : "",
              )}
              style={isActive ? { color: "oklch(0.82 0.17 90)" } : undefined}
            >
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
      <div className="h-[60px] pointer-events-none" id="ad-spacer" />
      <div
        className="border-t border-border/60"
        style={{
          background:
            "linear-gradient(to top, oklch(0.12 0.02 42 / 0.98), oklch(0.14 0.025 42 / 0.95))",
          backdropFilter: "blur(16px)",
        }}
      >
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
