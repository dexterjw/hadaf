export type QuranStandard = 13 | 15 | 16;

export interface VelocityPhase {
    name: string;
    juzCount: number;
    linesPerDay: number;
}

export interface HolidayBreak {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isAnnual: boolean;
}

export interface StudentData {
    quranStandard: QuranStandard;
    currentJuz: number;
    currentPageInJuz: number;
    avgLinesPerDay: number;
    daysPerWeek: number;
}

export interface AdvancedSettings {
    velocityPhases: VelocityPhase[];
    holidays: HolidayBreak[];
    sickDaysPerYear: number;
}

export const DEFAULT_VELOCITY_PHASES: VelocityPhase[] = [
    { name: "Warm-up", juzCount: 3, linesPerDay: 5 },
    { name: "Flow State", juzCount: 18, linesPerDay: 10 },
    { name: "Acceleration", juzCount: 9, linesPerDay: 15 },
];

export const DEFAULT_HOLIDAYS: HolidayBreak[] = [
    {
        id: "march-break",
        name: "March Break",
        startDate: new Date(new Date().getFullYear(), 2, 10), // March 10
        endDate: new Date(new Date().getFullYear(), 2, 18), // March 18
        isAnnual: true,
    },
    {
        id: "august-break",
        name: "August Break",
        startDate: new Date(new Date().getFullYear(), 7, 20), // August 20
        endDate: new Date(new Date().getFullYear(), 7, 31), // August 31
        isAnnual: true,
    },
    {
        id: "winter-break",
        name: "Winter Break",
        startDate: new Date(new Date().getFullYear(), 11, 20), // December 20
        endDate: new Date(new Date().getFullYear() + 1, 0, 2), // January 2
        isAnnual: true,
    },
];
