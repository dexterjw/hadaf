import { StudentData } from "./types";

export const TOTAL_PAGES = 604;
export const PAGES_PER_JUZ = 20;
export const RETENTION_BUFFER = 0.15;

export interface ProjectionResult {
    totalLines: number;
    currentLines: number;
    remainingLines: number;
    daysNeeded: number;
    finishDate: Date;
    progressPercent: number;
}

export function calculateProjection(data: StudentData, adjustedPace: number): ProjectionResult {
    const totalLines = TOTAL_PAGES * data.quranStandard;
    const currentPage = (data.currentJuz - 1) * PAGES_PER_JUZ + data.currentPageInJuz;
    const currentLines = currentPage * data.quranStandard;
    const remainingLines = totalLines - currentLines;

    const effectiveLinesPerWeek = adjustedPace * data.daysPerWeek;
    const weeksNeeded = remainingLines / effectiveLinesPerWeek;
    const bufferedWeeks = weeksNeeded * (1 + RETENTION_BUFFER);
    const daysNeeded = Math.ceil(bufferedWeeks * 7);

    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + daysNeeded);

    return {
        totalLines,
        currentLines,
        remainingLines,
        daysNeeded,
        finishDate,
        progressPercent: Math.round((currentLines / totalLines) * 100),
    };
}
