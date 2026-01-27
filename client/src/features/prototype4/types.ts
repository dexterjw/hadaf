export type QuranStandard = 13 | 15 | 16;

export interface StudentData {
    quranStandard: QuranStandard;
    currentJuz: number;
    currentPageInJuz: number;
    avgLinesPerDay: number;
    daysPerWeek: 4 | 5 | 6 | 7;
}

export interface VelocityPhase {
    name: string;
    durationPercent: number; // Percentage of remaining lines (e.g., 10, 60, 30)
    intensityPercent: number; // Percentage of base pace (e.g., 80, 100, 115)
}

export interface VelocityMatrix {
    warmup: VelocityPhase;
    flow: VelocityPhase;
    acceleration: VelocityPhase;
}

export const DEFAULT_VELOCITY_MATRIX: VelocityMatrix = {
    warmup: {
        name: "Warm-up",
        durationPercent: 10,
        intensityPercent: 80,
    },
    flow: {
        name: "Flow State",
        durationPercent: 60,
        intensityPercent: 100,
    },
    acceleration: {
        name: "Acceleration",
        durationPercent: 30, // Auto-calculated as remainder
        intensityPercent: 115,
    },
};

export interface HolidayPeriod {
    name: string;
    startMonth: number; // 0-indexed
    startDay: number;
    endMonth: number;
    endDay: number;
}

export const HOLIDAY_PERIODS: HolidayPeriod[] = [
    { name: "March Break", startMonth: 2, startDay: 10, endMonth: 2, endDay: 18 },
    { name: "August Break", startMonth: 7, startDay: 20, endMonth: 7, endDay: 31 },
    { name: "Winter Break", startMonth: 11, startDay: 20, endMonth: 0, endDay: 2 }, // Crosses year boundary
];

export interface ChartDataPoint {
    date: Date;
    dateLabel: string;
    juzCompleted: number;
    linesCompleted: number;
    isHoliday: boolean;
    holidayName?: string;
}

export interface HolidayRange {
    name: string;
    startMonth: string; // "MMM yyyy" format for chart x-axis
    endMonth: string;   // "MMM yyyy" format for chart x-axis
}

export interface ProjectionResult {
    totalLines: number;
    currentLines: number;
    remainingLines: number;
    daysNeeded: number;
    activeDaysNeeded: number;
    finishDate: Date;
    progressPercent: number;
    chartData: ChartDataPoint[];
    holidayRanges: HolidayRange[]; // Pre-calculated holiday ranges for chart
    phaseBreakdown: {
        warmupDays: number;
        flowDays: number;
        accelerationDays: number;
    };
}
