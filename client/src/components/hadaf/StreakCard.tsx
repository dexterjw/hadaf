import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StreakCardProps {
  streak: number;
  reviewedToday: boolean;
  onToggleToday: () => void;
}

export function StreakCard({ streak, reviewedToday, onToggleToday }: StreakCardProps) {
  return (
    <Card className="h-full border-muted/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-2">
        <div className="text-6xl font-bold tracking-tighter mb-4 text-primary">
          {streak}
          <span className="text-lg font-normal text-muted-foreground ml-2">days</span>
        </div>
        
        <Button
          variant={reviewedToday ? "default" : "outline"}
          size="lg"
          className={cn(
            "w-full max-w-[200px] h-12 text-base gap-2 transition-all duration-300",
            reviewedToday && "bg-green-600 hover:bg-green-700 text-white border-transparent"
          )}
          onClick={onToggleToday}
        >
          {reviewedToday ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Completed
            </>
          ) : (
            <>
              <Circle className="w-5 h-5" />
              Mark Complete
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          {reviewedToday 
            ? "Great job! Keep the momentum going." 
            : "Review today to keep your streak alive!"}
        </p>
      </CardContent>
    </Card>
  );
}
