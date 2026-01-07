import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StreakCardProps {
  streak: number;
  reviewedToday: boolean;
  onToggleToday: () => void;
}

export function StreakCard({ streak, reviewedToday, onToggleToday }: StreakCardProps) {
  // Calculate milestone progress
  const nextMilestone = 30; // Could be dynamic: 7, 30, 60, 90...
  const progress = Math.min((streak / nextMilestone) * 100, 100);
  const daysLeft = Math.max(0, nextMilestone - streak);

  return (
    <Card className="h-full border-muted/40 shadow-sm relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Flame className="w-32 h-32" />
      </div>

      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          Current Streak
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 flex flex-col justify-between h-[calc(100%-60px)]">
        <div className="mt-2">
           <div className="flex items-baseline gap-2">
             <span className="text-5xl font-bold tracking-tighter text-foreground">{streak}</span>
             <span className="text-lg text-muted-foreground font-medium">days</span>
           </div>
           <p className="text-sm text-muted-foreground mt-1">
             {reviewedToday ? "Great consistency!" : "Keep the chain going."}
           </p>
        </div>

        <div className="space-y-6 mt-6">
            <Button
                variant={reviewedToday ? "outline" : "default"}
                size="lg"
                className={cn(
                    "w-full h-11 text-sm font-medium transition-all duration-300 shadow-sm",
                    reviewedToday 
                        ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-600 border-emerald-500/20" 
                        : "bg-primary hover:bg-primary/90"
                )}
                onClick={onToggleToday}
            >
                {reviewedToday ? (
                    <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete
                    </>
                ) : (
                    "Mark Today Complete"
                )}
            </Button>

            <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        Next Milestone
                    </span>
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : "Achieved!"}</span>
                </div>
                <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700 ease-out" 
                        style={{ width: `${progress}%` }} 
                    />
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
