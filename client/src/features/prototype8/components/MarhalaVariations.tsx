import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Flag, Trophy, Target, ArrowRight, BookOpen, Layers,
    Zap, Award, Calendar, ChevronRight, Play,
    ChevronDown, ChevronUp
} from "lucide-react";

interface MarhalaVariationsProps {
    dates: {
        marhala1: Date;
        marhala2: Date;
        marhala3: Date;
    };
    today: Date;
}

const MARHALA_DATA = [
    {
        id: "m1",
        title: "The Foundation",
        arabic: "Marhala 1",
        range: "Juz 1-5",
        startJuz: 1,
        endJuz: 5,
        desc: "A more focused initial phase to build core memorization habits.",
        icon: Layers,
        color: "bg-emerald-500",
        textColor: "text-emerald-500",
        borderColor: "border-emerald-500",
        gradient: "from-emerald-500 to-emerald-700",
    },
    {
        id: "m2",
        title: "The Momentum",
        arabic: "Marhala 2",
        range: "Juz 6-20",
        startJuz: 6,
        endJuz: 20,
        desc: "Expanded momentum phase with consistent pace and retention.",
        icon: Zap,
        color: "bg-amber-500",
        textColor: "text-amber-500",
        borderColor: "border-amber-500",
        gradient: "from-amber-500 to-amber-700",
    },
    {
        id: "m3",
        title: "The Mastery",
        arabic: "Marhala 3",
        range: "Juz 21-30",
        startJuz: 21,
        endJuz: 30,
        desc: "Complete Juz 21-30, then 6-month full Quran revision and Duhur.",
        icon: Trophy,
        color: "bg-indigo-500",
        textColor: "text-indigo-500",
        borderColor: "border-indigo-500",
        gradient: "from-indigo-500 to-indigo-700",
    },
];

// Helper to generate interpolated dates for each Juz
const generateJuzDates = (startDate: Date, endDate: Date, startJuz: number, endJuz: number) => {
    const totalDays = differenceInDays(endDate, startDate);
    const numberOfJuz = endJuz - startJuz + 1;
    const daysPerJuz = totalDays / numberOfJuz;

    return Array.from({ length: numberOfJuz }, (_, i) => {
        const juzNum = startJuz + i;
        const daysToAdd = Math.round((i + 1) * daysPerJuz);
        return {
            juz: juzNum,
            date: addDays(startDate, daysToAdd)
        };
    });
};

export default function MarhalaVariations({ dates, today }: MarhalaVariationsProps) {
    const [activeVariation, setActiveVariation] = useState<string>("v1");

    const variations = [
        { id: "v1", name: "Variation 1: Vertical Steps", component: VerticalSteps },
        { id: "v2", name: "Variation 2: Bento Grid", component: BentoGrid },
        { id: "v3", name: "Variation 3: The Ledger", component: CompactStack },
        { id: "v4", name: "Variation 4: The Journey", component: ZigZagPath },
        { id: "v6", name: "Variation 6: The Pulse", component: ThePulse },
        { id: "v8", name: "Variation 8: The Stream", component: TheStream },
        { id: "v10", name: "Variation 10: The Horizon", component: TheHorizon },
    ];

    const ActiveComponent = variations.find(v => v.id === activeVariation)?.component || VerticalSteps;

    // Calculate durations
    const m1Dur = Math.max(1, differenceInDays(dates.marhala1, today));
    const m2Dur = Math.max(1, differenceInDays(dates.marhala2, dates.marhala1));
    const m3Dur = Math.max(1, differenceInDays(dates.marhala3, dates.marhala2));
    const totalDur = m1Dur + m2Dur + m3Dur;

    const durations = { m1: m1Dur, m2: m2Dur, m3: m3Dur, total: totalDur };

    return (
        <div className="flex flex-col h-full bg-[#030303] text-white overflow-hidden">
            {/* Variation Switcher Header */}
            <div className="flex items-center gap-2 p-4 border-b border-neutral-800/50 bg-[#030303]/80 backdrop-blur-sm z-50 overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mr-2 whitespace-nowrap">
                    EXPLORE DESIGNS:
                </span>
                {variations.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setActiveVariation(v.id)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                            activeVariation === v.id
                                ? "bg-white text-black"
                                : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                        )}
                    >
                        {v.name}
                    </button>
                ))}
            </div>

            {/* Design Canvas */}
            <div className="flex-1 relative overflow-y-auto">
                <ActiveComponent dates={dates} durations={durations} today={today} />
            </div>
        </div>
    );
}

// Shared Breakdown Component
function JuzBreakdown({ milestones, isExpanded, phaseStartDate }: { milestones: any[], isExpanded: boolean, phaseStartDate: Date }) {
    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="pt-3 pl-4 border-l border-neutral-800/50 space-y-2 ml-2">
                        {milestones.map((juz, idx) => {
                            const prevDate = idx === 0 ? phaseStartDate : milestones[idx - 1].date;
                            const daysDiff = differenceInDays(juz.date, prevDate);
                            let durationStr = "";

                            if (daysDiff >= 30) {
                                durationStr = `+ ${Math.round(daysDiff / 30)} month${Math.round(daysDiff / 30) > 1 ? 's' : ''}`;
                            } else if (daysDiff >= 7) {
                                durationStr = `+ ${Math.round(daysDiff / 7)} week${Math.round(daysDiff / 7) > 1 ? 's' : ''}`;
                            } else {
                                durationStr = `+ ${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
                            }

                            return (
                                <div key={juz.juz} className="flex items-center gap-4 text-xs">
                                    <div className="w-12 text-neutral-500 font-medium">Juz {juz.juz}</div>
                                    <div className="flex-1 border-b border-neutral-900 mx-2" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-neutral-300 font-mono whitespace-nowrap">
                                            {format(juz.date, "dd MMM yyyy")}
                                        </span>
                                        <span className="text-neutral-600 font-mono text-[10px]">
                                            ({durationStr})
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ==========================================
// VARIATION 1: VERTICAL STEPS
// Classic step layout with rich typography
// ==========================================
function VerticalSteps({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (id: string) => {
        setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h2 className="text-2xl font-light text-center mb-10 tracking-tight">Your Journey Milestones</h2>
            <div className="relative border-l-2 border-neutral-800 ml-6 md:ml-12 space-y-8">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhases[m.id];
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);

                    return (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="relative pl-12"
                            style={{ paddingBottom: i === MARHALA_DATA.length - 1 ? 0 : `${Math.max(2, (durations[`m${i + 2}`] / durations.total) * 10)}rem` }}
                        >
                            {/* Node */}
                            <div className={cn(
                                "absolute -left-3.5 top-1 w-7 h-7 rounded-full border-4 border-[#030303] flex items-center justify-center",
                                m.color
                            )}>
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-light text-neutral-200">{m.title}</h3>
                                        <div className="w-1 h-1 rounded-full bg-neutral-700" />
                                        <div className={cn("text-xs font-bold uppercase tracking-widest", m.textColor)}>
                                            {m.range}
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <h3 className="text-4xl font-light tracking-tight text-white">
                                            {format(phaseEndDate, "MMMM")} <span className="text-neutral-500">{format(phaseEndDate, "yyyy")}</span>
                                        </h3>
                                        <span className="text-neutral-600 font-mono text-xs translate-y-[-2px]">
                                            ({Math.round(durations[`m${i + 1}`] / 30)}mo)
                                        </span>
                                    </div>
                                    <p className="text-neutral-500 text-xs max-w-sm mt-1 mb-2">{m.desc}</p>

                                    {/* Toggle Breakdown */}
                                    <button
                                        onClick={() => togglePhase(m.id)}
                                        className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors group"
                                    >
                                        <span className="uppercase tracking-widest">
                                            {isExpanded ? "Hide Breakdown" : "View Breakdown"}
                                        </span>
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />}
                                    </button>

                                    <JuzBreakdown
                                        milestones={juzMilestones}
                                        isExpanded={isExpanded}
                                        phaseStartDate={phaseStartDate}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// ==========================================

// ==========================================
// VARIATION 2: BENTO GRID
// Structured grid layout
// ==========================================
function BentoGrid({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (id: string) => {
        setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-w-6xl mx-auto p-8 h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhases[m.id];
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);

                    return (
                        <motion.div
                            key={m.id}
                            className={cn(
                                "relative bg-neutral-900/30 rounded-3xl p-8 border border-neutral-800/50 overflow-hidden group",
                                i === 2 ? "md:col-span-1 md:row-span-2 bg-gradient-to-br from-indigo-900/10 to-transparent" : "md:col-span-1"
                            )}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="absolute top-0 right-0 p-32 opacity-[0.03] transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-700">
                                <m.icon className="w-64 h-64" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={cn("inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-black/20", m.borderColor, m.textColor)}>
                                            {m.range}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-light text-white mb-2">{m.title}</h3>
                                    <p className="text-neutral-500 text-xs max-w-[200px] mb-4">{m.desc}</p>

                                    <button
                                        onClick={() => togglePhase(m.id)}
                                        className="flex items-center gap-2 text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
                                    >
                                        {isExpanded ? "Hide" : "Details"}
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>

                                    <JuzBreakdown
                                        milestones={juzMilestones}
                                        isExpanded={isExpanded}
                                        phaseStartDate={phaseStartDate}
                                    />
                                </div>

                                <div className="mt-8">
                                    <div className="text-3xl font-light tracking-tight text-white mb-1">
                                        {format(phaseEndDate, "MMMM")} <span className="text-neutral-500">{format(phaseEndDate, "yyyy")}</span>
                                    </div>
                                    <div className="text-xs font-mono text-neutral-500">
                                        {Math.round(durations[`m${i + 1}`] / 30)} months duration
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}


// ==========================================
// VARIATION 3: COMPACT STACK ("The Ledger")
// ==========================================
function CompactStack({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhase, setExpandedPhase] = useState<string | null>("m1");

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <h2 className="text-2xl font-light text-center mb-12 tracking-tight">Milestone Ledger</h2>
            <div className="space-y-3">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhase === m.id;
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);

                    return (
                        <motion.div
                            key={m.id}
                            className={cn(
                                "group border rounded-2xl overflow-hidden transition-all duration-300",
                                isExpanded
                                    ? "bg-neutral-900 border-neutral-700 shadow-2xl"
                                    : "bg-neutral-900/40 border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-900/60"
                            )}
                            layout
                        >
                            <div
                                onClick={() => setExpandedPhase(isExpanded ? null : m.id)}
                                className="flex items-center justify-between p-6 cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                        isExpanded ? m.color : "bg-neutral-800"
                                    )}>
                                        <m.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                                        <h3 className={cn("text-xl font-light transition-colors", isExpanded ? "text-white" : "text-neutral-400")}>{m.title}</h3>
                                        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", isExpanded ? cn(m.borderColor, "bg-black/30", m.textColor) : "border-neutral-800 text-neutral-600")}>
                                            {m.range}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right hidden sm:block">
                                        <div className={cn("text-xl font-light tracking-tight transition-colors", isExpanded ? "text-white" : "text-neutral-500")}>
                                            {format(phaseEndDate, "MMM yyyy")}
                                        </div>
                                    </div>
                                    <ChevronDown className={cn("w-5 h-5 text-neutral-500 transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
                                </div>
                            </div>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-neutral-800 p-6 bg-black/20">
                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="md:w-1/3 shrink-0">
                                                    <div className="text-sm text-neutral-400 leading-relaxed mb-6">{m.desc}</div>
                                                    <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                                                        <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Duration</div>
                                                        <div className="text-2xl font-light text-white">
                                                            {Math.round(durations[`m${i + 1}`] / 30)} months
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Detailed Schedule</div>
                                                    <JuzBreakdown
                                                        milestones={juzMilestones}
                                                        isExpanded={true}
                                                        phaseStartDate={phaseStartDate}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// ==========================================
// VARIATION 4: ZIG-ZAG PATH ("The Journey")
// ==========================================
function ZigZagPath({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (id: string) => {
        setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="max-w-5xl mx-auto py-16 px-6 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-800 -translate-x-1/2" />

            <div className="space-y-24 relative z-10">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhases[m.id];
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);
                    const isEven = i % 2 === 0;

                    return (
                        <motion.div
                            key={m.id}
                            className={cn(
                                "flex items-start gap-12",
                                isEven ? "flex-row" : "flex-row-reverse"
                            )}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <div className={cn("flex-1 pt-4", isEven ? "text-right" : "text-left")}>
                                <div className={cn("flex flex-col", isEven ? "items-end" : "items-start")}>
                                    <h3 className="text-3xl font-light text-white mb-2">{m.title}</h3>
                                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4", m.borderColor, m.textColor)}>
                                        {m.range}
                                    </div>
                                    <div className="text-4xl font-light tracking-tight text-white mb-2">
                                        {format(phaseEndDate, "MMM")} <span className="text-neutral-500">{format(phaseEndDate, "yyyy")}</span>
                                    </div>
                                    <p className="text-neutral-500 text-sm max-w-xs mb-4">{m.desc}</p>

                                    <button
                                        onClick={() => togglePhase(m.id)}
                                        className={cn(
                                            "flex items-center gap-2 text-xs font-medium uppercase tracking-widest hover:text-white transition-colors mb-4",
                                            m.textColor
                                        )}
                                    >
                                        {isExpanded ? "Hide Details" : "View Breakdown"}
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "")} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative shrink-0">
                                <div className={cn(
                                    "w-16 h-16 rounded-full border-8 border-[#030303] flex items-center justify-center shadow-2xl relative z-10 bg-neutral-900",
                                    m.color
                                )}>
                                    <m.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={cn(
                                    "absolute top-1/2 w-12 h-0.5 bg-neutral-800 -z-10",
                                    isEven ? "right-full mr-[-2px]" : "left-full ml-[-2px]"
                                )} />
                            </div>

                            <div className="flex-1 pt-8">
                                <AnimatePresence>
                                    {isExpanded ? (
                                        <motion.div
                                            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: isEven ? 20 : -20 }}
                                            className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800 text-left"
                                        >
                                            <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 border-b border-neutral-800 pb-2">
                                                By Juz Schedule
                                            </div>
                                            <JuzBreakdown
                                                milestones={juzMilestones}
                                                isExpanded={true}
                                                phaseStartDate={phaseStartDate}
                                            />
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex items-center opacity-0 pointer-events-none" aria-hidden="true">
                                            <div className="w-full text-neutral-800 text-6xl font-black opacity-10 select-none">
                                                {format(phaseEndDate, "MM")}
                                            </div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}



// ==========================================
// VARIATION 6: THE PULSE
// Modern, spacing-aware fluid stream
// ==========================================
// ==========================================
// VARIATION 6: THE PULSE
// Modern, spacing-aware fluid stream
// ==========================================
function ThePulse({ dates, today }: { dates: any, durations: any, today: Date }) {
    // Slightly more breathing room for text
    const PIXELS_PER_DAY = 1.4;

    // Bounds
    const startDate = addDays(today, -30);
    const endDate = addDays(dates.marhala3, 60);
    const totalDays = differenceInDays(endDate, startDate);
    const containerWidth = totalDays * PIXELS_PER_DAY;

    const getX = (date: Date) => Math.max(0, differenceInDays(date, startDate)) * PIXELS_PER_DAY;

    // Generate years for background
    const years = [];
    let currentIterDate = new Date(startDate.getFullYear(), 0, 1);
    const endIterDate = new Date(endDate.getFullYear() + 1, 0, 1);

    while (currentIterDate < endIterDate) {
        years.push(new Date(currentIterDate));
        currentIterDate = new Date(currentIterDate.getFullYear() + 1, 0, 1);
    }

    // Subtle gradients for years - extremely restrained
    const yearGradients = [
        "from-blue-500/[0.03] via-blue-500/[0.01] to-transparent",
        "from-indigo-500/[0.03] via-indigo-500/[0.01] to-transparent",
        "from-violet-500/[0.03] via-violet-500/[0.01] to-transparent",
    ];

    return (
        <div className="h-full w-full overflow-x-auto overflow-y-hidden bg-[#030303] custom-scrollbar flex items-center relative font-sans">
            <div style={{ width: `${containerWidth}px` }} className="relative h-full text-sm">

                {/* Years Background Layer */}
                <div className="absolute inset-0 flex pointer-events-none">
                    {years.map((yearDate, i) => {
                        const yearStart = Math.max(startDate.getTime(), yearDate.getTime());
                        const nextYear = new Date(yearDate.getFullYear() + 1, 0, 1);
                        const yearEnd = Math.min(endDate.getTime(), nextYear.getTime());

                        if (yearEnd <= yearStart) return null;

                        const startX = getX(new Date(yearStart));
                        const endX = getX(new Date(yearEnd));
                        const width = endX - startX;

                        // Only show label if we have enough breathing room
                        const showLabel = width > 150;

                        return (
                            <div
                                key={yearDate.getFullYear()}
                                className={cn(
                                    "h-full relative bg-gradient-to-r",
                                    yearGradients[i % yearGradients.length]
                                )}
                                style={{ left: startX, width: width, position: 'absolute' }}
                            >
                                {/* Year Label - Modern & Elegant */}
                                {showLabel && (
                                    <div className="absolute top-6 left-6 flex items-baseline gap-2 opacity-30">
                                        <span className="text-4xl font-light tracking-tighter text-white">
                                            {yearDate.getFullYear()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Central Timeline Layer */}
                <div className="absolute top-1/2 left-0 right-0 h-64 -translate-y-1/2">

                    {/* The Rail */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800" />

                    {/* Phases & Milestones */}
                    {MARHALA_DATA.map((m, i) => {
                        const ps = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                        const pe = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                        const milestones = generateJuzDates(ps, pe, m.startJuz, m.endJuz);

                        const startX = getX(ps);
                        const width = getX(pe) - startX;

                        return (
                            <div key={m.id}>
                                {/* Phase Active Line */}
                                <div
                                    className={cn("absolute top-1/2 h-[4px] -translate-y-1/2 shadow-lg", m.color)}
                                    style={{
                                        left: startX,
                                        width: width,
                                        opacity: 0.4
                                    }}
                                />

                                {/* Phase Label - Floating clearly above */}
                                <div
                                    className="absolute top-22 left-0 text-center pointer-events-none z-50"
                                    style={{ left: startX + width / 2, transform: 'translateX(-50%)' }}
                                >
                                    <div className={cn("px-3 py-1 rounded-full border bg-[#030303]/80 backdrop-blur-md shadow-xl", m.borderColor)}>
                                        <div className={cn("text-xs font-bold uppercase tracking-widest", m.textColor)}>
                                            {m.title}
                                        </div>
                                    </div>
                                </div>

                                {/* Milestones */}
                                {milestones.map((juz) => {
                                    const jLeft = getX(juz.date);

                                    // 4-Level Staggering Logic
                                    // 0: Short Up, 1: Short Down, 2: Tall Up, 3: Tall Down
                                    const staggerType = juz.juz % 4;

                                    let stemClass = "";
                                    let labelClass = "";

                                    switch (staggerType) {
                                        case 0: // Short Up
                                            stemClass = "bottom-3 h-12";
                                            labelClass = "bottom-16";
                                            break;
                                        case 1: // Short Down
                                            stemClass = "top-3 h-12";
                                            labelClass = "top-16";
                                            break;
                                        case 2: // Tall Up
                                            stemClass = "bottom-3 h-24";
                                            labelClass = "bottom-28";
                                            break;
                                        case 3: // Tall Down
                                            stemClass = "top-3 h-24";
                                            labelClass = "top-28";
                                            break;
                                    }

                                    return (
                                        <div
                                            key={juz.juz}
                                            className="absolute top-1/2 -translate-y-1/2 group z-20"
                                            style={{ left: jLeft }}
                                        >
                                            {/* Node */}
                                            <div className={cn(
                                                "w-3 h-3 -ml-[6px] rounded-full border-[1px] bg-neutral-800 transition-all duration-300 relative z-20",
                                                m.borderColor,
                                                "group-hover:scale-125 group-hover:bg-white group-hover:border-white",
                                                m.id === 'm1' ? "group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                                                    m.id === 'm2' ? "group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]" :
                                                        "group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                            )} />

                                            {/* Stem */}
                                            <div className={cn(
                                                "absolute w-px bg-neutral-800 group-hover:bg-neutral-600 transition-colors -ml-[0.5px]",
                                                stemClass
                                            )} />

                                            {/* Label Container */}
                                            <div className={cn(
                                                "absolute transform -translate-x-1/2 flex flex-col items-center gap-1 min-w-[80px]",
                                                labelClass,
                                                // Adjust vertical flex order for bottom items so label is below date?
                                                // Actually keeping standard order (Text, Date) is fine, just positioned differently.
                                                // But for Down items, usually we want Stem -> Text -> Date (going down).
                                                // Current interior structure is Text then Date.
                                                // For "Top" items (Label above): Text (top), Date (bottom). OK.
                                                // For "Bottom" items (Label below): Text (top), Date (bottom). This puts Date furthest down. OK.
                                            )}>
                                                {/* Milestone Name */}
                                                <div className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors tracking-tight">
                                                    Juz {juz.juz}
                                                </div>

                                                {/* Date - Always visible but subtle, pops on hover */}
                                                <div className="text-[10px] font-mono font-medium text-neutral-600 group-hover:text-neutral-400 transition-colors uppercase tracking-wider bg-[#030303]/80 px-1 py-0.5 rounded">
                                                    {format(juz.date, "dd MMM")}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Time Axis - Clean & Minimal */}
                <div className="absolute bottom-0 left-0 right-0 h-10 border-t border-neutral-900 bg-[#030303]/90 backdrop-blur-sm z-30">
                    {Array.from({ length: Math.ceil(totalDays / 30) }).map((_, i) => {
                        const d = addDays(startDate, i * 30);
                        const isYear = d.getMonth() === 0;
                        return (
                            <div key={i} className="absolute top-0 bottom-0 flex flex-col justify-center" style={{ left: getX(d) }}>
                                {/* Tick */}
                                <div className={cn("absolute top-0 w-px bg-neutral-800 -translate-x-1/2", isYear ? "h-full" : "h-2")} />

                                {/* Label */}
                                <span className={cn(
                                    "text-[10px] font-medium tracking-wide pl-2 select-none",
                                    isYear ? "text-white" : "text-neutral-600"
                                )}>
                                    {isYear ? format(d, "yyyy") : format(d, "MMM")}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}




// ==========================================
// VARIATION 8: THE STREAM
// Fluid, organic, interconnected
// ==========================================
function TheStream({ dates, today }: { dates: any, durations: any, today: Date }) {
    const PIXELS_PER_DAY = 1.6; // More spacious
    const startDate = addDays(today, -30);
    const endDate = addDays(dates.marhala3, 60);
    const totalDays = differenceInDays(endDate, startDate);
    const containerWidth = totalDays * PIXELS_PER_DAY;
    const getX = (date: Date) => Math.max(0, differenceInDays(date, startDate)) * PIXELS_PER_DAY;

    // Years background
    const years = [];
    let currentIterDate = new Date(startDate.getFullYear(), 0, 1);
    const endIterDate = new Date(endDate.getFullYear() + 1, 0, 1);
    while (currentIterDate < endIterDate) {
        years.push(new Date(currentIterDate));
        currentIterDate = new Date(currentIterDate.getFullYear() + 1, 0, 1);
    }

    return (
        <div className="h-full w-full overflow-x-auto overflow-y-hidden bg-[#030303] custom-scrollbar flex items-center relative font-sans selection:bg-emerald-500/30">
            <div style={{ width: `${containerWidth}px` }} className="relative h-full text-sm">

                {/* Ambient Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 via-neutral-900/5 to-neutral-900/0 pointers-events-none" />

                {/* Years - Subtle Vertical Dividers */}
                {/* Years - Subtle Vertical Dividers */}
                {years.map((yearDate) => {
                    const nextYear = new Date(yearDate.getFullYear() + 1, 0, 1);
                    const startX = getX(yearDate);
                    const endX = getX(nextYear);
                    const width = endX - startX;

                    // If it's too far left/right or too narrow, don't show label
                    if (startX > containerWidth) return null;

                    // Only show label if we have enough breathing room (e.g. ~150px)
                    const showLabel = width > 150;

                    return (
                        <div key={yearDate.getFullYear()} className="absolute top-0 bottom-0 border-l border-white/[0.03]" style={{ left: startX }}>
                            {showLabel && (
                                <div className="ml-4 mt-8 text-6xl font-black text-white/[0.02] tracking-tighter select-none">
                                    {yearDate.getFullYear()}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Central Stream Container */}
                <div className="absolute top-1/2 left-0 right-0 h-40 -translate-y-1/2">
                    {/* Connection Line (The Stream) */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-900/50 via-neutral-800 to-indigo-900/50 blur-[1px]" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-neutral-800 opacity-50" />

                    {MARHALA_DATA.map((m, i) => {
                        const ps = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                        const pe = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                        const milestones = generateJuzDates(ps, pe, m.startJuz, m.endJuz);
                        const startX = getX(ps);
                        const width = getX(pe) - startX;

                        return (
                            <div key={m.id}>
                                {/* Phase Glow Underlay */}
                                <div
                                    className={cn("absolute top-1/2 -translate-y-1/2 h-32 blur-3xl opacity-10 rounded-full transition-opacity duration-500 hover:opacity-20", m.color)}
                                    style={{ left: startX, width: width }}
                                />

                                {/* Phase Indicator (Minimal) */}
                                <div
                                    className="absolute top-[-60px] flex items-center gap-3 px-4 py-2"
                                    style={{ left: startX }}
                                >
                                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor]", m.textColor)} />
                                    <span className={cn("text-xs font-bold uppercase tracking-[0.2em] opacity-80", m.textColor)}>
                                        {m.title}
                                    </span>
                                </div>

                                {/* Milestones */}
                                {milestones.map((juz) => {
                                    const jLeft = getX(juz.date);
                                    const isUp = juz.juz % 2 === 0; // Simple alternating

                                    return (
                                        <div
                                            key={juz.juz}
                                            className="absolute top-1/2 -translate-y-1/2 z-20 group"
                                            style={{ left: jLeft }}
                                        >
                                            {/* The Node - Organic Shape */}
                                            <div className="relative">
                                                <div className={cn(
                                                    "w-3 h-3 -ml-[6px] rounded-full border border-neutral-700 bg-[#050505] transition-all duration-300 relative z-20 group-hover:scale-150 group-hover:border-white",
                                                    m.id === 'm1' ? "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                                                        m.id === 'm2' ? "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]" :
                                                            "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                                )} />
                                            </div>

                                            {/* The Label - Connected via subtle line */}
                                            <div className={cn(
                                                "absolute left-[-1px] w-px bg-gradient-to-b from-neutral-800 to-transparent transition-all duration-300 group-hover:bg-neutral-600",
                                                isUp ? "bottom-3 h-12 bg-gradient-to-t" : "top-3 h-12"
                                            )} />

                                            <div className={cn(
                                                "absolute transform -translate-x-1/2 flex flex-col items-center gap-1 min-w-[100px] transition-all duration-300",
                                                isUp ? "bottom-[4.5rem] group-hover:bottom-[5rem]" : "top-[4.5rem] group-hover:top-[5rem]"
                                            )}>
                                                <div className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-neutral-900 group-hover:border-neutral-700 shadow-xl backdrop-blur-sm transition-colors text-center">
                                                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5 group-hover:text-white transition-colors">
                                                        Juz {juz.juz}
                                                    </div>
                                                    <div className="text-[9px] font-mono text-neutral-600 group-hover:text-neutral-400">
                                                        {format(juz.date, "MMM d")}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// VARIATION 10: THE HORIZON
// Cinematic, spacious, text-forward
// ==========================================
function TheHorizon({ dates, today }: { dates: any, durations: any, today: Date }) {
    const PIXELS_PER_DAY = 1.2;
    const startDate = addDays(today, -30);
    const endDate = addDays(dates.marhala3, 60);
    const totalDays = differenceInDays(endDate, startDate);
    const containerWidth = totalDays * PIXELS_PER_DAY;
    const getX = (date: Date) => Math.max(0, differenceInDays(date, startDate)) * PIXELS_PER_DAY;

    return (
        <div className="h-full w-full overflow-x-auto overflow-y-hidden bg-[#0A0A0A] custom-scrollbar flex items-center relative font-sans">
            <div style={{ width: `${containerWidth}px` }} className="relative h-full">

                {/* Sky (Phase Backgrounds) */}
                <div className="absolute top-0 bottom-[100px] left-0 right-0">
                    {MARHALA_DATA.map((m, i) => {
                        const ps = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                        const pe = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                        const startX = getX(ps);
                        const width = getX(pe) - startX;

                        return (
                            <div key={m.id} className="absolute top-0 bottom-0 border-r border-neutral-900 overflow-hidden" style={{ left: startX, width }}>
                                <div className={cn("absolute inset-0 bg-gradient-to-b opacity-[0.03]", m.gradient)} />
                                <div className="p-8">
                                    <h2 className="text-[80px] font-black text-white/[0.04] leading-none tracking-tighter uppercase select-none">
                                        {m.arabic}
                                    </h2>
                                    <div className="mt-4 flex items-center gap-4">
                                        <div className={cn("h-1 w-12 rounded-full", m.color)} />
                                        <span className={cn("text-sm font-bold uppercase tracking-widest", m.textColor)}>
                                            {m.title}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-neutral-600 text-xs font-medium max-w-[200px] leading-relaxed">
                                        {m.desc}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Ground (Timeline) */}
                <div className="absolute bottom-0 left-0 right-0 h-[100px] border-t border-neutral-800 bg-[#080808]">
                    {/* Month Labels - Vertical */}
                    {Array.from({ length: Math.ceil(totalDays / 30) }).map((_, i) => {
                        const d = addDays(startDate, i * 30);
                        return (
                            <div key={i} className="absolute top-0 bottom-0 w-px bg-neutral-900" style={{ left: getX(d) }}>
                                <span
                                    className="absolute top-2 left-2 text-[9px] text-neutral-700 uppercase tracking-[0.15em] rotate-180"
                                    style={{
                                        writingMode: 'vertical-rl',
                                        textOrientation: 'mixed'
                                    }}
                                >
                                    {format(d, "MMMM")}
                                </span>
                            </div>
                        )
                    })}

                    {MARHALA_DATA.map((m, i) => {
                        const ps = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                        const pe = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                        const milestones = generateJuzDates(ps, pe, m.startJuz, m.endJuz);

                        return (
                            <div key={m.id}>
                                {milestones.map((juz) => {
                                    const jLeft = getX(juz.date);

                                    // Calculate staggered heights (3 levels) with significant spacing
                                    const heightLevel = juz.juz % 3;
                                    let connectionHeight = "";
                                    let labelOffset = "";

                                    switch (heightLevel) {
                                        case 0: // Short
                                            connectionHeight = "h-[50px]";
                                            labelOffset = "bottom-[55px]";
                                            break;
                                        case 1: // Medium
                                            connectionHeight = "h-[100px]";
                                            labelOffset = "bottom-[105px]";
                                            break;
                                        case 2: // Tall
                                            connectionHeight = "h-[150px]";
                                            labelOffset = "bottom-[155px]";
                                            break;
                                    }

                                    return (
                                        <div
                                            key={juz.juz}
                                            className="absolute top-[-6px] group cursor-pointer"
                                            style={{ left: jLeft }}
                                        >
                                            {/* Milestone Point */}
                                            <div className={cn(
                                                "w-[11px] h-[11px] -ml-[5px] rotate-45 border bg-[#0A0A0A] group-hover:bg-white group-hover:border-white transition-colors z-20 relative shadow-sm",
                                                m.borderColor
                                            )} />

                                            {/* Connection Line to Top */}
                                            <div className={cn(
                                                "absolute bottom-[5px] left-0 w-px bg-neutral-800 group-hover:bg-neutral-600 transition-colors",
                                                connectionHeight
                                            )} />

                                            {/* Label above */}
                                            <div className={cn(
                                                "absolute left-1/2 -translate-x-1/2 flex flex-col items-center",
                                                labelOffset
                                            )}>
                                                <span className="text-xs font-bold text-neutral-600 group-hover:text-white transition-colors uppercase tracking-wider whitespace-nowrap">
                                                    Juz {juz.juz}
                                                </span>
                                            </div>

                                            {/* Hover Tooltip - Floating Above */}
                                            <div className={cn(
                                                "absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none",
                                                heightLevel === 0 ? "bottom-[70px]" : heightLevel === 1 ? "bottom-[120px]" : "bottom-[170px]"
                                            )}>
                                                <div className="px-3 py-2 bg-white text-black rounded shadow-2xl flex flex-col items-center min-w-[max-content]">
                                                    <span className="text-xs font-bold">{format(juz.date, "MMMM do, yyyy")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
}

// Add these utility classes to global css if needed, or inline styles
// .custom-scrollbar: { scrollbar-width: thin; scrollbar-color: #333 #000; }


