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

                    // Generate sub-milestones
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

                            {/* Content - Date First Approach */}
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

                                    {/* Collapsible Sub-milestones */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-3 pl-4 border-l border-neutral-800/50 space-y-2 ml-2">
                                                    {juzMilestones.map((juz) => (
                                                        <div key={juz.juz} className="flex items-baseline gap-4 text-xs">
                                                            <div className="w-12 text-neutral-500 font-medium">Juz {juz.juz}</div>
                                                            <div className="flex-1 border-b border-neutral-900 mx-2" />
                                                            <div className="text-neutral-300 whitespace-nowrap font-mono">
                                                                {format(juz.date, "dd MMM yyyy")}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
function BentoGrid({ dates, durations }: { dates: any, durations: any }) {
    return (
        <div className="max-w-6xl mx-auto p-8 h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                {MARHALA_DATA.map((m, i) => {
                    const date = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    return (
                        <motion.div
                            key={m.id}
                            className={cn(
                                "relative bg-neutral-900/30 rounded-3xl p-8 border border-neutral-800/50 overflow-hidden group",
                                i === 2 ? "md:col-span-1 md:row-span-2 bg-gradient-to-br from-indigo-900/10 to-transparent" : ""
                            )}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="absolute top-0 right-0 p-32 opacity-[0.03] transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-700">
                                <m.icon className="w-64 h-64" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className={cn("inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border bg-black/20", m.borderColor, m.textColor)}>
                                        {m.range}
                                    </div>
                                    <h3 className="text-3xl font-light text-white mb-2">{m.title}</h3>
                                    <p className="text-neutral-500 text-sm max-w-[200px]">{m.desc}</p>
                                </div>

                                <div className="mt-8">
                                    <div className="text-3xl font-light tracking-tight text-white mb-1">
                                        {format(date, "MMMM")} <span className="text-neutral-500">{format(date, "yyyy")}</span>
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
function MetroLine({ dates, durations }: { dates: any, durations: any }) {
    return (
        <div className="h-full flex items-center justify-center p-8">
            <div className="flex flex-col md:flex-row items-center gap-0 w-full max-w-5xl">
                {MARHALA_DATA.map((m, i) => {
                    const date = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    return (
                        <div key={m.id} className="flex-1 flex flex-col md:flex-row items-center w-full relative">
                            {/* The Line */}
                            {i < MARHALA_DATA.length - 1 && (
                                <div className="hidden md:block absolute left-1/2 top-6 w-full h-[2px] bg-neutral-800 -z-10">
                                    <motion.div
                                        className={cn("h-full", m.color)}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.5) }}
                                    />
                                </div>
                            )}

                            {/* The Node */}
                            <motion.div
                                className="flex flex-col items-center text-center w-full group cursor-pointer"
                                whileHover={{ y: -5 }}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full border-4 border-[#030303] flex items-center justify-center mb-6 shadow-2xl relative z-10",
                                    m.color
                                )}>
                                    <m.icon className="w-5 h-5 text-white" />
                                </div>

                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">{m.range}</span>
                                <div className="text-2xl font-light text-white mb-1">
                                    {format(date, "MMM")} <span className="text-neutral-500">{format(date, "yyyy")}</span>
                                </div>
                                <div className="text-sm text-neutral-400 font-medium mb-1">
                                    {Math.round(durations[`m${i + 1}`] / 30)} months
                                </div>
                                <div className="text-neutral-500 text-sm">{m.title}</div>
                            </motion.div>
                        </div>
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
function RadialFocus({ dates, durations }: { dates: any, durations: any }) {
    return (
        <div className="h-full flex items-center justify-center p-8 bg-[#050505] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MARHALA_DATA.map((m, i) => {
                    const date = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
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
                                        animate={{ strokeDashoffset: 754 - (754 * ((i + 1) * 33) / 100) }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>

                                <div className="text-center">
                                    <div className="text-6xl font-thin tracking-tighter mb-1">
                                        {i + 1}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Phase</div>
                                </div>
                            </div>

                            <div className="text-2xl font-light text-white mb-1 whitespace-nowrap">
                                {format(date, "MMMM")} <span className="text-neutral-500">{format(date, "yyyy")}</span>
                            </div>
                            <div className="text-sm text-neutral-400 font-mono mb-4">
                                {Math.round(durations[`m${i + 1}`] / 30)} months
                            </div>
                            <h3 className="text-xl text-white font-medium mb-1">{m.title}</h3>
                            <p className="text-xs text-neutral-600 max-w-[200px] text-center">{m.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ==========================================
// VARIATION 6: HERO PERSPECTIVE
// Large, immersive, single view focus
// ==========================================

