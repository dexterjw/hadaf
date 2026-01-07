import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  verses: {
    label: "Verses",
    color: "hsl(var(--primary))",
  },
};

interface VelocityGraphProps {
  data: {
    week: string;
    verses: number;
    target: number;
  }[];
}

export function VelocityGraph({ data }: VelocityGraphProps) {
  return (
    <Card className="h-full border-muted/40 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Weekly Velocity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data} margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="verses" fill="var(--color-verses)" radius={[4, 4, 0, 0]} barSize={32}>
                <LabelList position="top" dataKey="verses" fillOpacity={1} className="fill-foreground text-xs" offset={10} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
