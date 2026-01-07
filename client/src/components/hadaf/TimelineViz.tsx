import { motion } from "framer-motion";

interface TimelineVizProps {
  progress: number; // 0 to 100
  startDate: Date;
  finishDate: Date;
  isStretched?: boolean;
}

export function TimelineViz({ progress, isStretched }: TimelineVizProps) {
  return (
    <div className="w-full px-6 py-8">
      <div className="relative h-2 bg-secondary rounded-full w-full overflow-hidden">
        {/* Elastic Background Track */}
        <motion.div 
          className="absolute inset-0 bg-muted/20"
          animate={{ scaleX: isStretched ? 1.1 : 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        />

        {/* Progress Fill */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-accent"
          initial={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />

        {/* Current Position Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-6 w-1 bg-foreground shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10"
          initial={{ left: `${progress}%` }}
          animate={{ left: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      <div className="flex justify-between mt-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
        <span>Start</span>
        <span className="text-foreground font-bold">Today</span>
        <span>Finish</span>
      </div>
    </div>
  );
}
