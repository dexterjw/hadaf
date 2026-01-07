import { useState } from "react";
import { StreakCard } from "@/components/hadaf/StreakCard";
import { WeeklyHeatmap } from "@/components/hadaf/WeeklyHeatmap";
import { VelocityGraph } from "@/components/hadaf/VelocityGraph";
import { CumulativeGrowth } from "@/components/hadaf/CumulativeGrowth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { Link } from "wouter";
import { subDays } from "date-fns";

// Mock Data Generators - Updated for new visual style
const generateHeatmapData = () => {
  const days = [];
  const today = new Date();
  // Generate ~6 months of data
  for (let i = 180; i >= 0; i--) {
    const d = subDays(today, i);
    // Weighted random to make it look realistic (more consistency recently)
    const baseChance = i < 30 ? 0.9 : 0.6;
    const intensity = Math.random() < baseChance 
        ? Math.floor(Math.random() * 4) + 1 
        : 0;
    
    days.push({
      date: d.toISOString(), // ISO String for safety
      intensity: intensity,
      verses: intensity * 5
    });
  }
  return days;
};

const generateVelocityData = () => {
  return [
    { week: "Nov W4", verses: 35, target: 50 },
    { week: "Dec W1", verses: 42, target: 50 },
    { week: "Dec W2", verses: 52, target: 50 },
    { week: "Dec W3", verses: 68, target: 50 },
    { week: "Dec W4", verses: 45, target: 50 },
    { week: "Jan W1", verses: 55, target: 50 },
  ];
};

const generateGrowthData = () => {
  return [
    { date: "Oct 1", cumulative: 120 },
    { date: "Oct 15", cumulative: 200 },
    { date: "Nov 1", cumulative: 340, milestone: "Juz 28" },
    { date: "Nov 15", cumulative: 450 },
    { date: "Dec 1", cumulative: 580, milestone: "Juz 29" },
    { date: "Dec 15", cumulative: 650 },
    { date: "Jan 1", cumulative: 750, milestone: "Surah Yasin" },
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-10 w-10 -ml-2 rounded-full hover:bg-muted/50">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Journey</h1>
                    <p className="text-muted-foreground">Track your progress and log new achievements.</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium tracking-wide">
                    Q1 GOAL: 1000 VERSES
                 </div>
                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Share2 className="w-4 h-4" />
                 </Button>
            </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Top Row: Streak (4 cols) + Heatmap (8 cols) */}
            <div className="md:col-span-4 h-[320px]">
                <StreakCard 
                    streak={streak} 
                    reviewedToday={reviewedToday} 
                    onToggleToday={handleToggleToday} 
                />
            </div>
            <div className="md:col-span-8 h-[320px]">
                <WeeklyHeatmap data={heatmapData} />
            </div>

            {/* Bottom Row: Velocity (6 cols) + Growth (6 cols) */}
            <div className="md:col-span-6 h-[320px]">
                <VelocityGraph data={velocityData} />
            </div>
            <div className="md:col-span-6 h-[320px]">
                <CumulativeGrowth data={growthData} />
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}
