import { useState } from "react";
import { addDays, subDays } from "date-fns";
import { FinishDateHero } from "@/components/hadaf/FinishDateHero";
import { TimelineViz } from "@/components/hadaf/TimelineViz";
import { ModeSwitcher } from "@/components/hadaf/ModeSwitcher";
import { DailyActionCard } from "@/components/hadaf/DailyActionCard";
import { RealityPanel } from "@/components/hadaf/RealityPanel";
import { motion, AnimatePresence } from "framer-motion";

import { ProgressDeficitChart } from "@/components/hadaf/ProgressDeficitChart";
import { ProgressSurplusChart } from "@/components/hadaf/ProgressSurplusChart";
import { JourneyMap } from "@/components/hadaf/JourneyMap";

import { Link } from "wouter";
import { BarChart3, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HadafPrototype() {
  const [mode, setMode] = useState<"timeline" | "habit">("timeline");
  const [finishDate, setFinishDate] = useState(addDays(new Date(), 180)); // ~6 months out
  const [status, setStatus] = useState<"on-track" | "warning" | "slip">("on-track");
  const [progress, setProgress] = useState(35); // 35% done
  
  // Handlers for interactions
  const handleDailyAction = (type: "hit" | "miss" | "partial") => {
    if (type === "miss") {
      setStatus("slip");
      setFinishDate((prev) => addDays(prev, 3)); // Penalty is heavy
      // Reset status after animation
      setTimeout(() => setStatus("warning"), 2000);
    } else if (type === "hit") {
      setStatus("on-track");
      setFinishDate((prev) => subDays(prev, 1)); // Small reward
      setProgress((prev) => Math.min(prev + 1, 100));
    } else {
      setStatus("warning");
      // Neutral date impact, but progress slows
      setProgress((prev) => Math.min(prev + 0.5, 100));
    }
  };

  const handleRealityToggle = (impactDays: number) => {
    setFinishDate((prev) => addDays(prev, impactDays));
    setStatus("warning");
    setTimeout(() => setStatus("on-track"), 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 pt-8 pb-20 overflow-hidden relative selection:bg-accent/30">
      {/* Ambient Background Gradient - Subtle */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Dashboard Link */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Link href="/log">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <PenTool className="w-4 h-4" />
            Log Progress
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-2xl mx-auto z-10 flex flex-col h-full">
        {/* Header / Mode Switcher */}
        <ModeSwitcher mode={mode} setMode={setMode} />

        {/* Hero Section - The Finish Date */}
        {/* Always visible but layout shifts slightly based on mode */}
        <motion.div 
          layout 
          className="flex-1 flex flex-col justify-center min-h-[40vh]"
        >
          <FinishDateHero date={finishDate} status={status} />
          
          <motion.div layout className="mt-8">
            <TimelineViz 
              progress={progress} 
              startDate={subDays(new Date(), 60)} 
              finishDate={finishDate}
              isStretched={status === 'slip'}
            />
          </motion.div>
        </motion.div>

        {/* Dynamic Lower Section */}
        <div className="mt-12 min-h-[300px]">
          <AnimatePresence mode="wait">
            {mode === "timeline" ? (
              <motion.div
                key="timeline-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8 max-w-sm mx-auto">
                  <p className="text-lg font-medium">Ownership Required</p>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    Adjusting these variables will instantly shift your finish date. 
                    No negotiation.
                  </p>
                </div>

                {/* NEW: Journey Map (Marhala View) */}
                <JourneyMap currentJuz={4} />

                <RealityPanel onToggle={handleRealityToggle} />
                
                {/* Progress Deficit Chart */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ProgressDeficitChart />
                </motion.div>

                {/* Progress Surplus Chart (Demo) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <ProgressSurplusChart />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="habit-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                 <div className="text-center mb-8 max-w-sm mx-auto">
                  <p className="text-lg font-medium">Today is the Lever</p>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    Your actions today directly impact the timeline above.
                  </p>
                </div>
                <DailyActionCard onAction={handleDailyAction} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
