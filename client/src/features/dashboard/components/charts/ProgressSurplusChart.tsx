import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";

export function ProgressSurplusChart() {
  // Mock data telling a story of "getting ahead"
  // Scenario: Started on track, then accelerated (did extra pages), creating a surplus.
  const today = new Date();
  const data = Array.from({ length: 30 }).map((_, i) => {
    const date = subDays(today, 30 - i);
    const dayIndex = i;
    
    // Ideal path: Linear progress (e.g., 1 page per day)
    const ideal = dayIndex * 1; 

    // Actual path: 
    // Days 0-10: On track
    // Days 11-30: Consistently doing 1.2x - 1.5x the target
    let actual = 0;
    if (dayIndex <= 5) {
      actual = dayIndex * 1;
    } else {
      // Accelerating
      actual = 5 + (dayIndex - 5) * 1.4; 
    }

    return {
      date: date.toISOString(),
      ideal,
      actual,
      surplus: actual - ideal
    };
  });

  return (
    <div className="w-full h-[200px] mt-8 bg-card/30 rounded-xl p-4 border border-border/50 backdrop-blur-sm relative">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Velocity Surplus</h4>
        <div className="text-2xl font-display font-bold text-accent mt-1">
          +12.5 <span className="text-sm font-sans text-muted-foreground font-normal">pages ahead</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
            </linearGradient>
             <pattern id="diagonalHatchSurplus" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" 
                style={{ stroke: 'hsl(var(--accent))', strokeOpacity: 0.2, strokeWidth: 1 }} 
              />
            </pattern>
          </defs>
          
          <XAxis 
            dataKey="date" 
            tickFormatter={(str) => format(new Date(str), "d MMM")}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis hide />
          
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover border border-border px-3 py-2 rounded-lg shadow-xl text-xs">
                    <div className="text-muted-foreground mb-1">
                      {format(new Date(payload[0].payload.date), "MMM d")}
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                      Target: {payload[0].payload.ideal.toFixed(1)}
                    </div>
                    <div className="flex items-center gap-2 text-accent font-bold">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      Actual: {payload[0].payload.actual.toFixed(1)}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* The Ideal Line (Dashed, Ghostly) */}
          {/* In surplus, Ideal is BELOW Actual. So we draw Ideal first as the baseline. */}
          <Area
            type="monotone"
            dataKey="ideal"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeWidth={2}
            fill="none"
            isAnimationActive={false}
          />

           {/* The Actual Line (Solid, Accent Color) */}
           {/* We fill with gradient to show volume */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            fill="url(#colorSurplus)"
          />

          {/* Visualization of the "Bonus" Area between lines */}
          {/* We mask the bottom part (ideal) so the texture only appears in the gap? 
              Actually, in SVG stacking, we can just render the texture on Actual, 
              but that fills everything down to 0. 
              
              Simpler visual trick for prototype:
              1. Draw Actual with full gradient.
              2. Draw Ideal with solid background color to "mask" the bottom part.
              3. Re-draw Ideal stroke.
          */}
           <Area
            type="monotone"
            dataKey="ideal"
            stroke="none"
            fill="hsl(var(--background))" // Mask out the gradient below the ideal line
            fillOpacity={0.8}
            isAnimationActive={false}
          />
           <Area
            type="monotone"
            dataKey="ideal"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeWidth={2}
            fill="none"
            isAnimationActive={false}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
