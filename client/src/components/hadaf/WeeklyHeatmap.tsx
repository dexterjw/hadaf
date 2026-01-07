import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface WeeklyHeatmapProps {
  data: {
    date: string;
    intensity: number; // 0-4
    verses: number;
  }[];
}

export function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  // Helper to get color based on intensity
  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted/30";
      case 1: return "bg-green-200 dark:bg-green-900/30";
      case 2: return "bg-green-400 dark:bg-green-700/50";
      case 3: return "bg-green-500 dark:bg-green-600";
      case 4: return "bg-green-600 dark:bg-green-500";
      default: return "bg-muted";
    }
  };

  return (
    <Card className="h-full border-muted/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Consistency Map
            </CardTitle>
            <div className="flex gap-1 text-[10px] text-muted-foreground items-center">
                <span>Less</span>
                <div className="w-2 h-2 bg-muted/30 rounded-[2px]" />
                <div className="w-2 h-2 bg-green-200 dark:bg-green-900/30 rounded-[2px]" />
                <div className="w-2 h-2 bg-green-400 dark:bg-green-700/50 rounded-[2px]" />
                <div className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-[2px]" />
                <span>More</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Day labels */}
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground mb-1">
              {day}
            </div>
          ))}
          
          {/* Heatmap cells */}
          <TooltipProvider>
            {data.map((day, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "aspect-square rounded-sm transition-colors cursor-pointer hover:ring-2 ring-offset-1 ring-ring",
                      getColor(day.intensity)
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs font-medium">{day.date}</p>
                  <p className="text-xs text-muted-foreground">{day.verses} verses</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
