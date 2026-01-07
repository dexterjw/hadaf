import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
              top: 10,
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
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
