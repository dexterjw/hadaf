import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface WeeklyHeatmapProps {
  data: {
    date: string;
    intensity: number; // 0-4
    verses: number;
    type?: 'memorization' | 'revision';
  }[];
}

export function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  const [mode, setMode] = useState<"memorization" | "revision">("memorization");

  // Helper to get color based on intensity
  const getColor = (intensity: number) => {
    if (mode === 'memorization') {
        switch (intensity) {
        case 0: return "bg-muted/30";
        case 1: return "bg-emerald-200 dark:bg-emerald-900/30";
        case 2: return "bg-emerald-400 dark:bg-emerald-700/50";
        case 3: return "bg-emerald-500 dark:bg-emerald-600";
        case 4: return "bg-emerald-600 dark:bg-emerald-500";
        default: return "bg-muted";
        }
    } else {
        switch (intensity) {
        case 0: return "bg-muted/30";
        case 1: return "bg-amber-200 dark:bg-amber-900/30";
        case 2: return "bg-amber-400 dark:bg-amber-700/50";
        case 3: return "bg-amber-500 dark:bg-amber-600";
        case 4: return "bg-amber-600 dark:bg-amber-500";
        default: return "bg-muted";
        }
    }
  };

  return (
    <Card className="h-full border-muted/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Consistency Map
            </CardTitle>
            
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="h-6">
                <TabsList className="h-6 p-0 bg-muted/50">
                    <TabsTrigger value="memorization" className="h-full text-[10px] px-2 py-0 data-[state=active]:bg-background">Memorization</TabsTrigger>
                    <TabsTrigger value="revision" className="h-full text-[10px] px-2 py-0 data-[state=active]:bg-background">Revision</TabsTrigger>
                </TabsList>
            </Tabs>
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
