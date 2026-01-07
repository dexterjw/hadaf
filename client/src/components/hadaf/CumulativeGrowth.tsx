import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
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
    if (!payload.milestone) return null;
    return (
        <g transform={`translate(${cx},${cy})`}>
            <circle r={4} fill="var(--color-cumulative)" stroke="white" strokeWidth={2} />
            <foreignObject x={-100} y={-45} width={200} height={40}>
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] bg-background border px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap flex items-center gap-1">
                        <Crown className="w-3 h-3 text-yellow-500" />
                        {payload.milestone}
                    </span>
                </div>
            </foreignObject>
        </g>
    );
};

export function CumulativeGrowth({ data }: CumulativeGrowthProps) {
  return (
    <Card className="h-full border-muted/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quarterly Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            data={data}
            margin={{
              left: 0,
              right: 0,
              top: 20, 
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="text-xs text-muted-foreground"
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs text-muted-foreground"
                width={30}
             />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="cumulative"
              type="natural"
              fill="url(#fillCumulative)"
              fillOpacity={0.4}
              stroke="var(--color-cumulative)"
              strokeWidth={2}
              dot={<CustomDot />}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
