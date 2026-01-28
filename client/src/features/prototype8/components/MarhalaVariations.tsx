import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Flag, Trophy, Target, ArrowRight, BookOpen, Layers,
    Zap, Award, Calendar, ChevronRight, Play
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
        desc: "Complete Juz 21-30, then 6-month full Quran revision and Duhur.",
        icon: Trophy,
        color: "bg-indigo-500",
        textColor: "text-indigo-500",
        borderColor: "border-indigo-500",
        gradient: "from-indigo-500 to-indigo-700",
    },
];

export default function MarhalaVariations({ dates, today }: MarhalaVariationsProps) {
    const [activeVariation, setActiveVariation] = useState<string>("v1");

    const variations = [
        { id: "v1", name: "Vertical Steps", component: VerticalSteps },
        { id: "v3", name: "Bento Grid", component: BentoGrid },
        { id: "v4", name: "Metro Line", component: MetroLine },
        { id: "v5", name: "Radial Focus", component: RadialFocus },
    ];

    const ActiveComponent = variations.find(v => v.id === activeVariation)?.component || VerticalSteps;

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
                <ActiveComponent dates={dates} />
            </div>
        </div>
    );
}

// ==========================================
// VARIATION 1: VERTICAL STEPS
// Classic step layout with rich typography
// ==========================================
function VerticalSteps({ dates }: { dates: any }) {
    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <h2 className="text-3xl font-light text-center mb-16 tracking-tight">Your Journey Milestones</h2>
            <div className="relative border-l-2 border-neutral-800 ml-6 md:ml-12 space-y-16">
                {MARHALA_DATA.map((m, i) => {
                    const date = i === 0 ? dates.marhala1 : i === 1 ? dates.marhala2 : dates.marhala3;
                    return (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="relative pl-12"
                        >
                            {/* Node */}
                            <div className={cn(
                                "absolute -left-3.5 top-1 w-7 h-7 rounded-full border-4 border-[#030303] flex items-center justify-center",
                                m.color
                            )}>
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                                <div>
                                    <div className={cn("text-xs font-bold uppercase tracking-widest mb-1", m.textColor)}>
                                        {m.range}
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-1">{m.title}</h3>
                                    <p className="text-neutral-400 text-sm max-w-sm">{m.desc}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-neutral-600 uppercase tracking-widest mb-1">Target Completion</div>
                                    <div className="text-2xl font-mono text-white">{format(date, "MMM d, yyyy")}</div>
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
// VARIATION 3: BENTO GRID
// Structured grid layout
// ==========================================
function BentoGrid({ dates }: { dates: any }) {
    return (
        <div className="max-w-6xl mx-auto p-8 h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
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
                                    <div className="text-5xl font-thin tracking-tighter mb-2">
                                        {format(date, "dd")}
                                    </div>
                                    <div className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
                                        {format(date, "MMMM yyyy")}
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
function MetroLine({ dates }: { dates: any }) {
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
                                <h3 className="text-xl font-bold text-white mb-1">{m.title}</h3>
                                <div className="text-sm text-neutral-400 font-mono bg-neutral-900 py-1 px-3 rounded-lg border border-neutral-800">
                                    {format(date, "MMM d, yyyy")}
                                </div>
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
function RadialFocus({ dates }: { dates: any }) {
    return (
        <div className="h-full flex items-center justify-center p-12 bg-[#050505]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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

                            <h3 className="text-2xl font-medium text-white mb-1">{m.title}</h3>
                            <p className="text-neutral-500 text-sm mb-4">{format(date, "MMMM d, yyyy")}</p>
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

