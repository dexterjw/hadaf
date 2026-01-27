import { Card, CardContent } from "@/components/ui/card";
import { Flame, Footprints, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streak: number;
  reviewedToday: boolean; // Keeping for compatibility, though visual is driven by mock data for exact match
  onToggleToday: () => void;
}

export function StreakCard({ streak, reviewedToday, onToggleToday }: StreakCardProps) {
  const days = [
    { name: "Mon", status: "completed" },
    { name: "Tue", status: "completed" },
    { name: "Wed", status: "completed" },
    { name: "Thu", status: "current" },
    { name: "Fri", status: "pending" },
    { name: "Sat", status: "pending" },
    { name: "Sun", status: "pending" },
  ];

  return (
    <Card className="w-full max-w-[320px] bg-[#1c1c1e] border-white/5 text-white overflow-hidden shadow-2xl rounded-[32px] p-1 font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <CardContent className="p-6 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500 blur-lg opacity-40 rounded-full" />
              <div className="relative bg-gradient-to-br from-rose-500 to-rose-600 p-2.5 rounded-full shadow-lg">
                <Flame className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Streak</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white">32</span>
                <span className="text-[10px] font-medium tracking-wide text-zinc-400 uppercase">Days</span>
              </div>
            </div>
          </div>
          <Footprints className="w-6 h-6 text-zinc-600 rotate-[-15deg]" />
        </div>

        {/* Weekly Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {days.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                  day.status === "completed" && "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]",
                  day.status === "current" && "border-2 border-emerald-500/50 relative",
                  day.status === "pending" && "bg-zinc-800/50"
                )}>
                  {day.status === "completed" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  {day.status === "current" && (
                    <div className="w-full h-full rounded-full border-t-2 border-l-2 border-emerald-500 rotate-45 transform" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-zinc-500">{day.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Section */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mb-1">Steps</p>
          <div className="flex items-end justify-between mb-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-medium tracking-tight text-white">6825</span>
              <span className="text-[11px] font-medium text-zinc-600">/10,000</span>
            </div>
            <span className="text-[11px] font-medium text-zinc-500 mb-1">68%</span>
          </div>

          <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 w-[68%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
