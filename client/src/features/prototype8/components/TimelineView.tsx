import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, getYear } from "date-fns";
import { cn } from "@/lib/utils";
import { ChartDataPoint } from "../utils";

interface TimelineViewProps {
    chartData: ChartDataPoint[];
    breakPeriods: { name: string; startDate: Date; endDate: Date }[];
}

interface MilestoneEvent {
    date: Date;
    juz: number;
    phase: string;
    label: string;
    sublabel: string;
    isBreak: boolean;
    breakName?: string;
    year: number;
}

// Period tabs for switching between Juz groups
const PERIOD_TABS = [
    { id: "juz1-10", label: "1995 - 2000", originalLabel: "Juz 1-10", range: [0, 10] },
    { id: "juz11-20", label: "2001 - 2005", originalLabel: "Juz 11-20", range: [10, 20] },
    { id: "juz21-30", label: "2006 - 2010", originalLabel: "Juz 21-30", range: [20, 30] },
];

export default function TimelineView({ chartData, breakPeriods }: TimelineViewProps) {
    const [activePeriod, setActivePeriod] = useState("juz1-10");

    // Transform chart data into milestone events
    const milestones = useMemo((): MilestoneEvent[] => {
        const events: MilestoneEvent[] = [];
        let lastJuz = -1;

        // Process chart data to extract Juz milestones
        for (const point of chartData) {
            const currentJuz = Math.floor(point.juz);

            // Record when reaching a new Juz
            if (currentJuz !== lastJuz && currentJuz > 0) {
                events.push({
                    date: point.date,
                    juz: currentJuz,
                    phase: point.phase,
                    label: currentJuz === 30 ? "Khatam! 🎉" : `Juz ${currentJuz}`,
                    // Use standard date for processing, display format will be handled in render
                    sublabel: format(point.date, "MMMM d, yyyy"),
                    isBreak: false,
                    year: getYear(point.date),
                });
                lastJuz = currentJuz;
            }
        }

        // Add break periods as events
        for (const bp of breakPeriods) {
            events.push({
                date: bp.startDate,
                juz: -1, // Indicates break
                phase: "Break",
                label: bp.name,
                sublabel: `${format(bp.startDate, "MMM d")} - ${format(bp.endDate, "MMM d")}`,
                isBreak: true,
                breakName: bp.name,
                year: getYear(bp.startDate),
            });
        }

        // Sort events by date
        events.sort((a, b) => a.date.getTime() - b.date.getTime());

        return events;
    }, [chartData, breakPeriods]);

    // Filter milestones based on active period
    const filteredMilestones = useMemo(() => {
        const activePeriodConfig = PERIOD_TABS.find(p => p.id === activePeriod);
        if (!activePeriodConfig) return milestones;

        const [min, max] = activePeriodConfig.range;
        return milestones.filter(m => {
            if (m.isBreak) {
                const juzInRange = milestones.filter(
                    e => !e.isBreak && e.juz > min && e.juz <= max
                );
                if (juzInRange.length === 0) return false;
                const minDate = juzInRange[0]?.date || new Date();
                const maxDate = juzInRange[juzInRange.length - 1]?.date || new Date();
                return m.date >= minDate && m.date <= maxDate;
            }
            return m.juz > min && m.juz <= max;
        });
    }, [milestones, activePeriod]);

    // Group by year for the macro anchor
    const milestonesByYear = useMemo(() => {
        const grouped: Record<number, MilestoneEvent[]> = {};
        for (const m of filteredMilestones) {
            if (!grouped[m.year]) {
                grouped[m.year] = [];
            }
            grouped[m.year].push(m);
        }
        return grouped;
    }, [filteredMilestones]);

    const years = Object.keys(milestonesByYear).map(Number).sort((a, b) => a - b);

    // Reference styling constants
    const LINE_COLOR = "bg-[#2541B2]"; // Approx classic blue/indigo from reference
    const YEAR_COLOR = "text-neutral-200/20"; // Faded year
    const SEPARATOR_COLOR = "border-neutral-800/50";

    return (
        <div className="flex flex-col h-full font-sans bg-transparent">
            {/* Header Section */}
            <div className="flex flex-col items-start px-8 py-8 md:px-12">
                <h2 className="text-xs font-bold tracking-widest text-[#4f6bff] uppercase mb-1">
                    YOUR JOURNEY
                </h2>
                <h1 className="text-sm text-neutral-400 mb-8">
                    Estimated Timeline
                </h1>

                {/* Period Switcher - Pill Tabs */}
                <div className="flex flex-wrap gap-4 w-full">
                    {PERIOD_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePeriod(tab.id)}
                            className={cn(
                                "flex-1 min-w-[120px] px-4 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-200 text-center border",
                                activePeriod === tab.id
                                    ? "bg-[#2541B2] text-white border-[#2541B2] shadow-md shadow-blue-900/20"
                                    : "bg-neutral-800/30 text-neutral-500 border-transparent hover:bg-neutral-800/50 hover:text-neutral-400"
                            )}
                        >
                            {/* We use original label (Juz X-Y) here as it makes more sense for the app than years */}
                            {tab.originalLabel}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline Container */}
            <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-20">
                <div className="max-w-4xl">
                    {years.map((year, yearIndex) => (
                        <motion.div
                            key={year}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: yearIndex * 0.05 }}
                            className={cn(
                                "relative flex py-8 border-b last:border-0",
                                SEPARATOR_COLOR
                            )}
                        >
                            {/* Left Column: Year */}
                            <div className="w-24 md:w-32 flex-shrink-0 pr-6 pt-2">
                                <span className={cn("text-5xl font-bold tracking-tight", YEAR_COLOR)}>
                                    {year}
                                </span>
                            </div>

                            {/* The Spine (Vertical Line) */}
                            {/* We position it absolutely to span the full height of the row, connecting seamlessly */}
                            <div className="absolute left-[6rem] md:left-[8rem] top-0 bottom-0 w-[2px] flex justify-center">
                                <div className={cn("w-full h-full", LINE_COLOR)} />
                            </div>

                            {/* Events Column */}
                            <div className="flex-1 pl-12 md:pl-16 space-y-8 pt-4">
                                {milestonesByYear[year].map((event, eventIndex) => (
                                    <div key={`${year}-${eventIndex}`} className="flex items-baseline group">
                                        {/* Dot on Line - Positioned relative to the row container */}
                                        <div
                                            className={cn(
                                                "absolute left-[5.85rem] md:left-[7.85rem] w-3.5 h-3.5 rounded-full border-2 border-[#030303] z-10",
                                                LINE_COLOR // Solid blue dot
                                            )}
                                        />

                                        {/* Date (MM.DD format) */}
                                        <div className="w-16 md:w-20 flex-shrink-0 text-xs font-bold text-neutral-400 pt-0.5">
                                            {format(event.date, "M.dd")}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className={cn(
                                                "text-sm font-medium mb-1",
                                                event.isBreak ? "text-amber-400" : "text-white"
                                            )}>
                                                {event.label}
                                                {event.juz === 30 && " 🏆"}
                                            </div>

                                            <div className="text-[10px] text-neutral-600 leading-relaxed uppercase tracking-wide">
                                                {event.isBreak ? "Break Period" : event.phase}
                                            </div>

                                            {/* Sub-details (optional extra context from the reference style) */}
                                            {/* We can add a fake 'company' or detail line if needed, 
                                                but for now we stick to real data */}
                                            {!event.isBreak && (
                                                <div className="text-[10px] text-neutral-700 mt-0.5">
                                                    {format(event.date, "EEEE")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Empty State */}
                    {filteredMilestones.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-neutral-500 text-sm">No milestones in this period.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
