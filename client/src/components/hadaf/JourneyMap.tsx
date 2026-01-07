import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, CheckCircle2, Circle } from "lucide-react";

// Naming convention: "Stage" (Marhala) -> "Juz" (Part)
// Using "Marhala" (Stage) as the term for the big blocks.

interface JourneyMapProps {
  currentJuz: number; // 1-30
}

export function JourneyMap({ currentJuz }: JourneyMapProps) {
  // Define the 3 major stages (Marhalas)
  const stages = [
    {
      id: 1,
      name: "The Foundation", // Marhala 1: Al-Ta'sis
      range: [1, 10],
      status: "active",
      description: "Building the habit & memory muscles"
    },
    {
      id: 2,
      name: "The Momentum", // Marhala 2: Al-Inqilaq
      range: [11, 20],
      status: "locked",
      description: "Cruising altitude & consistency"
    },
    {
      id: 3,
      name: "The Mastery", // Marhala 3: Al-Itqan
      range: [21, 30],
      status: "locked",
      description: "Final stretch & refinement"
    }
  ];

  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">The Journey (Al-Rihla)</h3>
      </div>
      
      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stages.map((stage) => {
          const isActive = stage.status === "active";
          const isLocked = stage.status === "locked";
          const isComplete = false; // logic would go here

          return (
            <motion.div
              key={stage.id}
              className={cn(
                "relative p-6 rounded-2xl border transition-all overflow-hidden group",
                isActive 
                  ? "bg-secondary/40 border-primary/20 shadow-lg" 
                  : "bg-card/20 border-border/50 opacity-60"
              )}
            >
              {/* Background Number */}
              <div className="absolute -right-4 -bottom-8 text-9xl font-display font-bold text-background opacity-10 select-none group-hover:opacity-20 transition-opacity">
                {stage.id}
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Marhala {stage.id}
                  </div>
                  <h4 className={cn("font-display text-xl font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {stage.name}
                  </h4>
                </div>
                {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                {isComplete && <CheckCircle2 className="w-5 h-5 text-accent" />}
              </div>

              {/* Progressive Disclosure: Only show detailed steps for Active Stage */}
              {isActive ? (
                <div className="space-y-4 relative z-10">
                   {/* Mini Progress Bar for this Stage */}
                   <div className="h-1 w-full bg-background/50 rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[35%]" />
                   </div>
                   
                   {/* Granular Juz Breakdown (The "Next Steps") */}
                   <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const juzNum = stage.range[0] + i;
                        const status = juzNum < currentJuz ? "done" : juzNum === currentJuz ? "current" : "future";
                        
                        return (
                          <div 
                            key={juzNum} 
                            className={cn(
                              "h-8 rounded flex items-center justify-center text-xs font-mono border",
                              status === "done" && "bg-accent/20 border-accent/30 text-accent",
                              status === "current" && "bg-foreground text-background font-bold border-foreground ring-2 ring-background ring-offset-2 ring-offset-secondary",
                              status === "future" && "bg-background/20 border-transparent text-muted-foreground"
                            )}
                          >
                            {juzNum}
                          </div>
                        )
                      })}
                   </div>
                   <p className="text-xs text-muted-foreground mt-2">
                      Currently memorizing <span className="text-foreground font-medium">Juz {currentJuz}</span>
                   </p>
                </div>
              ) : (
                <div className="relative z-10 h-[68px] flex items-center justify-center border border-dashed border-border/50 rounded-lg">
                  <span className="text-xs text-muted-foreground">Juz {stage.range[0]} - {stage.range[1]}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
