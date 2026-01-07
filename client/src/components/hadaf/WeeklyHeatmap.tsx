import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { subDays, format, getDay, startOfWeek, addDays, isSameDay } from "date-fns";

interface WeeklyHeatmapProps {
  data: {
    date: string; // ISO date string preferred for comparison, or we parse it
    intensity: number; // 0-4
    verses: number;
    type?: 'memorization' | 'revision';
  }[];
}

export function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  const [mode, setMode] = useState<"memorization" | "revision">("memorization");

  // Generate calendar grid data
  // We want to show the last ~4-5 months to fill the width
  // A standard GitHub graph has 52 weeks, but we can do ~20 weeks for this dashboard view
  const weeksToShow = 26; 
  const today = new Date();
  const startDate = startOfWeek(subDays(today, weeksToShow * 7), { weekStartsOn: 0 }); // Start on Sunday

  const calendarData = useMemo(() => {
    const weeks = [];
    let currentDate = startDate;

    for (let w = 0; w < weeksToShow + 1; w++) {
      const weekDays = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = currentDate.toDateString(); // For simple comparison
        // Find data for this date
        // Note: The incoming data format in the mock is simplistic, we'll try to match by date string
        // In a real app, use ISO strings. Here we'll just try to match loosely or generate dummy visual data if missing
        // to make it look "GitHub-like" for the prototype since our mock data generator is simple.
        
        // Let's actually look for a match in the prop data. 
        // Since prop data is limited in the mock, we might not find many matches.
        // For the sake of the visual prototype requested ("redo... entirely"), 
        // we'll rely on the prop data but if it's sparse, the graph will be sparse (which is correct).
        
        // However, the current mock data generator only generates 28 days. 
        // We will need to update the parent to generate more data.
        
        // Matching logic (assuming mock data sends consistent format)
        const match = data.find(item => {
            const itemDate = new Date(item.date);
            // Handle "Invalid Date" if item.date is not parseable, but assuming it is "Oct 1" format from current mock
            // We need a robust way. Let's assume the parent sends proper Date objects or ISO strings in the future.
            // For now, let's just try to match if the date string includes the "Month Day" part.
            return itemDate.toDateString() === currentDate.toDateString() || 
                   item.date === format(currentDate, 'MMM d');
        });

        weekDays.push({
          date: currentDate,
          intensity: match ? match.intensity : 0,
          verses: match ? match.verses : 0,
          label: format(currentDate, 'MMM d, yyyy')
        });
        currentDate = addDays(currentDate, 1);
      }
      weeks.push(weekDays);
    }
    return weeks;
  }, [data, startDate]);

  // Helper to get color based on intensity
  const getColor = (intensity: number) => {
    if (mode === 'memorization') {
        switch (intensity) {
        case 0: return "bg-muted/40"; // Darker empty state for contrast
        case 1: return "bg-emerald-900/40 border border-emerald-900/50";
        case 2: return "bg-emerald-700/60 border border-emerald-700/50";
        case 3: return "bg-emerald-500 border border-emerald-500/50";
        case 4: return "bg-emerald-400 border border-emerald-400/50 shadow-[0_0_8px_-2px_rgba(52,211,153,0.5)]";
        default: return "bg-muted/40";
        }
    } else {
        switch (intensity) {
        case 0: return "bg-muted/40";
        case 1: return "bg-amber-900/40 border border-amber-900/50";
        case 2: return "bg-amber-700/60 border border-amber-700/50";
        case 3: return "bg-amber-500 border border-amber-500/50";
        case 4: return "bg-amber-400 border border-amber-400/50 shadow-[0_0_8px_-2px_rgba(251,191,36,0.5)]";
        default: return "bg-muted/40";
        }
    }
  };

  const months = useMemo(() => {
    const monthLabels: { label: string; index: number }[] = [];
    let currentMonth = -1;
    
    calendarData.forEach((week, index) => {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();
      
      if (month !== currentMonth) {
        monthLabels.push({
            label: format(firstDay, 'MMM'),
            index: index
        });
        currentMonth = month;
      }
    });
    return monthLabels;
  }, [calendarData]);

  return (
    <Card className="h-full border-muted/40 shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="pb-4 pt-5 px-6 shrink-0">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="text-base font-semibold tracking-tight">
                Consistency Map
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    {data.filter(d => d.intensity > 0).length} active days in this period
                </p>
            </div>
            
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="h-7">
                <TabsList className="h-7 p-0.5 bg-muted/50 border border-white/5">
                    <TabsTrigger value="memorization" className="h-full text-[10px] px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Memorization</TabsTrigger>
                    <TabsTrigger value="revision" className="h-full text-[10px] px-3 rounded-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">Revision</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0 flex flex-col justify-center px-6 pb-6 pt-0">
        {/* Graph Container */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <div className="min-w-max">
                {/* Month Labels */}
                <div className="flex mb-2 text-[10px] text-muted-foreground font-medium pl-8">
                    {months.map((m, i) => (
                        <div key={i} style={{ width: `${(months[i+1]?.index - m.index || 4) * 14}px` }}>
                            {m.label}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1">
                    {/* Day Labels (Mon, Wed, Fri) */}
                    <div className="flex flex-col gap-1 pr-2 pt-[1px]">
                         {/* Empty generic spacer for proper alignment or explicit days */}
                        <div className="h-[10px]" /> {/* Sun */}
                        <div className="h-[10px] text-[9px] leading-[10px] text-muted-foreground">Mon</div>
                        <div className="h-[10px]" /> {/* Tue */}
                        <div className="h-[10px] text-[9px] leading-[10px] text-muted-foreground">Wed</div>
                        <div className="h-[10px]" /> {/* Thu */}
                        <div className="h-[10px] text-[9px] leading-[10px] text-muted-foreground">Fri</div>
                        <div className="h-[10px]" /> {/* Sat */}
                    </div>

                    {/* The Grid */}
                    <div className="flex gap-1">
                        <TooltipProvider>
                            {calendarData.map((week, wIndex) => (
                                <div key={wIndex} className="flex flex-col gap-1">
                                    {week.map((day, dIndex) => (
                                        <Tooltip key={`${wIndex}-${dIndex}`} delayDuration={100}>
                                            <TooltipTrigger asChild>
                                                <div 
                                                    className={cn(
                                                        "w-[10px] h-[10px] rounded-[2px] transition-all hover:ring-1 hover:ring-ring hover:z-10 relative",
                                                        getColor(day.intensity)
                                                    )}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="text-xs">
                                                <div className="font-semibold">{day.label}</div>
                                                <div className="text-muted-foreground">
                                                    {day.verses > 0 
                                                        ? `${day.verses} verses ${mode === 'memorization' ? 'memorized' : 'reviewed'}`
                                                        : 'No activity'}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            ))}
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground pl-8">
            <span>Less</span>
            <div className="flex gap-1">
                <div className={cn("w-[10px] h-[10px] rounded-[2px]", getColor(0))} />
                <div className={cn("w-[10px] h-[10px] rounded-[2px]", getColor(1))} />
                <div className={cn("w-[10px] h-[10px] rounded-[2px]", getColor(2))} />
                <div className={cn("w-[10px] h-[10px] rounded-[2px]", getColor(3))} />
                <div className={cn("w-[10px] h-[10px] rounded-[2px]", getColor(4))} />
            </div>
            <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
