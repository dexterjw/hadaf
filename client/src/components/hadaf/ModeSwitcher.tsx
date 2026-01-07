import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModeSwitcherProps {
  mode: "timeline" | "habit";
  setMode: (mode: "timeline" | "habit") => void;
}

export function ModeSwitcher({ mode, setMode }: ModeSwitcherProps) {
  return (
    <div className="flex items-center justify-center p-1 bg-secondary/50 backdrop-blur-md rounded-full border border-border/50 w-fit mx-auto mb-8">
      <button
        onClick={() => setMode("timeline")}
        className={cn(
          "relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10",
          mode === "timeline" ? "text-background" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {mode === "timeline" && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-foreground rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        Timeline
      </button>

      <button
        onClick={() => setMode("habit")}
        className={cn(
          "relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10",
          mode === "habit" ? "text-background" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {mode === "habit" && (
          <motion.div
            layoutId="active-pill"
            className="absolute inset-0 bg-foreground rounded-full -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        Daily Habit
      </button>
    </div>
  );
}
