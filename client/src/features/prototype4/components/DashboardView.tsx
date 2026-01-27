import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CalendarRange,
    RotateCcw,
    Zap,
    Clock,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Settings2,
    TrendingUp,
    Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import { format } from "date-fns";
import { ProjectionResult, VelocityMatrix, DEFAULT_VELOCITY_MATRIX } from "../types";
import { getMonthsDelta, getBurnoutRisk } from "../utils";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
    projection: ProjectionResult;
    baseProjection: ProjectionResult;
    adjustedPace: number;
    setAdjustedPace: (pace: number) => void;
    velocityMatrix: VelocityMatrix;
    setVelocityMatrix: (matrix: VelocityMatrix) => void;
    onReset: () => void;
    studentData?: { quranStandard: number };
}

const chartConfig: ChartConfig = {
    juzCompleted: {
        label: "Juz Completed",
        color: "#06b6d4",
    },
};

export default function DashboardView({
    projection,
    baseProjection,
    adjustedPace,
    setAdjustedPace,
    velocityMatrix,
    setVelocityMatrix,
    onReset,
    studentData
}: DashboardViewProps) {
    const [velocityTunerOpen, setVelocityTunerOpen] = useState(false);

    // Calculate delta
    const monthsDelta = getMonthsDelta(baseProjection.finishDate, projection.finishDate);
    const isFaster = monthsDelta > 0;
    const isSlower = monthsDelta < 0;
    const burnoutRisk = getBurnoutRisk(adjustedPace);

    // Prepare chart data
    const chartData = projection.chartData.map((point, index) => ({
        ...point,
        month: point.dateLabel,
        juz: point.juzCompleted,
    }));

    // Update velocity matrix phase
    const updatePhase = (
        phase: "warmup" | "flow" | "acceleration",
        field: "durationPercent" | "intensityPercent",
        value: number
    ) => {
        const newMatrix = { ...velocityMatrix };
        newMatrix[phase] = { ...newMatrix[phase], [field]: value };

        // Auto-calculate acceleration duration to sum to 100%
        if (field === "durationPercent" && phase !== "acceleration") {
            const usedPercent =
                (phase === "warmup" ? value : newMatrix.warmup.durationPercent) +
                (phase === "flow" ? value : newMatrix.flow.durationPercent);
            newMatrix.acceleration.durationPercent = Math.max(0, 100 - usedPercent);
        }

        setVelocityMatrix(newMatrix);
    };

    return (
        <motion.div
            key="dashboard-p4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl"
        >
            <div className="space-y-6">

                {/* ===== Dashboard Header (Hero) ===== */}
                <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/20 border border-cyan-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-widest border border-cyan-500/20 mb-4">
                                <CalendarRange className="w-3.5 h-3.5" />
                                Projected Completion
                            </div>

                            <h2 className="text-5xl md:text-7xl font-light text-white tracking-tighter mb-2">
                                {format(projection.finishDate, "MMM d, yyyy")}
                            </h2>

                            <p className="text-neutral-400 text-lg font-light">
                                <span className="text-white font-medium">{projection.daysNeeded}</span> calendar days
                                <span className="text-neutral-600 mx-2">•</span>
                                <span className="text-white font-medium">{projection.activeDaysNeeded}</span> study days
                            </p>
                        </div>

                        {/* Delta Badge */}
                        <AnimatePresence mode="wait">
                            {monthsDelta !== 0 && (
                                <motion.div
                                    key={monthsDelta}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                >
                                    <div className={cn(
                                        "flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-sm",
                                        isFaster
                                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                                    )}>
                                        {isFaster ? (
                                            <Zap className="w-5 h-5 fill-current" />
                                        ) : (
                                            <Clock className="w-5 h-5" />
                                        )}
                                        <span className="text-lg font-semibold">
                                            {isFaster ? "Saving" : "Delaying"} {Math.abs(monthsDelta)} Month{Math.abs(monthsDelta) !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                            {monthsDelta === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-neutral-500/10 border border-neutral-500/20 text-neutral-400"
                                >
                                    <span className="text-lg font-medium">Standard Pace</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ===== Left Panel: Pace Slider & Controls ===== */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Pace Slider Card */}
                        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full" />

                            <div className="relative z-10">
                                <Label className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-6 block">
                                    Pace Simulator
                                </Label>

                                {/* Value Display */}
                                <div className="flex items-end gap-2 mb-6">
                                    <motion.span
                                        key={adjustedPace}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-6xl font-light tracking-tighter text-white"
                                    >
                                        {adjustedPace}
                                    </motion.span>
                                    <span className="text-lg text-neutral-500 font-medium mb-1.5 pl-1">
                                        lines / day
                                    </span>
                                </div>

                                {/* Pages per Day */}
                                {studentData?.quranStandard && (
                                    <div className="mb-6 flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                        <span className="text-xs text-neutral-500">
                                            Pages per Day ({studentData.quranStandard}-Line)
                                        </span>
                                        <motion.span
                                            key={adjustedPace}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-2xl font-medium text-cyan-300 tabular-nums"
                                        >
                                            {(adjustedPace / studentData.quranStandard).toFixed(2)}
                                        </motion.span>
                                    </div>
                                )}

                                {/* Gradient Slider Track */}
                                <div className="relative py-4">
                                    {/* Gradient background for slider */}
                                    <div
                                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full opacity-30"
                                        style={{
                                            background: "linear-gradient(to right, #10b981 0%, #10b981 22%, #f59e0b 44%, #f59e0b 55%, #ef4444 78%, #ef4444 100%)"
                                        }}
                                    />
                                    <Slider
                                        value={[adjustedPace]}
                                        onValueChange={(v) => setAdjustedPace(v[0])}
                                        min={1}
                                        max={45}
                                        step={1}
                                        className="relative z-10"
                                    />
                                </div>

                                {/* Intensity Labels */}
                                <div className="flex justify-between text-xs text-neutral-600 mt-2 px-1">
                                    <span>Sustainable</span>
                                    <span>Aggressive</span>
                                    <span>Burnout</span>
                                </div>

                                {/* Burnout Warning */}
                                <AnimatePresence>
                                    {adjustedPace > 25 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-rose-400 font-medium text-sm">High Burnout Risk</p>
                                                    <p className="text-rose-400/70 text-xs mt-1">
                                                        This pace may be unsustainable long-term.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-neutral-400 text-sm">Remaining Lines</span>
                                    <span className="text-white font-medium tabular-nums">
                                        {projection.remainingLines.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-neutral-400 text-sm">Current Progress</span>
                                    <span className="text-white font-medium">
                                        {projection.progressPercent}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-neutral-400 text-sm">Daily Effort</span>
                                    <span className="text-white font-medium">
                                        ~{Math.ceil(adjustedPace * 2)} mins
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-neutral-400 text-sm">Burnout Risk</span>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "capitalize",
                                            burnoutRisk === "low" && "border-emerald-500/50 text-emerald-400",
                                            burnoutRisk === "medium" && "border-yellow-500/50 text-yellow-400",
                                            burnoutRisk === "high" && "border-orange-500/50 text-orange-400",
                                            burnoutRisk === "extreme" && "border-rose-500/50 text-rose-400"
                                        )}
                                    >
                                        {burnoutRisk}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <Button
                            onClick={onReset}
                            variant="ghost"
                            className="w-full text-neutral-500 hover:text-white hover:bg-white/5"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Parameters
                        </Button>
                    </div>

                    {/* ===== Right Panel: Chart & Velocity Tuner ===== */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Progress Chart */}
                        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <Label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                    Progress Timeline
                                </Label>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-cyan-500" />
                                        <span className="text-neutral-400">Progress</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded bg-amber-500/30" />
                                        <span className="text-neutral-400">Breaks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[300px] w-full">
                                <ChartContainer config={chartConfig} className="h-full w-full">
                                    <AreaChart
                                        data={chartData}
                                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>

                                        {/* Holiday Reference Areas - using pre-calculated ranges */}
                                        {projection.holidayRanges.map((holiday, idx) => (
                                            <ReferenceArea
                                                key={`${holiday.name}-${idx}`}
                                                x1={holiday.startMonth}
                                                x2={holiday.endMonth}
                                                fill="#f59e0b"
                                                fillOpacity={0.1}
                                                stroke="#f59e0b"
                                                strokeOpacity={0.3}
                                                label={{
                                                    value: holiday.name,
                                                    position: "insideTop",
                                                    fill: "#f59e0b",
                                                    fontSize: 10,
                                                    opacity: 0.7
                                                }}
                                            />
                                        ))}

                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#525252', fontSize: 11 }}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis
                                            domain={[0, 30]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#525252', fontSize: 11 }}
                                            tickFormatter={(v) => `Juz ${v}`}
                                            width={50}
                                        />

                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value, name) => [
                                                        `Juz ${value}`,
                                                        "Expected Progress"
                                                    ]}
                                                />
                                            }
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="juz"
                                            stroke="#06b6d4"
                                            strokeWidth={2}
                                            fill="url(#progressGradient)"
                                            dot={false}
                                            activeDot={{
                                                r: 6,
                                                fill: "#06b6d4",
                                                stroke: "#0a0a0a",
                                                strokeWidth: 2
                                            }}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </div>

                            {/* Holiday Legend - only shows holidays within projection period */}
                            {projection.holidayRanges.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {projection.holidayRanges.map((holiday, idx) => (
                                        <div
                                            key={`${holiday.name}-${idx}`}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20"
                                        >
                                            <Pause className="w-3 h-3 text-amber-400" />
                                            <span className="text-xs text-amber-400">{holiday.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Velocity Tuner (Collapsible) */}
                        <Collapsible open={velocityTunerOpen} onOpenChange={setVelocityTunerOpen}>
                            <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden">
                                <CollapsibleTrigger asChild>
                                    <button className="w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                                <Settings2 className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-medium">Velocity Matrix</h3>
                                                <p className="text-xs text-neutral-500">Advanced phase configuration</p>
                                            </div>
                                        </div>
                                        {velocityTunerOpen ? (
                                            <ChevronUp className="w-5 h-5 text-neutral-500" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-neutral-500" />
                                        )}
                                    </button>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <div className="px-6 pb-6 space-y-6">
                                        <div className="h-px bg-white/5" />

                                        {/* Phase 1: Warm-up */}
                                        <PhaseEditor
                                            phase={velocityMatrix.warmup}
                                            phaseName="Phase 1: Warm-up"
                                            phaseKey="warmup"
                                            color="emerald"
                                            onUpdate={updatePhase}
                                            daysCount={projection.phaseBreakdown.warmupDays}
                                        />

                                        {/* Phase 2: Flow State */}
                                        <PhaseEditor
                                            phase={velocityMatrix.flow}
                                            phaseName="Phase 2: Flow State"
                                            phaseKey="flow"
                                            color="cyan"
                                            onUpdate={updatePhase}
                                            daysCount={projection.phaseBreakdown.flowDays}
                                        />

                                        {/* Phase 3: Acceleration */}
                                        <PhaseEditor
                                            phase={velocityMatrix.acceleration}
                                            phaseName="Phase 3: Acceleration"
                                            phaseKey="acceleration"
                                            color="amber"
                                            onUpdate={updatePhase}
                                            daysCount={projection.phaseBreakdown.accelerationDays}
                                            durationReadOnly
                                        />

                                        {/* Validation Warning */}
                                        {velocityMatrix.warmup.durationPercent + velocityMatrix.flow.durationPercent + velocityMatrix.acceleration.durationPercent !== 100 && (
                                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                                <p className="text-rose-400 text-sm">
                                                    Phase durations must sum to 100%
                                                </p>
                                            </div>
                                        )}

                                        {/* Reset to Defaults */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setVelocityMatrix(DEFAULT_VELOCITY_MATRIX)}
                                            className="text-neutral-500 hover:text-white"
                                        >
                                            Reset to Defaults
                                        </Button>
                                    </div>
                                </CollapsibleContent>
                            </div>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Phase Editor Component
interface PhaseEditorProps {
    phase: { name: string; durationPercent: number; intensityPercent: number };
    phaseName: string;
    phaseKey: "warmup" | "flow" | "acceleration";
    color: "emerald" | "cyan" | "amber";
    onUpdate: (phase: "warmup" | "flow" | "acceleration", field: "durationPercent" | "intensityPercent", value: number) => void;
    daysCount: number;
    durationReadOnly?: boolean;
}

function PhaseEditor({ phase, phaseName, phaseKey, color, onUpdate, daysCount, durationReadOnly }: PhaseEditorProps) {
    const colorClasses = {
        emerald: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            icon: "text-emerald-400"
        },
        cyan: {
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            text: "text-cyan-400",
            icon: "text-cyan-400"
        },
        amber: {
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            text: "text-amber-400",
            icon: "text-amber-400"
        }
    };

    const colors = colorClasses[color];

    return (
        <div className={cn("p-4 rounded-xl border", colors.bg, colors.border)}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className={cn("w-4 h-4", colors.icon)} />
                    <h4 className={cn("font-medium", colors.text)}>{phaseName}</h4>
                </div>
                <span className="text-xs text-neutral-500">
                    ~{daysCount} days
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs text-neutral-400">Duration %</Label>
                    <div className="flex items-center gap-2">
                        <Slider
                            value={[phase.durationPercent]}
                            onValueChange={(v) => !durationReadOnly && onUpdate(phaseKey, "durationPercent", v[0])}
                            min={0}
                            max={100}
                            step={5}
                            disabled={durationReadOnly}
                            className={cn(durationReadOnly && "opacity-50")}
                        />
                        <span className="text-sm text-white w-12 text-right tabular-nums">
                            {phase.durationPercent}%
                        </span>
                    </div>
                    {durationReadOnly && (
                        <p className="text-[10px] text-neutral-600">Auto-calculated</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-neutral-400">Intensity %</Label>
                    <div className="flex items-center gap-2">
                        <Slider
                            value={[phase.intensityPercent]}
                            onValueChange={(v) => onUpdate(phaseKey, "intensityPercent", v[0])}
                            min={50}
                            max={150}
                            step={5}
                        />
                        <span className="text-sm text-white w-12 text-right tabular-nums">
                            {phase.intensityPercent}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
