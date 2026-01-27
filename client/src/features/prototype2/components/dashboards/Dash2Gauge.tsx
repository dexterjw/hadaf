import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import { Card } from '@/components/ui/card';
import { Circle, TrendingUp, BookOpen, Flame, Calendar, Award, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
        </div>
    );
};

export default Dash2Gauge;
