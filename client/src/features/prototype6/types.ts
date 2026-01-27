export type QuranStandard = 13 | 15 | 16;

export interface StudentData {
    quranStandard: QuranStandard;
    currentJuz: number;
    currentPageInJuz: number;
    avgLinesPerDay: number;
    daysPerWeek: number;
}
