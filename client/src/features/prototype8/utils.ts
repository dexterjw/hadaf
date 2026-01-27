import { StudentData, HolidayBreak } from "./types";
import { addDays, format, getMonth, getDate, getYear } from "date-fns";

export const TOTAL_PAGES = 604;
export const PAGES_PER_JUZ = 20;
export const TOTAL_JUZ = 30;
export const SICK_DAYS_PER_YEAR = 10;

export interface ChartDataPoint {
    date: Date;
    dateLabel: string;
    monthYear: string;
    juz: number;
    lines: number;
    phase: string;
    isBreak: boolean;
    breakName?: string;
}

export interface ProjectionResult {
    totalLines: number;
    currentLines: number;
    remainingLines: number;
    daysNeeded: number;
    finishDate: Date;
    progressPercent: number;
    chartData: ChartDataPoint[];
    breakPeriods: { name: string; startDate: Date; endDate: Date }[];
    estimatedMonths: number;
}

/**
 * Check if a date falls within a holiday period
 */
function isHolidayDate(date: Date, holidays: HolidayBreak[]): { isHoliday: boolean; name?: string } {
    const month = getMonth(date);
    const day = getDate(date);
    const year = getYear(date);

    for (const holiday of holidays) {
        // Handle cross-year holidays (like Winter Break Dec-Jan)
        if (holiday.startMonth > holiday.endMonth) {
            // Check if in the start portion (e.g., December)
            if (month === holiday.startMonth && day >= holiday.startDay) {
                return { isHoliday: true, name: holiday.name };
            }
            // Check if in the end portion (e.g., January)
            if (month === holiday.endMonth && day <= holiday.endDay) {
                return { isHoliday: true, name: holiday.name };
            }
        } else {
            // Same year holiday
            if (month === holiday.startMonth && month === holiday.endMonth) {
                if (day >= holiday.startDay && day <= holiday.endDay) {
                    return { isHoliday: true, name: holiday.name };
                }
            } else if (month === holiday.startMonth && day >= holiday.startDay) {
                return { isHoliday: true, name: holiday.name };
            } else if (month === holiday.endMonth && day <= holiday.endDay) {
                return { isHoliday: true, name: holiday.name };
            } else if (month > holiday.startMonth && month < holiday.endMonth) {
                return { isHoliday: true, name: holiday.name };
            }
        }
    }

    return { isHoliday: false };
}

/**
 * Check if day is an active learning day
 */
function isActiveDay(date: Date, daysPerWeek: number): boolean {
    const dayOfWeek = date.getDay();
    if (daysPerWeek >= 7) return true;
    return dayOfWeek >= 1 && dayOfWeek <= daysPerWeek;
}

/**
 * Calculate projection with chart data
 */
export function calculateProjection(
    data: StudentData,
    linesPerDay: number,
    holidays: HolidayBreak[]
): ProjectionResult {
    const totalLines = TOTAL_PAGES * data.quranStandard;
    const linesPerJuz = PAGES_PER_JUZ * data.quranStandard;

    const currentPage = (data.currentJuz - 1) * PAGES_PER_JUZ + data.currentPageInJuz;
    const currentLines = currentPage * data.quranStandard;
    const remainingLines = Math.max(0, totalLines - currentLines);

    if (remainingLines === 0) {
        return {
            totalLines,
            currentLines,
            remainingLines: 0,
            daysNeeded: 0,
            finishDate: new Date(),
            progressPercent: 100,
            chartData: [],
            breakPeriods: [],
            estimatedMonths: 0,
        };
    }

    // Sick day factor
    const sickDayFactor = 1 - (SICK_DAYS_PER_YEAR / 365);

    const chartData: ChartDataPoint[] = [];
    const breakPeriods: { name: string; startDate: Date; endDate: Date }[] = [];

    let currentDate = new Date();
    let linesCompleted = currentLines;
    let dayCount = 0;
    let currentBreak: { name: string; startDate: Date } | null = null;

    const maxDays = 365 * 10;

    // Initial point
    chartData.push({
        date: new Date(currentDate),
        dateLabel: format(currentDate, "MMM d"),
        monthYear: format(currentDate, "MMM yyyy"),
        juz: linesCompleted / linesPerJuz,
        lines: linesCompleted,
        phase: getPhase(linesCompleted / linesPerJuz),
        isBreak: false,
    });

    while (linesCompleted < totalLines && dayCount < maxDays) {
        currentDate = addDays(currentDate, 1);
        dayCount++;

        // Check for holiday
        const holidayCheck = isHolidayDate(currentDate, holidays);

        if (holidayCheck.isHoliday) {
            // Track break periods
            if (!currentBreak || currentBreak.name !== holidayCheck.name) {
                if (currentBreak) {
                    breakPeriods.push({
                        name: currentBreak.name,
                        startDate: currentBreak.startDate,
                        endDate: addDays(currentDate, -1),
                    });
                }
                currentBreak = { name: holidayCheck.name!, startDate: new Date(currentDate) };
            }
            continue;
        } else if (currentBreak) {
            breakPeriods.push({
                name: currentBreak.name,
                startDate: currentBreak.startDate,
                endDate: addDays(currentDate, -1),
            });
            currentBreak = null;
        }

        // Check if active day
        if (!isActiveDay(currentDate, data.daysPerWeek)) {
            continue;
        }

        // Progress
        const effectiveLines = linesPerDay * sickDayFactor;
        linesCompleted = Math.min(totalLines, linesCompleted + effectiveLines);

        // Record data point weekly or at milestones
        const juzCompleted = linesCompleted / linesPerJuz;
        if (dayCount % 7 === 0 || linesCompleted >= totalLines || Math.floor(juzCompleted) !== Math.floor((linesCompleted - effectiveLines) / linesPerJuz)) {
            chartData.push({
                date: new Date(currentDate),
                dateLabel: format(currentDate, "MMM d"),
                monthYear: format(currentDate, "MMM yyyy"),
                juz: Math.round(juzCompleted * 10) / 10,
                lines: Math.round(linesCompleted),
                phase: getPhase(juzCompleted),
                isBreak: false,
            });
        }
    }

    return {
        totalLines,
        currentLines,
        remainingLines,
        daysNeeded: dayCount,
        finishDate: currentDate,
        progressPercent: Math.round((currentLines / totalLines) * 100),
        chartData,
        breakPeriods,
        estimatedMonths: Math.ceil(dayCount / 30),
    };
}

function getPhase(juzCompleted: number): string {
    if (juzCompleted < 3) return "Warm-up";
    if (juzCompleted < 21) return "Flow State";
    return "Acceleration";
}

/**
 * Format month labels for chart x-axis
 */
export function formatChartXAxis(data: ChartDataPoint[]): { tick: string; showYear: boolean }[] {
    const result: { tick: string; showYear: boolean }[] = [];
    let lastYear = "";

    for (const point of data) {
        const month = format(point.date, "MMM");
        const year = format(point.date, "yyyy");
        const showYear = year !== lastYear;
        lastYear = year;
        result.push({ tick: month, showYear });
    }

    return result;
}
