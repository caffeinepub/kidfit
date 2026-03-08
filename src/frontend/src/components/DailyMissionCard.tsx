import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Flame, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DailyMission {
  title: string;
  desc: string;
  target: number;
  unit: "reps" | "seconds";
  xpReward: number;
  badge: string;
  exercise: string;
}

const MISSIONS_BY_DAY: Record<number, DailyMission> = {
  1: {
    title: "Push-Up Blitz",
    desc: "50 push-ups today",
    target: 50,
    unit: "reps",
    xpReward: 200,
    badge: "🎯",
    exercise: "Push-Ups",
  },
  2: {
    title: "Plank Power",
    desc: "Hold a 2-minute plank",
    target: 120,
    unit: "seconds",
    xpReward: 150,
    badge: "⏱️",
    exercise: "Plank",
  },
  3: {
    title: "Jump King",
    desc: "100 jumping jacks",
    target: 100,
    unit: "reps",
    xpReward: 250,
    badge: "🦘",
    exercise: "Jumping Jacks",
  },
  4: {
    title: "Squat Squad",
    desc: "30 squats",
    target: 30,
    unit: "reps",
    xpReward: 180,
    badge: "🏋️",
    exercise: "Squats",
  },
  5: {
    title: "Burpee Beast",
    desc: "20 burpees",
    target: 20,
    unit: "reps",
    xpReward: 300,
    badge: "🔥",
    exercise: "Burpees",
  },
  6: {
    title: "Wall Warrior",
    desc: "1-minute wall sit",
    target: 60,
    unit: "seconds",
    xpReward: 200,
    badge: "🧱",
    exercise: "Wall Sit",
  },
  0: {
    title: "Push-Up Legend",
    desc: "75 push-ups today",
    target: 75,
    unit: "reps",
    xpReward: 350,
    badge: "👑",
    exercise: "Push-Ups",
  },
};

interface MissionProgress {
  date: string;
  progress: number;
  completed: boolean;
}

function getTodayKey(username: string): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `kidfit_daily_${username}_${yyyy}-${mm}-${dd}`;
}

function getTodayString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

interface DailyMissionCardProps {
  username: string;
}

export default function DailyMissionCard({ username }: DailyMissionCardProps) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ...
  const mission = MISSIONS_BY_DAY[dayOfWeek];

  const [missionData, setMissionData] = useState<MissionProgress>(() => {
    const key = getTodayKey(username);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MissionProgress;
        if (parsed.date === getTodayString()) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    return { date: getTodayString(), progress: 0, completed: false };
  });

  const [logOpen, setLogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Reset progress if it's a new day
    const storedDate = missionData.date;
    const todayStr = getTodayString();
    if (storedDate !== todayStr) {
      const newData: MissionProgress = {
        date: todayStr,
        progress: 0,
        completed: false,
      };
      setMissionData(newData);
      localStorage.setItem(getTodayKey(username), JSON.stringify(newData));
    }
  }, [username, missionData.date]);

  const progressPercent = Math.min(
    100,
    Math.round((missionData.progress / mission.target) * 100),
  );

  const handleLogSubmit = () => {
    const val = Number.parseInt(inputValue, 10);
    if (Number.isNaN(val) || val <= 0) {
      toast.error("Please enter a valid number");
      return;
    }

    const newProgress = Math.min(mission.target, missionData.progress + val);
    const completed = newProgress >= mission.target;
    const newData: MissionProgress = {
      date: getTodayString(),
      progress: newProgress,
      completed,
    };
    setMissionData(newData);
    localStorage.setItem(getTodayKey(username), JSON.stringify(newData));
    setInputValue("");
    setLogOpen(false);

    if (completed && !missionData.completed) {
      toast.success(`🎉 Mission Complete! +${mission.xpReward} XP earned!`, {
        duration: 4000,
      });
    } else {
      toast.success(`+${val} ${mission.unit} logged! Keep going!`);
    }
  };

  return (
    <>
      <motion.div
        data-ocid="daily_mission.card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="card-sporty p-5 relative overflow-hidden"
        style={{
          background: missionData.completed
            ? "linear-gradient(135deg, oklch(0.15 0.06 150), oklch(0.2 0.08 150 / 0.6))"
            : "linear-gradient(135deg, oklch(0.15 0.04 265), oklch(0.18 0.06 42 / 0.4))",
          border: missionData.completed
            ? "1px solid oklch(0.55 0.18 150 / 0.5)"
            : undefined,
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 text-7xl opacity-10 -translate-y-1 translate-x-1 select-none pointer-events-none">
          {mission.badge}
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-orange/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-neon-orange" />
            </div>
            <div>
              <div className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                Daily Mission
              </div>
              <h3 className="font-display font-black text-base leading-tight text-foreground">
                {mission.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-primary/15 border border-primary/20 rounded-full px-2 py-1">
            <Zap className="w-3 h-3 text-neon-green" />
            <span className="text-xs font-display font-bold text-neon-green">
              +{mission.xpReward} XP
            </span>
          </div>
        </div>

        <p className="text-sm font-body text-muted-foreground mb-3">
          {mission.desc}
        </p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs font-body mb-1.5">
            <span className="text-muted-foreground">
              {missionData.progress} / {mission.target} {mission.unit}
            </span>
            <span
              className={`font-semibold ${missionData.completed ? "text-neon-green" : "text-muted-foreground"}`}
            >
              {progressPercent}%
            </span>
          </div>
          <Progress
            value={progressPercent}
            className="h-2.5"
            style={
              missionData.completed
                ? ({
                    "--tw-ring-color": "oklch(0.7 0.18 150)",
                  } as React.CSSProperties)
                : undefined
            }
          />
        </div>

        {/* Completion state or log button */}
        <AnimatePresence mode="wait">
          {missionData.completed ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 py-2"
              style={{ textShadow: "0 0 20px oklch(0.7 0.18 150 / 0.6)" }}
            >
              <CheckCircle2 className="w-5 h-5 text-neon-green" />
              <span className="font-display font-black text-neon-green text-base">
                Mission Complete! {mission.badge}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="log"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Button
                data-ocid="daily_mission.log.button"
                onClick={() => setLogOpen(true)}
                size="sm"
                className="w-full bg-primary/20 hover:bg-primary/30 text-neon-green border border-primary/30 font-display font-bold"
                variant="outline"
              >
                Log Progress →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Log Progress Dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl flex items-center gap-2">
              {mission.badge} Log {mission.exercise}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground font-body">
              How many {mission.unit === "seconds" ? "seconds" : "reps"} did you
              complete?
            </p>
            <div className="space-y-1.5">
              <Label
                htmlFor="mission-progress-input"
                className="text-xs text-muted-foreground font-body uppercase tracking-wider"
              >
                {mission.unit === "seconds" ? "Seconds held" : "Reps completed"}
              </Label>
              <Input
                id="mission-progress-input"
                data-ocid="daily_mission.progress.input"
                type="number"
                min="1"
                max={mission.target}
                placeholder={`Enter ${mission.unit}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogSubmit()}
                className="bg-muted/30 border-border font-body text-lg text-center h-12"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLogOpen(false)}
                className="flex-1 border-border font-body"
              >
                Cancel
              </Button>
              <Button
                data-ocid="daily_mission.submit.button"
                onClick={handleLogSubmit}
                className="flex-1 bg-primary text-primary-foreground font-display font-bold glow-green"
              >
                Log It! 💪
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
