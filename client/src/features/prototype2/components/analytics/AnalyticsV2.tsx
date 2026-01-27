import React from 'react';
import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import { Flag, Zap, Calendar, TrendingUp, Layers, ArrowRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyAnalyticsV2Props {
    settings: UserSettings;
    stats: CompletionData;
}

const JourneyAnalyticsV2: React.FC<JourneyAnalyticsV2Props> = ({ settings, stats }) => {
    // Re-using and expanding the JourneyMap logic locally for a full-page view
    const currentJuz = stats.juzCompleted + 1;

    const stages = [
        {
            id: 1,
            name: "The Foundation",
            subtitle: "Al-Ta'sis",
            range: [1, 10],
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            icon: Layers
        },
        {
            id: 2,
            name: "The Momentum",
            subtitle: "Al-Inqilaq",
            range: [11, 20],
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            icon: Zap
        },
        {
            id: 3,
            name: "The Mastery",
            subtitle: "Al-Itqan",
            range: [21, 30],
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            icon: Flag
        }
    ];

    const StatCard = ({ label, value, sub, icon: Icon, delay }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-display font-medium text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
        </motion.div>
    );

    return (
        <div className="space-y-8 animate-in float-in duration-500">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-display font-medium text-foreground">Analytics Grid</h3>
                <p className="text-muted-foreground text-sm">A comprehensive breakdown of your stats and stage-wise progress.</p>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-card to-secondary/30 p-6 rounded-3xl border border-border relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                <TrendingUp size={16} />
                            </span>
                            <span className="text-sm font-semibold text-orange-500 uppercase tracking-widest">Primary Focus</span>
                        </div>
                        <h4 className="text-4xl font-display font-bold text-foreground mb-2">Juz {currentJuz}</h4>
                        <p className="text-muted-foreground max-w-sm">You are currently traversing the {currentJuz <= 10 ? 'Foundation' : currentJuz <= 20 ? 'Momentum' : 'Mastery'} stage. Keep your pace steady.</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-5">
                        <TrendingUp size={150} />
                    </div>
                </div>

                <StatCard
                    label="Finishing In"
                    value={`${stats.daysRemaining} Days`}
                    sub={`By ${stats.estimatedCompletionDate.toLocaleDateString()}`}
                    icon={Calendar}
                    delay={0.1}
                />
                <StatCard
                    label="Current Pace"
                    value={`${settings.dailyGoalPages} Pgs`}
                    sub="Daily Average"
                    icon={Zap}
                    delay={0.2}
                />
            </div>

            {/* Detailed Stage Breakdown */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold">The Three Stages</h4>
                    <button className="text-xs font-medium text-accent flex items-center gap-1 hover:underline">
                        View Full Details <ArrowRight size={12} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stages.map((stage, i) => {
                        const isActive = currentJuz >= stage.range[0] && currentJuz <= stage.range[1];
                        const isPast = currentJuz > stage.range[1];

                        return (
                            <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className={`
                                    relative p-6 rounded-3xl border transition-all duration-300 group
                                    ${isActive ? 'bg-card ring-1 ring-ring shadow-lg scale-[1.02]' : 'bg-card/40 border-border hover:bg-card/60'}
                                    ${isPast ? 'opacity-60' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stage.bg} ${stage.color}`}>
                                        <stage.icon size={20} />
                                    </div>
                                    <div className="text-4xl font-display font-bold text-muted-foreground/10">{stage.id}0</div>
                                </div>

                                <div className="mb-6">
                                    <h5 className="text-lg font-bold text-foreground">{stage.name}</h5>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{stage.subtitle}</p>
                                </div>

                                {/* Mini Grid of Juz */}
                                <div className="grid grid-cols-5 gap-2">
                                    {Array.from({ length: 10 }).map((_, idx) => {
                                        const juzNum = stage.range[0] + idx;
                                        const jStatus = juzNum < currentJuz ? 'done' : juzNum === currentJuz ? 'current' : 'todo';

                                        return (
                                            <div
                                                key={juzNum}
                                                className={`
                                                    aspect-square rounded-md flex items-center justify-center text-[10px] font-bold border
                                                    ${jStatus === 'done' ? 'bg-foreground/5 border-foreground/10 text-foreground/50' : ''}
                                                    ${jStatus === 'current' ? `bg-foreground text-background border-foreground shadow-[0_0_10px_rgba(0,0,0,0.1)]` : ''}
                                                    ${jStatus === 'todo' ? 'bg-transparent border-transparent text-muted-foreground/30' : ''}
                                                `}
                                            >
                                                {juzNum}
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default JourneyAnalyticsV2;
