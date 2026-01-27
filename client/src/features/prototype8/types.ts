export type QuranStandard = 13 | 15 | 16;

export interface HolidayBreak {
    id: string;
    name: string;
    startMonth: number; // 0-11
    startDay: number;
    endMonth: number;
    endDay: number;
    isAnnual: boolean;
}

export interface StudentData {
    quranStandard: QuranStandard;
    currentJuz: number;
    currentPageInJuz: number;
    avgLinesPerDay: number;
    daysPerWeek: number;
}

export const DEFAULT_HOLIDAYS: HolidayBreak[] = [
    {
        id: "march-break",
        name: "March Break",
        startMonth: 2,
        startDay: 10,
        endMonth: 2,
        endDay: 18,
        isAnnual: true,
    },
    {
        id: "august-break",
        name: "Summer Break",
        startMonth: 7,
        startDay: 20,
        endMonth: 7,
        endDay: 31,
        isAnnual: true,
    },
    {
        id: "winter-break",
        name: "Winter Break",
        startMonth: 11,
        startDay: 20,
        endMonth: 0,
        endDay: 2,
        isAnnual: true,
    },
];
