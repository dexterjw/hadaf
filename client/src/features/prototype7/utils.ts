import { StudentData, AdvancedSettings, VelocityPhase, HolidayBreak } from "./types";
import { addDays, isWithinInterval, eachDayOfInterval, getYear, setYear } from "date-fns";

export const TOTAL_PAGES = 604;
export const PAGES_PER_JUZ = 20;
export const TOTAL_JUZ = 30;

export interface ProgressPoint {
    date: Date;
    juzCompleted: number;
    linesCompleted: number;
    phase: string;
    isBreak?: boolean;
    breakName?: string;
}

export interface ProjectionResult {
    totalLines: number;
    currentLines: number;
    remainingLines: number;
    remainingJuz: number;
    daysNeeded: number;
    activeDaysNeeded: number;
    finishDate: Date;
    progressPercent: number;
    progressPoints: ProgressPoint[];
    totalBreakDays: number;
    totalSickDays: number;
}

/**
 * Gets all break dates within a given date range, handling annual recurrence
 */
function getBreakDatesInRange(
    holidays: HolidayBreak[],
    startDate: Date,
    endDate: Date
): { date: Date; breakName: string }[] {
    const breakDates: { date: Date; breakName: string }[] = [];
    const startYear = getYear(startDate);
    const endYear = getYear(endDate);

    for (const holiday of holidays) {
        if (holiday.isAnnual) {
            // For annual holidays, check each year in the range
            for (let year = startYear; year <= endYear; year++) {
                const adjustedStart = setYear(holiday.startDate, year);
                let adjustedEnd = setYear(holiday.endDate, year);
                
                // Handle cross-year breaks (like Winter Break Dec-Jan)
                if (adjustedEnd < adjustedStart) {
                    adjustedEnd = setYear(holiday.endDate, year + 1);
                }

                // Get all days in this break period that fall within our range
                if (adjustedStart <= endDate && adjustedEnd >= startDate) {
                    const effectiveStart = adjustedStart > startDate ? adjustedStart : startDate;
                    const effectiveEnd = adjustedEnd < endDate ? adjustedEnd : endDate;
                    
                    const daysInBreak = eachDayOfInterval({ start: effectiveStart, end: effectiveEnd });
                    daysInBreak.forEach(d => {
                        breakDates.push({ date: d, breakName: holiday.name });
                    });
                }
            }
        } else {
            // One-time holiday
            if (holiday.startDate <= endDate && holiday.endDate >= startDate) {
                const effectiveStart = holiday.startDate > startDate ? holiday.startDate : startDate;
                const effectiveEnd = holiday.endDate < endDate ? holiday.endDate : endDate;
                
                const daysInBreak = eachDayOfInterval({ start: effectiveStart, end: effectiveEnd });
                daysInBreak.forEach(d => {
                    breakDates.push({ date: d, breakName: holiday.name });
                });
            }
        }
    }

    return breakDates;
}

/**
 * Checks if a given date is a break day
 */
function isBreakDay(
    date: Date,
    holidays: HolidayBreak[]
): { isBreak: boolean; breakName?: string } {
    const year = getYear(date);
    
    for (const holiday of holidays) {
        let checkStart = holiday.startDate;
        let checkEnd = holiday.endDate;
        
        if (holiday.isAnnual) {
            checkStart = setYear(holiday.startDate, year);
            checkEnd = setYear(holiday.endDate, year);
            
            // Handle cross-year breaks
            if (checkEnd < checkStart) {
                // Check current year's end portion (Jan portion)
                const prevYearStart = setYear(holiday.startDate, year - 1);
                const prevYearEnd = setYear(holiday.endDate, year);
                if (date >= prevYearStart || date <= prevYearEnd) {
                    if (isWithinInterval(date, { start: prevYearStart, end: prevYearEnd })) {
                        return { isBreak: true, breakName: holiday.name };
                    }
                }
                
                // Check current year's start portion (Dec portion)
                checkEnd = setYear(holiday.endDate, year + 1);
            }
        }
        
        try {
            if (isWithinInterval(date, { start: checkStart, end: checkEnd })) {
                return { isBreak: true, breakName: holiday.name };
            }
        } catch {
            // Invalid interval, skip
        }
    }
    
    return { isBreak: false };
}

/**
 * Checks if a day is an active learning day (based on days per week)
 */
function isActiveDay(date: Date, daysPerWeek: number): boolean {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Assume active days are Monday through (Monday + daysPerWeek - 1)
    // For 5 days: Mon-Fri (1-5)
    // For 6 days: Mon-Sat (1-6)
    // For 7 days: All days
    // For 4 days: Mon-Thu (1-4)
    
    if (daysPerWeek >= 7) return true;
    
    // Active days: 1 (Mon) to daysPerWeek
    return dayOfWeek >= 1 && dayOfWeek <= daysPerWeek;
}

/**
 * Calculate projection with velocity phases, holidays, and sick days
 */
export function calculateProjection(
    data: StudentData,
    adjustedPace: number,
    settings: AdvancedSettings
): ProjectionResult {
    const totalLines = TOTAL_PAGES * data.quranStandard;
    const linesPerJuz = PAGES_PER_JUZ * data.quranStandard;
    
    const currentPage = (data.currentJuz - 1) * PAGES_PER_JUZ + data.currentPageInJuz;
    const currentLines = currentPage * data.quranStandard;
    const remainingLines = Math.max(0, totalLines - currentLines);
    const remainingJuz = TOTAL_JUZ - data.currentJuz + 1 - (data.currentPageInJuz - 1) / PAGES_PER_JUZ;
    
    if (remainingLines === 0) {
        return {
            totalLines,
            currentLines,
            remainingLines: 0,
            remainingJuz: 0,
            daysNeeded: 0,
            activeDaysNeeded: 0,
            finishDate: new Date(),
            progressPercent: 100,
            progressPoints: [],
            totalBreakDays: 0,
            totalSickDays: 0,
        };
    }

    // Calculate lines per phase based on remaining juz allocation
    const phaseLinesAllocation = allocatePhasesToRemaining(
        settings.velocityPhases,
        data.currentJuz,
        linesPerJuz
    );

    // Simulate day by day
    const progressPoints: ProgressPoint[] = [];
    let currentDate = new Date();
    let linesCompleted = currentLines;
    let activeDaysCount = 0;
    let totalBreakDays = 0;
    let phaseIndex = 0;
    let linesInCurrentPhase = 0;
    
    // Calculate sick days per day factor (distributed evenly)
    const sickDayFactor = 1 - (settings.sickDaysPerYear / 365);
    
    // Initial point
    progressPoints.push({
        date: new Date(currentDate),
        juzCompleted: linesCompleted / linesPerJuz,
        linesCompleted,
        phase: phaseLinesAllocation[phaseIndex]?.phaseName || "Flow",
    });

    const maxDays = 365 * 10; // Safety limit: 10 years
    let dayCount = 0;

    while (linesCompleted < totalLines && dayCount < maxDays) {
        currentDate = addDays(currentDate, 1);
        dayCount++;
        
        // Check if it's a break day
        const breakCheck = isBreakDay(currentDate, settings.holidays);
        if (breakCheck.isBreak) {
            totalBreakDays++;
            progressPoints.push({
                date: new Date(currentDate),
                juzCompleted: linesCompleted / linesPerJuz,
                linesCompleted,
                phase: phaseLinesAllocation[phaseIndex]?.phaseName || "Flow",
                isBreak: true,
                breakName: breakCheck.breakName,
            });
            continue;
        }
        
        // Check if it's an active day based on days per week
        if (!isActiveDay(currentDate, data.daysPerWeek)) {
            continue;
        }
        
        // Apply sick day factor (reduce effective progress)
        const currentPhase = phaseLinesAllocation[phaseIndex];
        const phasePace = currentPhase ? currentPhase.linesPerDay : adjustedPace;
        const effectiveLinesPerDay = phasePace * sickDayFactor;
        
        // Add lines for this day
        linesCompleted = Math.min(totalLines, linesCompleted + effectiveLinesPerDay);
        linesInCurrentPhase += effectiveLinesPerDay;
        activeDaysCount++;
        
        // Check if we've completed the current phase
        if (currentPhase && linesInCurrentPhase >= currentPhase.totalLines) {
            linesInCurrentPhase = 0;
            phaseIndex++;
        }
        
        // Record progress point (sample every 7 days or at the end)
        if (dayCount % 7 === 0 || linesCompleted >= totalLines) {
            progressPoints.push({
                date: new Date(currentDate),
                juzCompleted: linesCompleted / linesPerJuz,
                linesCompleted,
                phase: phaseLinesAllocation[phaseIndex]?.phaseName || 
                       phaseLinesAllocation[phaseLinesAllocation.length - 1]?.phaseName || "Flow",
            });
        }
    }

    // Estimate sick days based on total duration
    const yearsSpan = dayCount / 365;
    const totalSickDays = Math.round(settings.sickDaysPerYear * yearsSpan);

    return {
        totalLines,
        currentLines,
        remainingLines,
        remainingJuz,
        daysNeeded: dayCount,
        activeDaysNeeded: activeDaysCount,
        finishDate: currentDate,
        progressPercent: Math.round((currentLines / totalLines) * 100),
        progressPoints,
        totalBreakDays,
        totalSickDays,
    };
}

interface PhaseAllocation {
    phaseName: string;
    totalLines: number;
    linesPerDay: number;
}

/**
 * Allocate phases to remaining juz based on velocity settings
 */
function allocatePhasesToRemaining(
    phases: VelocityPhase[],
    currentJuz: number,
    linesPerJuz: number
): PhaseAllocation[] {
    const allocations: PhaseAllocation[] = [];
    let juzAccountedFor = 0;
    
    for (const phase of phases) {
        // Calculate which juz this phase covers
        const phaseStartJuz = juzAccountedFor + 1;
        const phaseEndJuz = juzAccountedFor + phase.juzCount;
        juzAccountedFor += phase.juzCount;
        
        // Skip phases that are already completed
        if (phaseEndJuz < currentJuz) {
            continue;
        }
        
        // Calculate how many juz remain in this phase
        let juzInThisPhase = phase.juzCount;
        if (phaseStartJuz < currentJuz) {
            juzInThisPhase = phaseEndJuz - currentJuz + 1;
        }
        
        if (juzInThisPhase > 0) {
            allocations.push({
                phaseName: phase.name,
                totalLines: juzInThisPhase * linesPerJuz,
                linesPerDay: phase.linesPerDay,
            });
        }
    }
    
    return allocations;
}

/**
 * Simple calculation without phases (for pace slider simulation)
 */
export function calculateSimpleProjection(
    data: StudentData,
    linesPerDay: number,
    settings: AdvancedSettings
): ProjectionResult {
    // Create a simple single-phase setting
    const simpleSettings: AdvancedSettings = {
        ...settings,
        velocityPhases: [
            { name: "Constant", juzCount: 30, linesPerDay },
        ],
    };
    
    return calculateProjection(data, linesPerDay, simpleSettings);
}

/**
 * Validate that velocity phases sum to 30 juz
 */
export function validatePhases(phases: VelocityPhase[]): {
    valid: boolean;
    totalJuz: number;
    message?: string;
} {
    const totalJuz = phases.reduce((sum, p) => sum + p.juzCount, 0);
    
    if (totalJuz !== 30) {
        return {
            valid: false,
            totalJuz,
            message: `Total Juz must equal 30 (currently ${totalJuz})`,
        };
    }
    
    // Check that intensity increases with phases
    for (let i = 1; i < phases.length; i++) {
        if (phases[i].linesPerDay < phases[i - 1].linesPerDay) {
            return {
                valid: true, // Warning but still valid
                totalJuz,
                message: `Note: ${phases[i].name} has lower intensity than ${phases[i - 1].name}`,
            };
        }
    }
    
    return { valid: true, totalJuz };
}
