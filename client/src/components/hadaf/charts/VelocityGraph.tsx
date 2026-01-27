import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, ReferenceLine, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
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
  const avgTarget = data.length > 0 ? data[0].target : 50;

  return (
    <Card className="h-full border-muted/40 shadow-sm flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Weekly Velocity
            </CardTitle>
            <div className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded-sm">
                <div className="w-2 h-0.5 bg-muted-foreground/50 border-t border-dashed border-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">Target: {avgTarget}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-2">
        <ChartContainer config={chartConfig} className="h-full w-full max-h-[220px]">
          <BarChart data={data} margin={{ top: 24, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              tickFormatter={(value) => value}
              className="text-[10px] font-medium text-muted-foreground uppercase"
              dy={10}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.1 }}
              content={
                <ChartTooltipContent 
                    hideLabel 
                    className="w-32 bg-popover/95 backdrop-blur-sm border-white/10" 
                />
              }
            />
            <ReferenceLine 
                y={avgTarget} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="4 4" 
                strokeOpacity={0.5}
            />
            <Bar 
                dataKey="verses" 
                fill="var(--color-verses)" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
                className="hover:opacity-80 transition-opacity cursor-pointer"
            >
                <LabelList 
                    position="top" 
                    dataKey="verses" 
                    fillOpacity={1} 
                    className="fill-foreground font-bold text-[11px]" 
                    offset={8} 
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
