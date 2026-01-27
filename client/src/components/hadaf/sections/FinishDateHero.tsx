import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FinishDateHeroProps {
  date: Date;
  status: "on-track" | "warning" | "slip";
}

export function FinishDateHero({ date, status }: FinishDateHeroProps) {
  const colorMap = {
    "on-track": "text-foreground",
    "warning": "text-yellow-500",
    "slip": "text-destructive",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-24 z-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground font-medium uppercase tracking-widest text-sm mb-4"
      >
        Projected Khatam
      </motion.div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.h1
            key={date.toISOString()} // Triggers animation on date change
            initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -50, opacity: 0, filter: "blur(10px)" }}
            transition={{
              type: "spring",
              stiffness: status === "slip" ? 100 : 300, // Heavier feel for slips
              damping: status === "slip" ? 20 : 30,
              mass: status === "slip" ? 2 : 1, // Heavier mass for slips
            }}
            className={cn(
              "font-display text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter tabular-nums whitespace-nowrap text-center w-full px-4",
              colorMap[status],
              status === "slip" && "text-shadow-glow" // visual emphasis on slip
            )}
          >
            {format(date, "d MMM yyyy")}
          </motion.h1>
        </AnimatePresence>
      </div>
      
      {status === "slip" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-destructive mt-4 font-medium"
        >
          Recovery required. Finish date moved.
        </motion.div>
      )}
    </div>
  );
}
