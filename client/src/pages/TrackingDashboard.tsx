import { useState } from "react";
import { StreakCard } from "@/components/hadaf/StreakCard";
import { WeeklyHeatmap } from "@/components/hadaf/WeeklyHeatmap";
import { VelocityGraph } from "@/components/hadaf/VelocityGraph";
import { CumulativeGrowth } from "@/components/hadaf/CumulativeGrowth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Mock Data Generators
const generateHeatmapData = () => {
  const days = [];
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Random intensity 0-4
    const intensity = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 5); 
    days.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      intensity: intensity,
      verses: intensity * 5 // Rough estimate
    });
  }
  return days;
};

const generateVelocityData = () => {
  return [
    { week: "W1", verses: 45, target: 50 },
    { week: "W2", verses: 52, target: 50 },
    { week: "W3", verses: 38, target: 50 },
    { week: "W4", verses: 60, target: 50 },
  ];
};

const generateGrowthData = () => {
  return [
    { date: "Oct", cumulative: 120 },
    { date: "Nov", cumulative: 340 },
    { date: "Dec", cumulative: 580 },
    { date: "Jan", cumulative: 750 },
  ];
};

export default function TrackingDashboard() {
  const [streak, setStreak] = useState(12);
  const [reviewedToday, setReviewedToday] = useState(false);
  const [heatmapData] = useState(generateHeatmapData());
  const [velocityData] = useState(generateVelocityData());
  const [growthData] = useState(generateGrowthData());

  const handleToggleToday = () => {
    if (reviewedToday) {
        setStreak(s => s - 1);
        setReviewedToday(false);
    } else {
        setStreak(s => s + 1);
        setReviewedToday(true);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Progress Dashboard</h1>
                    <p className="text-muted-foreground">Track your memorization journey</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Q1 2026 Goal: 1000 Verses
                 </div>
            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
          
          {/* Top Row: Streak (4 cols) + Heatmap (8 cols) */}
          <div className="md:col-span-4 h-[300px]">
            <StreakCard 
                streak={streak} 
                reviewedToday={reviewedToday} 
                onToggleToday={handleToggleToday} 
            />
          </div>
          <div className="md:col-span-8 h-[300px]">
            <WeeklyHeatmap data={heatmapData} />
          </div>

          {/* Bottom Row: Velocity (6 cols) + Growth (6 cols) */}
          <div className="md:col-span-6 h-[300px]">
             <VelocityGraph data={velocityData} />
          </div>
          <div className="md:col-span-6 h-[300px]">
             <CumulativeGrowth data={growthData} />
          </div>

        </div>
      </div>
    </div>
  );
}
