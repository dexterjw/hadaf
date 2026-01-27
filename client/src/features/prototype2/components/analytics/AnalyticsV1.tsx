import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { Calendar, Flag, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import { motion } from 'framer-motion';

interface JourneyAnalyticsV1Props {
    settings: UserSettings;
    stats: CompletionData;
}

const JourneyAnalyticsV1: React.FC<JourneyAnalyticsV1Props> = ({ settings, stats }) => {

    const generateChartData = () => {
        const data = [];
        const totalPages = settings.totalPages;
        const startPage = settings.startPage;
        const current = settings.currentPage;
        const projectedEnd = stats.estimatedCompletionDate;

        const startDate = new Date(settings.startDate);
        const today = new Date();

        // Start Point
        data.push({
            name: 'Start',
            actual: startPage,
            projected: startPage,
            date: startDate.toLocaleDateString(),
            label: 'Started Journey'
        });

        // Current Point
        data.push({
            name: 'Today',
            actual: current,
            projected: current,
            date: today.toLocaleDateString(),
            label: 'You are here'
        });

        // Future Points
        for (let i = 1; i <= 6; i++) {
            const futureDate = new Date(today);
            futureDate.setMonth(today.getMonth() + i);
            const daysFromNow = i * 30;
            const projectedPage = Math.min(totalPages, current + (daysFromNow * settings.dailyGoalPages));

            data.push({
                name: `Month ${i}`,
                projected: projectedPage,
                date: futureDate.toLocaleDateString(),
                label: ''
            });
        }

        // Finish Point
        data.push({
            name: 'Finish',
            projected: totalPages,
            date: projectedEnd.toLocaleDateString(),
            label: 'Khatam'
        });

        return data;
    };

    const chartData = generateChartData();

    return (
        <div className="space-y-6 h-full animate-in fade-in duration-500">
            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h3 className="text-2xl font-display font-medium text-foreground">Timeline View</h3>
                    <p className="text-muted-foreground text-sm">Visualizing your path from start to finish based on your current velocity.</p>
                </div>
                <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-xl backdrop-blur-sm border border-white/5">
                    <div className="text-right px-2">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Est. Completion</div>
                        <div className="font-bold text-accent">{stats.estimatedCompletionDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="bg-card p-6 rounded-3xl shadow-lg border border-border h-[450px] flex flex-col relative overflow-hidden group">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 transition-all duration-1000 group-hover:bg-accent/10"></div>

                <div className="flex justify-between items-center mb-8 px-2 z-10">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                            <span className="text-xs font-medium text-muted-foreground">Actual Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-accent/50 border border-accent"></span>
                            <span className="text-xs font-medium text-muted-foreground">Projected Path</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorActualV1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorProjectedV1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
                                domain={[0, 604]}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                                    fontSize: '12px',
                                    backgroundColor: 'var(--card)',
                                    color: 'var(--foreground)',
                                    padding: '12px'
                                }}
                                itemStyle={{ padding: 0 }}
                                labelStyle={{ marginBottom: '8px', color: 'var(--muted-foreground)', fontWeight: 600 }}
                            />
                            <Area
                                type="natural" // Smoother curve for V1
                                dataKey="projected"
                                stroke="var(--accent)"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorProjectedV1)"
                                name="Projected"
                                animationDuration={2000}
                            />
                            <Area
                                type="natural"
                                dataKey="actual"
                                stroke="#f97316"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorActualV1)"
                                name="Actual"
                                animationDuration={1500}
                            />
                            {/* Marker for Current Position */}
                            <ReferenceLine x="Today" stroke="var(--foreground)" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'var(--foreground)', fontSize: 10 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Horizontal Timeline of Juz */}
            <div className="bg-card/50 backdrop-blur-md p-6 rounded-3xl border border-border mt-6">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">Milestone Roadmap</h4>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary rounded-full -translate-y-1/2"></div>
                    <div className="flex justify-between items-center relative z-10 overflow-x-auto pb-4 gap-8 px-2 custom-scrollbar">
                        {[1, 5, 10, 15, 20, 25, 30].map((juz) => {
                            const isCompleted = settings.currentPage >= juz * 20;
                            const isFuture = !isCompleted;

                            return (
                                <motion.div
                                    key={juz}
                                    className="flex flex-col items-center min-w-[80px]"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: juz * 0.05 }}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 border-4 transition-all duration-300 ${isCompleted ? 'bg-accent text-accent-foreground border-accent' : 'bg-card text-muted-foreground border-secondary'}`}>
                                        {juz}
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">Juz {juz}</span>
                                    {isCompleted && <span className="text-[10px] text-accent mt-1">Done</span>}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JourneyAnalyticsV1;
