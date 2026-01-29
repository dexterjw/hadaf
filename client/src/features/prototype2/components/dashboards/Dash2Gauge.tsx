import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import { Card } from '@/components/ui/card';
import { Circle, TrendingUp, BookOpen, Flame, Calendar, Award, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface Dash2GaugeProps {
    settings: UserSettings;
    stats: CompletionData;
}

const data = [
    { name: 'Mon', pages: 4 },
    { name: 'Tue', pages: 3 },
    { name: 'Wed', pages: 5 },
    { name: 'Thu', pages: 2 },
    { name: 'Fri', pages: 6 },
    { name: 'Sat', pages: 8 },
    { name: 'Sun', pages: 5 },
];

const Dash2Gauge: React.FC<Dash2GaugeProps> = ({ settings, stats }) => {
    return (
        <div className="space-y-6 h-full overflow-y-auto pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Daily Goal</p>
                            <h3 className="text-2xl font-bold mt-2">0/{settings.dailyGoalPages}</h3>
                        </div>
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-500">
                            <BookOpen size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <span className="text-indigo-400 font-medium mr-1">0%</span> completed today
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                            <h3 className="text-2xl font-bold mt-2">12 Days</h3>
                        </div>
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                            <Flame size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        Keep the fire burning!
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Progress</p>
                            <h3 className="text-2xl font-bold mt-2">{stats.progressPercentage.toFixed(1)}%</h3>
                        </div>
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <span className="text-emerald-400 font-medium mr-1">Juz {stats.juzCompleted + 1}</span> in progress
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Days Left</p>
                            <h3 className="text-2xl font-bold mt-2">{stats.daysRemaining}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        Estimated finish: {stats.estimatedCompletionDate.toLocaleDateString()}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-border/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-lg">Weekly Activity</h3>
                        <select className="bg-transparent text-sm border-none outline-none text-muted-foreground cursor-pointer">
                            <option>This Week</option>
                            <option>Last Week</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPages" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                                <Area type="monotone" dataKey="pages" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPages)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-pink-500/5 to-rose-500/5 border-pink-500/10">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Award className="text-pink-500" size={20} />
                            Next Milestone
                        </h3>
                        <div className="space-y-4">
                            <div className="relative pt-2">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Complete Juz {stats.juzCompleted + 1}</span>
                                    <span className="text-muted-foreground">85%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You are only 3 pages away from completing Juz {stats.juzCompleted + 1}. Keep up the great work!
                            </p>
                            <button className="w-full py-2 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 rounded-lg text-sm font-medium transition-colors">
                                View Details
                            </button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="text-sm font-medium">Log Reading</span>
                                </div>
                                <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <TrendingUp size={16} />
                                    </div>
                                    <span className="text-sm font-medium">View Analytics</span>
                                </div>
                                <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Stacked Attendance Plot - Dark & Light Variants */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <StackedAttendancePlot isDark={true} />
                <StackedAttendancePlot isDark={false} />
            </div>
        </div>
    );
};

export default Dash2Gauge;

// ========================================
// STACKED DOT PLOT COMPONENT
// ========================================

type Grade = 'A' | 'B' | 'C' | 'D';
type Status = 'Present' | 'Absent';

interface DayData {
    dayName: string;
    date: string;
    grade?: Grade;
    status: Status;
}

interface WeekData {
    weekLabel: string;
    days: DayData[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const GRADES: Grade[] = ['A', 'B', 'C', 'D'];

// Dark Theme Colors
const getDarkColor = (grade?: Grade) => {
    switch (grade) {
        case 'A': return 'bg-[#A5D8BD]';
        case 'B': return 'bg-[#BCA3D8]';
        case 'C': return 'bg-[#D4BFA3]';
        case 'D': return 'bg-slate-500';
        default: return 'bg-transparent';
    }
};

// Light Theme Colors
const getLightColor = (grade?: Grade) => {
    switch (grade) {
        case 'A': return 'bg-emerald-400';
        case 'B': return 'bg-violet-400';
        case 'C': return 'bg-amber-400';
        case 'D': return 'bg-slate-400';
        default: return 'bg-transparent';
    }
};

const generateStackedData = (weeks: number): WeekData[] => {
    return Array.from({ length: weeks }, (_, weekIndex) => {
        const weekStart = new Date(2025, 0, 1 + weekIndex * 7);
        const daysData: DayData[] = DAYS.map((dayName, dayIndex) => {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + dayIndex);
            const isPresent = Math.random() > 0.15;
            return {
                dayName,
                date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                grade: isPresent ? GRADES[Math.floor(Math.random() * GRADES.length)] : undefined,
                status: isPresent ? 'Present' : 'Absent',
            };
        });
        return {
            weekLabel: `W${weekIndex + 1}`,
            days: daysData,
        };
    });
};

interface DotProps {
    day: DayData;
    delay: number;
    isDark: boolean;
}

const StackedDot: React.FC<DotProps> = ({ day, delay, isDark }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (day.status === 'Absent') {
        return (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
                className="w-5 h-5 rounded-full bg-white/5"
            />
        );
    }

    return (
        <div className="relative group/dot z-0 hover:z-50 leading-none flex items-center justify-center">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay }}
                className={cn(
                    "w-5 h-5 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110 relative z-10",
                    isDark ? getDarkColor(day.grade) : getLightColor(day.grade)
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none"
                        style={{ width: 'max-content' }}
                    >
                        <div className="bg-gray-900/95 backdrop-blur-md text-xs text-white p-3 rounded-xl border border-gray-700/50 shadow-2xl z-50">
                            <div className="font-semibold mb-1.5 text-gray-200">
                                {day.dayName}, {day.date}
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 font-medium">Performance</span>
                                <span className={cn(
                                    "font-bold px-2 py-0.5 rounded text-[10px] tracking-wide shadow-sm",
                                    day.grade === 'A' && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                                    day.grade === 'B' && "bg-violet-500/20 text-violet-400 border border-violet-500/30",
                                    day.grade === 'C' && "bg-orange-500/20 text-orange-400 border border-orange-500/30",
                                    day.grade === 'D' && "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                                )}>
                                    Grade {day.grade}
                                </span>
                            </div>
                        </div>
                        <div className="w-2.5 h-2.5 bg-gray-900 border-r border-b border-gray-700/50 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5 shadow-sm" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface StackedPlotProps {
    isDark?: boolean;
}

export const StackedAttendancePlot: React.FC<StackedPlotProps> = ({ isDark = true }) => {
    const data = useMemo(() => generateStackedData(20), []);

    return (
        <Card className={cn(
            "p-6 border overflow-hidden",
            isDark ? "bg-gray-950/50 border-gray-800/50" : "bg-white border-gray-200"
        )}>
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className={cn(
                            "text-2xl font-bold",
                            isDark ? "text-white" : "text-gray-900"
                        )}>
                            Student's Attendance
                        </h2>
                        <p className={cn(
                            "text-sm mt-1 font-medium",
                            isDark ? "text-gray-400" : "text-gray-600"
                        )}>
                            Stacked performance by grade
                        </p>
                    </div>

                    <div className={cn(
                        "flex gap-4 text-[10px] font-medium p-2 rounded-lg border",
                        isDark ? "bg-white/5 border-white/5" : "bg-gray-100 border-gray-200"
                    )}>
                        {GRADES.map(g => (
                            <div key={g} className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full",
                                    isDark ? getDarkColor(g).split(' ')[0] : getLightColor(g).split(' ')[0]
                                )} />
                                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                                    Grade {g}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative pt-4 pb-2 flex justify-center">
                    <div className="flex gap-0 overflow-x-auto pb-6 custom-scrollbar mask-gradient-right">
                        {data.map((week, weekIndex) => {
                            const sortedDays = [...week.days].sort((a, b) => {
                                if (a.status === 'Absent' && b.status !== 'Absent') return -1;
                                if (a.status !== 'Absent' && b.status === 'Absent') return 1;
                                if (a.status === 'Absent' && b.status === 'Absent') return 0;

                                const gradeWeight = { 'D': 0, 'C': 1, 'B': 2, 'A': 3 };
                                const gA = a.grade ? gradeWeight[a.grade] : 4;
                                const gB = b.grade ? gradeWeight[b.grade] : 4;
                                return gA - gB;
                            });

                            return (
                                <div key={week.weekLabel} className="flex flex-col min-w-[20px] group/col">
                                    <div className="flex flex-col gap-0 items-center">
                                        {sortedDays.map((day, dayIndex) => (
                                            <StackedDot
                                                key={`${weekIndex}-${day.date}`}
                                                day={day}
                                                delay={weekIndex * 0.03 + dayIndex * 0.015}
                                                isDark={isDark}
                                            />
                                        ))}
                                    </div>
                                    <div className={cn(
                                        "mt-2 text-[10px] font-bold text-center opacity-70 group-hover/col:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis",
                                        isDark ? "text-gray-500" : "text-gray-600"
                                    )}>
                                        {weekIndex % 2 === 0 ? week.weekLabel : ''}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Card>
    );
};
