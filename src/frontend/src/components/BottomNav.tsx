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

const navItems = [
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

export default function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Spacer for ad banner */}
      <div className="h-[60px] pointer-events-none" id="ad-spacer" />
      <div
        className="bg-card border-t border-border overflow-x-auto scrollbar-none"
        style={{ height: "64px" }}
      >
        <div
          className="flex items-center justify-start px-1 h-full"
          style={{ minWidth: "max-content", gap: "0" }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = current === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-ocid={item.ocid}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-xl transition-all duration-200",
                  "min-w-[52px] flex-shrink-0",
                  isActive
                    ? "text-neon-green scale-105"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive && "drop-shadow-[0_0_6px_oklch(0.85_0.22_130)]",
                  )}
                />
                <span className="text-[9px] font-body font-medium leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
