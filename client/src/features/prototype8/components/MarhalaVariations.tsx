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
        { id: "v1", name: "Vertical Steps", component: VerticalSteps },
        { id: "v7", name: "The Horizon", component: HorizontalCards },
        { id: "v8", name: "The Ledger", component: CompactStack },
        { id: "v9", name: "The Journey", component: ZigZagPath },
        { id: "v3", name: "Bento Grid", component: BentoGrid },
        { id: "v4", name: "Metro Line", component: MetroLine },
        { id: "v5", name: "Radial Focus", component: RadialFocus },
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
// VARIATION 3: BENTO GRID
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
// VARIATION 4: METRO LINE
// Minimalist connector nodes vertical/horizontal
// ==========================================
function MetroLine({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (id: string) => {
        setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="h-full flex items-center justify-center p-8 overflow-y-auto">
            <div className="flex flex-col md:flex-row items-start justify-center gap-4 w-full max-w-6xl">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhases[m.id];
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);

                    return (
                        <motion.div
                            key={m.id}
                            layout
                            className="flex-1 flex flex-col items-center w-full relative"
                        >
                            {/* The Line - simplified for expandability */}
                            {i < MARHALA_DATA.length - 1 && (
                                <div className="hidden md:block absolute left-[50%] top-6 w-full h-[2px] bg-neutral-800 -z-10 translate-x-[50%]">
                                </div>
                            )}

                            {/* The Node */}
                            <motion.div
                                className="flex flex-col items-center text-center w-full group cursor-pointer"
                                layout
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full border-4 border-[#030303] flex items-center justify-center mb-6 shadow-2xl relative z-10 bg-neutral-900",
                                    m.color
                                )}>
                                    <m.icon className="w-5 h-5 text-white" />
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg font-light text-white">{m.title}</span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{m.range}</span>
                                </div>

                                <div className="text-2xl font-light text-white mb-1">
                                    {format(phaseEndDate, "MMM")} <span className="text-neutral-500">{format(phaseEndDate, "yyyy")}</span>
                                </div>
                                <div className="text-sm text-neutral-400 font-medium mb-2">
                                    {Math.round(durations[`m${i + 1}`] / 30)} months
                                </div>

                                <button
                                    onClick={() => togglePhase(m.id)}
                                    className="flex items-center gap-2 text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-widest mb-4"
                                >
                                    {isExpanded ? "Less" : "Details"}
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>

                                <div className="w-full max-w-xs text-left">
                                    <JuzBreakdown
                                        milestones={juzMilestones}
                                        isExpanded={isExpanded}
                                        phaseStartDate={phaseStartDate}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}


// ==========================================
// VARIATION 5: RADIAL FOCUS
// Circular progress
// ==========================================
function RadialFocus({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (id: string) => {
        setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="h-full flex items-center justify-center p-8 bg-[#050505] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhases[m.id];
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);

                    return (
                        <div key={m.id} className="flex flex-col items-center">
                            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                                {/* Rings */}
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle cx="128" cy="128" r="120" stroke="#1a1a1a" strokeWidth="2" fill="none" />
                                    <motion.circle
                                        cx="128" cy="128" r="120"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        className={m.textColor}
                                        strokeDasharray="754"
                                        strokeDashoffset="754"
                                        initial={{ strokeDashoffset: 754 }}
                                        animate={{ strokeDashoffset: 754 - (754 * ((i + 1) * 33) / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    />
                                </svg>

                                <div className="text-center">
                                    <div className="text-6xl font-thin tracking-tighter mb-1 text-white">
                                        {i + 1}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Phase</div>
                                </div>
                            </div>

                            <div className="text-2xl font-light text-white mb-1 whitespace-nowrap">
                                {format(phaseEndDate, "MMMM")} <span className="text-neutral-500">{format(phaseEndDate, "yyyy")}</span>
                            </div>
                            <div className="text-sm text-neutral-400 font-mono mb-4">
                                {Math.round(durations[`m${i + 1}`] / 30)} months
                            </div>
                            <h3 className="text-xl text-white font-medium mb-1">{m.title}</h3>
                            <p className="text-xs text-neutral-600 max-w-[200px] text-center mb-4">{m.desc}</p>

                            <button
                                onClick={() => togglePhase(m.id)}
                                className="flex items-center gap-2 text-[10px] text-neutral-400 hover:text-white transition-colors uppercase tracking-widest mb-4"
                            >
                                {isExpanded ? "Back to Summary" : "View Schedule"}
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            <div className="w-full max-w-xs text-left bg-neutral-900/20 rounded-xl p-2">
                                <JuzBreakdown
                                    milestones={juzMilestones}
                                    isExpanded={isExpanded}
                                    phaseStartDate={phaseStartDate}
                                // limit height logic handled by AnimatePresence
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ==========================================
// VARIATION 7: HORIZONTAL CARDS ("The Horizon")
// ==========================================
function HorizontalCards({ dates, durations, today }: { dates: any, durations: any, today: Date }) {
    const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (id: string) => {
        setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="h-full flex flex-col justify-center p-8 overflow-y-hidden">
            <h2 className="text-2xl font-light text-center mb-8 tracking-tight shrink-0">Your Journey Timeline</h2>
            <div className="flex-1 flex items-center gap-6 overflow-x-auto pb-8 px-4 no-scrollbar snap-x snap-mandatory">
                {MARHALA_DATA.map((m, i) => {
                    const phaseEndDate = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    const phaseStartDate = i === 0 ? today : i === 1 ? dates.marhala1 : dates.marhala2;
                    const isExpanded = expandedPhases[m.id];
                    const juzMilestones = generateJuzDates(phaseStartDate, phaseEndDate, m.startJuz, m.endJuz);

                    return (
                        <motion.div
                            key={m.id}
                            className={cn(
                                "relative w-[340px] shrink-0 bg-neutral-900/60 rounded-3xl border border-neutral-800/50 overflow-hidden flex flex-col snap-center transition-all duration-500",
                                isExpanded ? "h-full bg-neutral-900" : "h-[420px]"
                            )}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={cn("h-24 relative overflow-hidden p-6 flex items-start justify-between bg-gradient-to-br", m.gradient)}>
                                <div className="absolute -right-4 -top-4 opacity-20">
                                    <m.icon className="w-32 h-32 text-black" />
                                </div>
                                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/30 text-white backdrop-blur-sm">
                                    {m.range}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col overflow-hidden">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-light text-white mb-2">{m.title}</h3>
                                    <div className="text-3xl font-light tracking-tight text-white mb-1">
                                        {format(phaseEndDate, "MMM")} <span className="text-neutral-500">{format(phaseEndDate, "yyyy")}</span>
                                    </div>
                                    <div className="text-xs font-mono text-neutral-500 mb-2">
                                        {Math.round(durations[`m${i + 1}`] / 30)} months
                                    </div>
                                    <p className="text-neutral-400 text-xs leading-relaxed">{m.desc}</p>
                                </div>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex-1 overflow-y-auto pr-2 mb-4"
                                    >
                                        <JuzBreakdown
                                            milestones={juzMilestones}
                                            isExpanded={true}
                                            phaseStartDate={phaseStartDate}
                                        />
                                    </motion.div>
                                )}

                                <div className="mt-auto">
                                    <button
                                        onClick={() => togglePhase(m.id)}
                                        className="w-full py-3 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-widest bg-neutral-800/50 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-300"
                                    >
                                        {isExpanded ? "Hide Schedule" : "View Schedule"}
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
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
// VARIATION 8: COMPACT STACK ("The Ledger")
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
// VARIATION 9: ZIG-ZAG PATH ("The Journey")
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
