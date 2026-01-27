import { 
    StudentData, 
    VelocityMatrix, 
    DEFAULT_VELOCITY_MATRIX, 
    HOLIDAY_PERIODS, 
    ChartDataPoint, 
    ProjectionResult,
    HolidayPeriod,
    HolidayRange
} from "./types";
import { format, addDays, isWithinInterval, startOfDay, isSameDay } from "date-fns";

export const TOTAL_PAGES = 604;
export const PAGES_PER_JUZ = 20;
export const SICK_DAYS_PER_YEAR = 10;

/**
 * Check if a date falls within a holiday period
 */
function isHolidayDate(date: Date, holidays: HolidayPeriod[]): { isHoliday: boolean; holidayName?: string } {
    const month = date.getMonth();
    const day = date.getDate();
    
    for (const holiday of holidays) {
        // Handle year-boundary holidays (like Winter Break Dec 20 - Jan 2)
        if (holiday.endMonth < holiday.startMonth) {
            // Crosses year boundary
            if (
                (month === holiday.startMonth && day >= holiday.startDay) ||
                (month > holiday.startMonth) ||
                (month < holiday.endMonth) ||
                (month === holiday.endMonth && day <= holiday.endDay)
            ) {
                return { isHoliday: true, holidayName: holiday.name };
            }
        } else {
            // Normal case - same year
            if (
                (month > holiday.startMonth || (month === holiday.startMonth && day >= holiday.startDay)) &&
                (month < holiday.endMonth || (month === holiday.endMonth && day <= holiday.endDay))
            ) {
                return { isHoliday: true, holidayName: holiday.name };
            }
        }
    }
    
    return { isHoliday: false };
}

/**
 * Check if a day is an active study day (based on days per week)
 * Assuming study days are consecutive starting from Saturday (day 6)
 * 4 days = Sat, Sun, Mon, Tue
 * 5 days = Sat, Sun, Mon, Tue, Wed
 * 6 days = Sat, Sun, Mon, Tue, Wed, Thu
 * 7 days = All days
 */
function isActiveDay(date: Date, daysPerWeek: number): boolean {
    if (daysPerWeek === 7) return true;
    
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Map days per week to active days
    // Let's assume weekdays starting Monday are primary, weekend as off first
    // 4 days = Mon-Thu
    // 5 days = Mon-Fri
    // 6 days = Mon-Sat
    // 7 days = All
    
    const activeDays: { [key: number]: number[] } = {
        4: [1, 2, 3, 4],           // Mon, Tue, Wed, Thu
        5: [1, 2, 3, 4, 5],        // Mon-Fri
        6: [1, 2, 3, 4, 5, 6],     // Mon-Sat
        7: [0, 1, 2, 3, 4, 5, 6],  // All days
    };
    
    return activeDays[daysPerWeek]?.includes(dayOfWeek) ?? true;
}

/**
 * Calculate the number of holidays between two dates
 */
function countHolidayDays(startDate: Date, endDate: Date): number {
    let count = 0;
    let current = new Date(startDate);
    
    while (current <= endDate) {
        if (isHolidayDate(current, HOLIDAY_PERIODS).isHoliday) {
            count++;
        }
        current = addDays(current, 1);
    }
    
    return count;
}

/**
 * Calculate the sick day buffer based on projection duration
 */
function calculateSickDayBuffer(totalDays: number): number {
    // 10 sick days per year, prorated
    const years = totalDays / 365;
    return Math.ceil(years * SICK_DAYS_PER_YEAR);
}

/**
 * Calculate holiday ranges that fall within the projection period
 * Returns ranges with month labels for chart x-axis alignment
 */
function calculateHolidayRanges(startDate: Date, endDate: Date): HolidayRange[] {
    const ranges: HolidayRange[] = [];
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    // Start at startYear - 1 to catch year-crossing holidays (e.g., Winter Break Dec 20 - Jan 2)
    // that began in the previous year but extend into the projection period
    for (let year = startYear - 1; year <= endYear; year++) {
        for (const holiday of HOLIDAY_PERIODS) {
            let holidayStart: Date;
            let holidayEnd: Date;
            
            if (holiday.endMonth < holiday.startMonth) {
                // Crosses year boundary (e.g., Dec 20 - Jan 2)
                // This holiday spans from year to year+1
                holidayStart = new Date(year, holiday.startMonth, holiday.startDay);
                holidayEnd = new Date(year + 1, holiday.endMonth, holiday.endDay);
            } else {
                // Normal case - same year
                holidayStart = new Date(year, holiday.startMonth, holiday.startDay);
                holidayEnd = new Date(year, holiday.endMonth, holiday.endDay);
            }
            
            // Check if this holiday overlaps with the projection period
            if (holidayEnd >= startDate && holidayStart <= endDate) {
                // Clamp to projection bounds
                const effectiveStart = holidayStart < startDate ? startDate : holidayStart;
                const effectiveEnd = holidayEnd > endDate ? endDate : holidayEnd;
                
                ranges.push({
                    name: holiday.name,
                    startMonth: format(effectiveStart, "MMM yyyy"),
                    endMonth: format(effectiveEnd, "MMM yyyy"),
                });
            }
        }
    }
    
    return ranges;
}

/**
 * Main projection calculation with velocity matrix and calendar awareness
 */
export function calculateProjection(
    data: StudentData, 
    adjustedPace: number,
    velocityMatrix: VelocityMatrix = DEFAULT_VELOCITY_MATRIX
): ProjectionResult {
    // Basic line calculations
    const totalLines = TOTAL_PAGES * data.quranStandard;
    const currentPage = (data.currentJuz - 1) * PAGES_PER_JUZ + data.currentPageInJuz;
    const currentLines = currentPage * data.quranStandard;
    const remainingLines = Math.max(0, totalLines - currentLines);
    
    // Calculate lines for each phase
    const warmupLines = remainingLines * (velocityMatrix.warmup.durationPercent / 100);
    const flowLines = remainingLines * (velocityMatrix.flow.durationPercent / 100);
    const accelerationLines = remainingLines * (velocityMatrix.acceleration.durationPercent / 100);
    
    // Calculate effective daily pace for each phase
    const warmupPace = adjustedPace * (velocityMatrix.warmup.intensityPercent / 100);
    const flowPace = adjustedPace * (velocityMatrix.flow.intensityPercent / 100);
    const accelerationPace = adjustedPace * (velocityMatrix.acceleration.intensityPercent / 100);
    
    // Calculate active days needed for each phase (before holidays/sick days)
    const warmupActiveDays = warmupPace > 0 ? Math.ceil(warmupLines / warmupPace) : 0;
    const flowActiveDays = flowPace > 0 ? Math.ceil(flowLines / flowPace) : 0;
    const accelerationActiveDays = accelerationPace > 0 ? Math.ceil(accelerationLines / accelerationPace) : 0;
    
    const totalActiveDaysNeeded = warmupActiveDays + flowActiveDays + accelerationActiveDays;
    
    // Now simulate the calendar to find the actual end date
    const startDate = startOfDay(new Date());
    const chartData: ChartDataPoint[] = [];
    
    let currentDate = new Date(startDate);
    let activeDaysUsed = 0;
    let linesCompleted = currentLines;
    let currentPhase: "warmup" | "flow" | "acceleration" = "warmup";
    let phaseDaysUsed = 0;
    
    // Determine phase boundaries in active days
    const warmupEndDay = warmupActiveDays;
    const flowEndDay = warmupActiveDays + flowActiveDays;
    
    // Add starting point
    chartData.push({
        date: new Date(currentDate),
        dateLabel: format(currentDate, "MMM yyyy"),
        juzCompleted: Math.floor(linesCompleted / (PAGES_PER_JUZ * data.quranStandard)),
        linesCompleted,
        isHoliday: false,
    });
    
    // Track last month for monthly chart points
    let lastChartMonth = currentDate.getMonth();
    
    while (activeDaysUsed < totalActiveDaysNeeded && linesCompleted < totalLines) {
        currentDate = addDays(currentDate, 1);
        
        const holidayCheck = isHolidayDate(currentDate, HOLIDAY_PERIODS);
        const isActive = isActiveDay(currentDate, data.daysPerWeek);
        
        // Check if we should add a chart point (monthly or holiday boundary)
        const currentMonth = currentDate.getMonth();
        
        if (!holidayCheck.isHoliday && isActive) {
            // This is an active study day
            activeDaysUsed++;
            phaseDaysUsed++;
            
            // Determine current phase and pace
            let currentPace: number;
            if (activeDaysUsed <= warmupEndDay) {
                currentPhase = "warmup";
                currentPace = warmupPace;
            } else if (activeDaysUsed <= flowEndDay) {
                currentPhase = "flow";
                currentPace = flowPace;
            } else {
                currentPhase = "acceleration";
                currentPace = accelerationPace;
            }
            
            linesCompleted = Math.min(totalLines, linesCompleted + currentPace);
        }
        
        // Add monthly chart points
        if (currentMonth !== lastChartMonth) {
            chartData.push({
                date: new Date(currentDate),
                dateLabel: format(currentDate, "MMM yyyy"),
                juzCompleted: Math.floor(linesCompleted / (PAGES_PER_JUZ * data.quranStandard)),
                linesCompleted,
                isHoliday: holidayCheck.isHoliday,
                holidayName: holidayCheck.holidayName,
            });
            lastChartMonth = currentMonth;
        }
    }
    
    // Add sick day buffer
    const sickDayBuffer = calculateSickDayBuffer((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Add buffer days to final date
    // Buffer days must be both non-holiday AND active study days (respecting daysPerWeek)
    let finalDate = currentDate;
    let bufferDaysAdded = 0;
    while (bufferDaysAdded < sickDayBuffer) {
        finalDate = addDays(finalDate, 1);
        const holidayCheck = isHolidayDate(finalDate, HOLIDAY_PERIODS);
        const isActive = isActiveDay(finalDate, data.daysPerWeek);
        if (!holidayCheck.isHoliday && isActive) {
            bufferDaysAdded++;
        }
    }
    
    // Add final point
    chartData.push({
        date: new Date(finalDate),
        dateLabel: format(finalDate, "MMM yyyy"),
        juzCompleted: 30,
        linesCompleted: totalLines,
        isHoliday: false,
    });
    
    const totalDaysNeeded = Math.ceil((finalDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate holiday ranges for chart visualization
    const holidayRanges = calculateHolidayRanges(startDate, finalDate);
    
    return {
        totalLines,
        currentLines,
        remainingLines,
        daysNeeded: totalDaysNeeded,
        activeDaysNeeded: totalActiveDaysNeeded,
        finishDate: finalDate,
        progressPercent: Math.round((currentLines / totalLines) * 100),
        chartData,
        holidayRanges,
        phaseBreakdown: {
            warmupDays: warmupActiveDays,
            flowDays: flowActiveDays,
            accelerationDays: accelerationActiveDays,
        },
    };
}

/**
 * Calculate delta in months between two dates
 */
export function getMonthsDelta(date1: Date, date2: Date): number {
    const diffTime = date1.getTime() - date2.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.round(diffDays / 30);
}

/**
 * Get burnout risk level based on lines per day
 */
export function getBurnoutRisk(linesPerDay: number): "low" | "medium" | "high" | "extreme" {
    if (linesPerDay <= 10) return "low";
    if (linesPerDay <= 20) return "medium";
    if (linesPerDay <= 25) return "high";
    return "extreme";
}

/**
 * Get slider gradient color stops
 */
export function getSliderGradient(): string {
    return "linear-gradient(to right, #10b981 0%, #10b981 22%, #f59e0b 44%, #f59e0b 55%, #ef4444 78%, #ef4444 100%)";
}
