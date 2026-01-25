import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Calendar, Flag, TrendingUp, Zap } from 'lucide-react';
import { UserSettings, CompletionData } from '@/types/hafiz';

interface HafizAnalyticsProps {
    settings: UserSettings;
    stats: CompletionData;
}

const HafizAnalytics: React.FC<HafizAnalyticsProps> = ({ settings, stats }) => {

    const generateChartData = () => {
        const data = [];
        const totalPages = settings.totalPages;
        const startPage = settings.startPage;
        const current = settings.currentPage;
        const projectedEnd = stats.estimatedCompletionDate;

        const startDate = new Date(settings.startDate);
        const today = new Date();

        data.push({
            name: 'Start',
            actual: startPage,
            projected: startPage,
            date: startDate.toLocaleDateString()
        });

        data.push({
            name: 'Today',
            actual: current,
            projected: current,
            date: today.toLocaleDateString()
        });

        for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(today);
            futureDate.setMonth(today.getMonth() + i);
            const daysFromNow = i * 30;
            const projectedPage = Math.min(totalPages, current + (daysFromNow * settings.dailyGoalPages));

            data.push({
                name: `Month ${i}`,
                projected: projectedPage,
                date: futureDate.toLocaleDateString()
            });
        }

        data.push({
            name: 'Finish',
            projected: totalPages,
            date: projectedEnd.toLocaleDateString()
        });

        return data;
    };

    const chartData = generateChartData();

    const StatCard = ({ icon: Icon, label, value, subtext, colorClass, bgClass }: {
        icon: React.ElementType;
        label: string;
        value: string;
        subtext: string;
        colorClass: string;
        bgClass: string;
    }) => (
        <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
                    <Icon size={18} />
                </div>
                {/* Optional dot indicator */}
                <div className={`w-1.5 h-1.5 rounded-full opacity-40`} style={{ backgroundColor: colorClass.includes('emerald') ? '#10b981' : colorClass.includes('blue') ? '#3b82f6' : colorClass.includes('orange') ? '#f97316' : '#a855f7' }}></div>
            </div>
            <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
                <h3 className="text-2xl font-bold text-foreground mt-1">{value}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{subtext}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 h-full pb-8">

            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Flag}
                    label="Est. Finish"
                    value={stats.estimatedCompletionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    subtext="Based on current pace"
                    colorClass="text-emerald-400"
                    bgClass="bg-emerald-500/10"
                />
                <StatCard
                    icon={Zap}
                    label="Velocity"
                    value={`${settings.dailyGoalPages} pgs/day`}
                    subtext="Consistent streak"
                    colorClass="text-blue-400"
                    bgClass="bg-blue-500/10"
                />
                <StatCard
                    icon={Calendar}
                    label="Time Left"
                    value={`${stats.daysRemaining} days`}
                    subtext={`Approx. ${Math.round(stats.daysRemaining / 30)} months`}
                    colorClass="text-orange-400"
                    bgClass="bg-orange-500/10"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Progress"
                    value={`${stats.pagesRemaining} left`}
                    subtext={`${stats.juzCompleted} / 30 Juz Done`}
                    colorClass="text-purple-400"
                    bgClass="bg-purple-500/10"
                />
            </div>

            {/* Main Chart Section */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-8 px-2">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Completion Projection</h3>
                        <p className="text-muted-foreground text-xs font-medium mt-1">Actual progress vs. estimated trajectory to Khatam</p>
                    </div>
                    <div className="flex bg-secondary p-1 rounded-lg">
                        <button className="px-3 py-1.5 bg-card shadow-sm rounded-md text-xs font-bold text-foreground border border-border">Linear</button>
                        <button className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">Adaptive AI</button>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorActualDark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorProjectedDark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(220, 10%, 40%)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="hsl(220, 10%, 40%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220, 10%, 20%)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(220, 10%, 60%)', fontSize: 11, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(220, 10%, 60%)', fontSize: 11, fontWeight: 500 }}
                                domain={[0, 604]}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid hsl(220, 10%, 20%)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    fontSize: '12px',
                                    backgroundColor: 'hsl(220, 15%, 14%)',
                                    color: 'hsl(220, 10%, 95%)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="projected"
                                stroke="hsl(220, 10%, 50%)"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorProjectedDark)"
                                name="Projected"
                            />
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="#ea580c"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorActualDark)"
                                name="Actual"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default HafizAnalytics;
