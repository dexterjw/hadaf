import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Crown } from "lucide-react";

const chartConfig = {
  cumulative: {
    label: "Total Verses",
    color: "hsl(var(--primary))",
  },
};

interface CumulativeGrowthProps {
  data: {
    date: string;
    cumulative: number;
    milestone?: string;
  }[];
}

const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload.milestone) return <circle cx={cx} cy={cy} r={0} />;
    
    return (
        <g transform={`translate(${cx},${cy})`} className="group cursor-pointer">
            {/* Pulsing effect behind */}
            <circle r={6} fill="var(--color-cumulative)" opacity={0.3} className="animate-pulse" />
            <circle r={3.5} fill="var(--color-cumulative)" stroke="white" strokeWidth={1.5} />
            
            {/* Milestone Label */}
            <foreignObject x={-60} y={-45} width={120} height={40} className="overflow-visible pointer-events-none">
                <div className="flex flex-col items-center justify-center text-center transition-transform hover:scale-110">
                    <span className="text-[10px] font-bold bg-background/90 backdrop-blur-sm border border-border/50 px-2 py-1 rounded-md shadow-sm whitespace-nowrap flex items-center gap-1.5 text-foreground">
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                        {payload.milestone}
                    </span>
                    {/* Little triangle arrow pointing down */}
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-border/50 mt-[-1px]"></div>
                </div>
            </foreignObject>
        </g>
    );
};

export function CumulativeGrowth({ data }: CumulativeGrowthProps) {
  return (
    <Card className="h-full border-muted/40 shadow-sm flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quarterly Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-2">
        <ChartContainer config={chartConfig} className="h-full w-full max-h-[220px]">
          <AreaChart
            data={data}
            margin={{
              left: 0,
              right: 10,
              top: 25, 
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={30}
              className="text-[10px] font-medium text-muted-foreground"
              dy={10}
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px] font-medium text-muted-foreground"
                width={30}
                tickCount={5}
             />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<ChartTooltipContent indicator="line" className="w-40" />}
            />
            <Area
              dataKey="cumulative"
              type="monotone"
              fill="url(#fillCumulative)"
              fillOpacity={1}
              stroke="var(--color-cumulative)"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-cumulative)" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
