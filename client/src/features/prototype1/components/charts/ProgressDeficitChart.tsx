import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { format, subDays, addDays } from "date-fns";

export function ProgressDeficitChart() {
  // Mock data telling a story of "falling behind"
  // Scenario: Started well, then plateaued (missed days), creating a gap.
  const today = new Date();
  const data = Array.from({ length: 30 }).map((_, i) => {
    const date = subDays(today, 30 - i);
    const dayIndex = i;
    
    // Ideal path: Linear progress (e.g., 1 page per day)
    const ideal = dayIndex * 1; 

    // Actual path: 
    // Days 0-10: On track
    // Days 11-20: Slacking (flatline/slow growth)
    // Days 21-30: Trying to catch up but gap remains
    let actual = 0;
    if (dayIndex <= 10) {
      actual = dayIndex * 1;
    } else if (dayIndex <= 20) {
      actual = 10 + (dayIndex - 10) * 0.2; // Very slow progress
    } else {
      actual = 12 + (dayIndex - 20) * 0.8; // Resumed pace, but behind
    }

    return {
      date: date.toISOString(),
      ideal,
      actual,
      gap: ideal - actual
    };
  });

  return (
    <div className="w-full h-[200px] mt-8 bg-card/30 rounded-xl p-4 border border-border/50 backdrop-blur-sm relative">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Velocity Gap</h4>
        <div className="text-2xl font-display font-bold text-destructive mt-1">
          -8.4 <span className="text-sm font-sans text-muted-foreground font-normal">pages behind schedule</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
            </linearGradient>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" 
                style={{ stroke: 'hsl(var(--destructive))', strokeOpacity: 0.2, strokeWidth: 1 }} 
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
                    <div className="flex items-center gap-2 text-destructive font-bold">
                      <span className="w-2 h-2 rounded-full bg-destructive" />
                      Actual: {payload[0].payload.actual.toFixed(1)}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* The Ideal Line (Dashed, Ghostly) */}
          <Area
            type="monotone"
            dataKey="ideal"
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            strokeWidth={2}
            fill="none"
            isAnimationActive={false}
          />

          {/* The Actual Line (Solid, Colored by state) */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            fill="url(#colorGap)" // Highlights the area under the curve
          />
          
          {/* Visualizing the Gap explicitly as a filled region between lines is tricky in simple AreaChart without complex composition. 
              Instead, we'll use the gradient under Actual to signify 'presence' and the gap is visual space. 
              
              Better approach for "Gap":
              We render the "Ideal" area as a background fill, and "Actual" overlays it. 
              The exposed part of "Ideal" represents the deficit.
          */}
          <Area
            type="monotone"
            dataKey="ideal"
            stroke="none"
            fill="url(#diagonalHatch)" // The "Missed Opportunity" texture
            fillOpacity={1}
            isAnimationActive={false}
          />
           <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="hsl(var(--background))" // Mask out the hatch pattern below the actual line
            fillOpacity={1}
          />
           <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            fill="url(#colorGap)" // Add subtle red glow back in
            fillOpacity={0.5}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
