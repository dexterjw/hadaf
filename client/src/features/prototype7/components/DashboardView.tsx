import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, Settings2, Calendar, ChevronDown, ChevronUp, 
    Plus, Trash2, AlertTriangle, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

import { ProjectionResult, validatePhases } from "../utils";
import { 
    AdvancedSettings, 
    VelocityPhase, 
    HolidayBreak, 
    DEFAULT_VELOCITY_PHASES 
} from "../types";

interface DashboardViewProps {
    projection: ProjectionResult;
    baseProjection: ProjectionResult;
    adjustedPace: number;
    setAdjustedPace: (pace: number) => void;
    advancedSettings: AdvancedSettings;
    setAdvancedSettings: (settings: AdvancedSettings) => void;
    onReset: () => void;
}

export default function DashboardView({
    projection,
    baseProjection,
    adjustedPace,
    setAdjustedPace,
    advancedSettings,
    setAdvancedSettings,
    onReset,
}: DashboardViewProps) {
    const [showVelocityTuner, setShowVelocityTuner] = useState(false);
    const [showHolidayManager, setShowHolidayManager] = useState(false);
    const [usePhases, setUsePhases] = useState(true);

    const timeDelta = baseProjection.daysNeeded - projection.daysNeeded;
    const monthsDelta = Math.round(Math.abs(timeDelta) / 30);

    // Prepare chart data
    const chartData = projection.progressPoints.map((point) => ({
        date: point.date,
        dateLabel: format(point.date, "MMM"),
        year: format(point.date, "yyyy"),
        juz: Math.round(point.juzCompleted * 10) / 10,
        phase: point.phase,
        isBreak: point.isBreak,
        breakName: point.breakName,
    }));

    // Get break periods for reference lines
    const breakPeriods = projection.progressPoints
        .filter(p => p.isBreak)
        .reduce((acc, p) => {
            const key = p.breakName || "Break";
            if (!acc.find(b => b.name === key)) {
                acc.push({ name: key, date: p.date });
            }
            return acc;
        }, [] as { name: string; date: Date }[]);

    const phaseValidation = validatePhases(advancedSettings.velocityPhases);

    const updatePhase = (index: number, updates: Partial<VelocityPhase>) => {
        const newPhases = [...advancedSettings.velocityPhases];
        newPhases[index] = { ...newPhases[index], ...updates };
        setAdvancedSettings({ ...advancedSettings, velocityPhases: newPhases });
    };

    const addHoliday = () => {
        const newHoliday: HolidayBreak = {
            id: `custom-${Date.now()}`,
            name: "New Break",
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isAnnual: false,
        };
        setAdvancedSettings({
            ...advancedSettings,
            holidays: [...advancedSettings.holidays, newHoliday],
        });
    };

    const updateHoliday = (id: string, updates: Partial<HolidayBreak>) => {
        const newHolidays = advancedSettings.holidays.map(h =>
            h.id === id ? { ...h, ...updates } : h
        );
        setAdvancedSettings({ ...advancedSettings, holidays: newHolidays });
    };

    const removeHoliday = (id: string) => {
        setAdvancedSettings({
            ...advancedSettings,
            holidays: advancedSettings.holidays.filter(h => h.id !== id),
        });
    };

    return (
        <motion.div
            key="dashboard-p7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col p-6 max-w-7xl mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <Button
                    onClick={onReset}
                    variant="ghost"
                    className="gap-2 text-neutral-500 hover:text-white pl-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Reset
                </Button>

                {/* Delta Badge */}
                <AnimatePresence mode="wait">
                    {timeDelta !== 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium",
                                timeDelta > 0
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            )}
                        >
                            {timeDelta > 0 ? "Saving" : "Delaying"} {monthsDelta > 0 ? `~${monthsDelta} Months` : `${Math.abs(timeDelta)} Days`}
                        </motion.div>
                    )}
                </AnimatePresence>

                {timeDelta === 0 && (
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-800/50 text-neutral-400 border border-neutral-700/50">
                        Standard Pace
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left: Hero Stats & Chart */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Hero Section */}
                    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-2">
                                    Projected Completion
                                </div>
                                <motion.h1
                                    key={projection.finishDate.toISOString()}
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    className="text-5xl font-light text-white"
                                >
                                    {format(projection.finishDate, "MMMM d, yyyy")}
                                </motion.h1>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-light text-white">
                                    {projection.daysNeeded}
                                </div>
                                <div className="text-xs text-neutral-500 uppercase tracking-widest">
                                    Days Left
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/50">
                            <div>
                                <div className="text-2xl font-light text-white">
                                    {projection.progressPercent}%
                                </div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                    Complete
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-light text-white">
                                    {(projection.remainingLines / 1000).toFixed(1)}k
                                </div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                    Lines Left
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-light text-white">
                                    {projection.totalBreakDays}
                                </div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                    Break Days
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-light text-amber-400">
                                    {projection.totalSickDays}
                                </div>
                                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                                    Buffer Days
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="flex-1 bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-6 min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                                Progress Timeline
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                                <span className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    Progress
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <div className="w-2 h-0.5 bg-rose-400/50" />
                                    Breaks
                                </span>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                <XAxis
                                    dataKey="dateLabel"
                                    stroke="#555"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    domain={[0, 30]}
                                    stroke="#555"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    ticks={[0, 5, 10, 15, 20, 25, 30]}
                                    label={{ 
                                        value: 'Juz', 
                                        angle: -90, 
                                        position: 'insideLeft',
                                        style: { fontSize: 10, fill: '#555' }
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#111',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                    formatter={(value: number) => [`${value.toFixed(1)} Juz`, 'Progress']}
                                    labelFormatter={(_, payload) => {
                                        if (payload && payload[0]) {
                                            const data = payload[0].payload;
                                            return format(data.date, "MMM d, yyyy");
                                        }
                                        return '';
                                    }}
                                />
                                {/* Break Reference Lines */}
                                {breakPeriods.slice(0, 10).map((bp, i) => (
                                    <ReferenceLine
                                        key={i}
                                        x={format(bp.date, "MMM")}
                                        stroke="#f43f5e"
                                        strokeDasharray="3 3"
                                        strokeOpacity={0.4}
                                    />
                                ))}
                                <Line
                                    type="monotone"
                                    dataKey="juz"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#10b981' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {/* Pace Slider */}
                    <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                                Pace Simulator
                            </h3>
                            <span className={cn(
                                "text-2xl font-light tabular-nums",
                                adjustedPace > 25 ? "text-rose-400" : adjustedPace > 15 ? "text-amber-400" : "text-emerald-400"
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

                        <div className="flex justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                            <span>Sustainable</span>
                            <span>Aggressive</span>
                            <span>Burnout</span>
                        </div>

                        {adjustedPace > 25 && (
                            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
                                <AlertTriangle className="w-4 h-4" />
                                High Burnout Risk
                            </div>
                        )}
                    </div>

                    {/* Velocity Tuner */}
                    <Collapsible open={showVelocityTuner} onOpenChange={setShowVelocityTuner}>
                        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50">
                            <CollapsibleTrigger asChild>
                                <button className="w-full p-5 flex items-center justify-between text-left hover:bg-neutral-800/30 rounded-2xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Settings2 className="w-4 h-4 text-neutral-500" />
                                        <span className="text-sm font-medium text-neutral-300">Velocity Matrix</span>
                                    </div>
                                    {showVelocityTuner ? (
                                        <ChevronUp className="w-4 h-4 text-neutral-500" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                                    )}
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="px-5 pb-5 space-y-4 border-t border-neutral-800/50 pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-neutral-500">Use Phased Learning</Label>
                                        <Switch checked={usePhases} onCheckedChange={setUsePhases} />
                                    </div>

                                    {usePhases && (
                                        <>
                                            {advancedSettings.velocityPhases.map((phase, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-neutral-800/30 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="w-3 h-3 text-neutral-500" />
                                                        <span className="text-sm font-medium text-white">{phase.name}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label className="text-[10px] text-neutral-500">Juz Count</Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                max={30}
                                                                value={phase.juzCount}
                                                                onChange={(e) => updatePhase(i, { juzCount: parseInt(e.target.value) || 1 })}
                                                                className="h-8 text-sm bg-neutral-900 border-neutral-700"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px] text-neutral-500">Lines/Day</Label>
                                                            <Input
                                                                type="number"
                                                                min={1}
                                                                max={45}
                                                                value={phase.linesPerDay}
                                                                onChange={(e) => updatePhase(i, { linesPerDay: parseInt(e.target.value) || 1 })}
                                                                className="h-8 text-sm bg-neutral-900 border-neutral-700"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {!phaseValidation.valid && (
                                                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                                                    {phaseValidation.message}
                                                </div>
                                            )}

                                            {phaseValidation.valid && phaseValidation.message && (
                                                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                                                    {phaseValidation.message}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>

                    {/* Holiday Manager */}
                    <Collapsible open={showHolidayManager} onOpenChange={setShowHolidayManager}>
                        <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/50">
                            <CollapsibleTrigger asChild>
                                <button className="w-full p-5 flex items-center justify-between text-left hover:bg-neutral-800/30 rounded-2xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-neutral-500" />
                                        <span className="text-sm font-medium text-neutral-300">Break Configuration</span>
                                        <span className="text-xs text-neutral-500">({advancedSettings.holidays.length})</span>
                                    </div>
                                    {showHolidayManager ? (
                                        <ChevronUp className="w-4 h-4 text-neutral-500" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                                    )}
                                </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="px-5 pb-5 space-y-3 border-t border-neutral-800/50 pt-4 max-h-[300px] overflow-y-auto">
                                    {advancedSettings.holidays.map((holiday) => (
                                        <div key={holiday.id} className="p-3 rounded-lg bg-neutral-800/30 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Input
                                                    value={holiday.name}
                                                    onChange={(e) => updateHoliday(holiday.id, { name: e.target.value })}
                                                    className="h-7 text-sm bg-transparent border-none p-0 font-medium text-white"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-neutral-500 hover:text-rose-400"
                                                    onClick={() => removeHoliday(holiday.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-neutral-400">
                                                <span>{format(holiday.startDate, "MMM d")}</span>
                                                <span>→</span>
                                                <span>{format(holiday.endDate, "MMM d")}</span>
                                                {holiday.isAnnual && (
                                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px]">
                                                        Annual
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addHoliday}
                                        className="w-full border-dashed border-neutral-700 text-neutral-400 hover:text-white"
                                    >
                                        <Plus className="w-3 h-3 mr-2" />
                                        Add Break
                                    </Button>

                                    <div className="pt-3 border-t border-neutral-800/50">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-neutral-500">Sick Days Buffer (per year)</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={30}
                                                value={advancedSettings.sickDaysPerYear}
                                                onChange={(e) => setAdvancedSettings({
                                                    ...advancedSettings,
                                                    sickDaysPerYear: parseInt(e.target.value) || 0,
                                                })}
                                                className="h-7 w-16 text-sm bg-neutral-900 border-neutral-700 text-center"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
                </div>
            </div>
        </motion.div>
    );
}
