import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, Calendar, TrendingUp, Clock, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format, differenceInMonths } from "date-fns";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

import { ProjectionResult } from "../utils";

interface DashboardViewProps {
    projection: ProjectionResult;
    baseProjection: ProjectionResult;
    adjustedPace: number;
    setAdjustedPace: (pace: number) => void;
    onReset: () => void;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-neutral-900/95 border border-neutral-700 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                <div className="text-xs text-neutral-400 mb-1">
                    {format(data.date, "EEEE, MMMM d, yyyy")}
                </div>
                <div className="text-2xl font-light text-white mb-2">
                    Juz {data.juz.toFixed(1)}
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className={cn(
                        "px-2 py-0.5 rounded-full",
                        data.phase === "Warm-up" ? "bg-emerald-500/20 text-emerald-400" :
                        data.phase === "Flow State" ? "bg-sky-500/20 text-sky-400" :
                        "bg-violet-500/20 text-violet-400"
                    )}>
                        {data.phase}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export default function DashboardView({
    projection,
    baseProjection,
    adjustedPace,
    setAdjustedPace,
    onReset,
}: DashboardViewProps) {
    const [showBreaks, setShowBreaks] = useState(true);

    const timeDelta = baseProjection.daysNeeded - projection.daysNeeded;
    const monthsDelta = differenceInMonths(baseProjection.finishDate, projection.finishDate);

    // Prepare chart data with proper formatting
    const chartData = useMemo(() => {
        let lastMonth = "";
        let lastYear = "";
        
        return projection.chartData.map((point, i) => {
            const month = format(point.date, "MMM");
            const year = format(point.date, "yyyy");
            
            let label = "";
            if (month !== lastMonth) {
                label = month;
                if (year !== lastYear && lastYear !== "") {
                    label = `${month}\n${year}`;
                }
                lastMonth = month;
            }
            if (year !== lastYear) {
                lastYear = year;
            }

            return {
                ...point,
                xLabel: label,
                index: i,
            };
        });
    }, [projection.chartData]);

    // Get Juz milestones for reference lines
    const juzMilestones = [5, 10, 15, 20, 25, 30];

    return (
        <motion.div
            key="dashboard-p8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex flex-col"
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50">
                <Button
                    onClick={onReset}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-neutral-400 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Reconfigure
                </Button>

                {/* Delta Badge */}
                <AnimatePresence mode="wait">
                    {timeDelta !== 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2",
                                timeDelta > 0
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            )}
                        >
                            {timeDelta > 0 ? (
                                <>
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    {monthsDelta > 0 ? `${monthsDelta} months faster` : `${Math.abs(timeDelta)} days faster`}
                                </>
                            ) : (
                                <>
                                    <Clock className="w-3.5 h-3.5" />
                                    {Math.abs(monthsDelta) > 0 ? `${Math.abs(monthsDelta)} months slower` : `${Math.abs(timeDelta)} days slower`}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBreaks(!showBreaks)}
                    className={cn(
                        "gap-2 border-neutral-700",
                        showBreaks ? "text-sky-400" : "text-neutral-400"
                    )}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    Breaks
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Left: Stats Panel */}
                <div className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r border-neutral-800/50 flex flex-col gap-6">
                    {/* Completion Date - Hero */}
                    <div className="bg-gradient-to-br from-sky-500/10 to-indigo-500/10 rounded-2xl border border-sky-500/20 p-6">
                        <div className="text-xs text-sky-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            Target Completion
                        </div>
                        <motion.div
                            key={projection.finishDate.toISOString()}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            className="text-4xl font-light text-white leading-tight"
                        >
                            {format(projection.finishDate, "MMMM")}
                            <br />
                            <span className="text-5xl">{format(projection.finishDate, "d, yyyy")}</span>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 p-4">
                            <div className="text-2xl font-light text-white mb-1">
                                {projection.estimatedMonths}
                            </div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                Months Left
                            </div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 p-4">
                            <div className="text-2xl font-light text-white mb-1">
                                {projection.daysNeeded}
                            </div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                Days Left
                            </div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 p-4">
                            <div className="text-2xl font-light text-sky-400 mb-1">
                                {projection.progressPercent}%
                            </div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                Complete
                            </div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 p-4">
                            <div className="text-2xl font-light text-white mb-1">
                                {(projection.remainingLines / 1000).toFixed(1)}k
                            </div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                Lines Left
                            </div>
                        </div>
                    </div>

                    {/* Pace Slider */}
                    <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 p-5 mt-auto">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-400">Simulate Pace</span>
                            <span className={cn(
                                "text-2xl font-light tabular-nums",
                                adjustedPace > 25 ? "text-amber-400" : "text-white"
                            )}>
                                {adjustedPace}
                            </span>
                        </div>
                        
                        <Slider
                            value={[adjustedPace]}
                            onValueChange={(v) => setAdjustedPace(v[0])}
                            min={1}
                            max={45}
                            step={1}
                            className="mb-3"
                        />
                        
                        <div className="flex justify-between text-[9px] text-neutral-600 uppercase tracking-wider">
                            <span>1</span>
                            <span className="text-neutral-500">lines per day</span>
                            <span>45</span>
                        </div>

                        {adjustedPace > 25 && (
                            <div className="mt-3 text-xs text-amber-400/80 text-center">
                                ⚠️ High burnout risk
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Chart Area (THE HERO) */}
                <div className="flex-1 p-6 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-white">Progress Timeline</h2>
                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <span className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-gradient-to-t from-sky-500/20 to-sky-500/60" />
                                Progress
                            </span>
                            {showBreaks && projection.breakPeriods.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded bg-rose-500/30" />
                                    Breaks
                                </span>
                            )}
                        </div>
                    </div>

                    {/* THE CHART - Maximum space */}
                    <div className="flex-1 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 p-4 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
                            >
                                <defs>
                                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.6} />
                                        <stop offset="50%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="#1f1f1f" 
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="xLabel"
                                    stroke="#444"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={{ stroke: '#333' }}
                                    interval="preserveStartEnd"
                                    tick={{ fill: '#666' }}
                                />

                                <YAxis
                                    domain={[0, 30]}
                                    stroke="#444"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={[0, 5, 10, 15, 20, 25, 30]}
                                    tick={{ fill: '#666' }}
                                    width={30}
                                />

                                {/* Juz milestone lines */}
                                {juzMilestones.map((juz) => (
                                    <ReferenceLine
                                        key={juz}
                                        y={juz}
                                        stroke="#222"
                                        strokeDasharray="2 4"
                                        label={{
                                            value: juz === 30 ? "Khatam" : `Juz ${juz}`,
                                            position: 'right',
                                            fill: '#444',
                                            fontSize: 9,
                                        }}
                                    />
                                ))}

                                <Tooltip content={<CustomTooltip />} />

                                <Area
                                    type="monotone"
                                    dataKey="juz"
                                    stroke="#0ea5e9"
                                    strokeWidth={2.5}
                                    fill="url(#progressGradient)"
                                    activeDot={{
                                        r: 6,
                                        fill: '#0ea5e9',
                                        stroke: '#0ea5e9',
                                        strokeWidth: 2,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Break Legend */}
                    {showBreaks && projection.breakPeriods.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {projection.breakPeriods.slice(0, 6).map((bp, i) => (
                                <div
                                    key={i}
                                    className="px-3 py-1.5 rounded-lg bg-neutral-800/50 border border-neutral-700/50 text-xs"
                                >
                                    <span className="text-neutral-400">{bp.name}</span>
                                    <span className="text-neutral-600 ml-2">
                                        {format(bp.startDate, "MMM d")} - {format(bp.endDate, "MMM d")}
                                    </span>
                                </div>
                            ))}
                            {projection.breakPeriods.length > 6 && (
                                <div className="px-3 py-1.5 rounded-lg bg-neutral-800/30 text-xs text-neutral-500">
                                    +{projection.breakPeriods.length - 6} more
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
