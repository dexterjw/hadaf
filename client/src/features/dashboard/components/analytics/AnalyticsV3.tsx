import React from 'react';
import { UserSettings, CompletionData } from '@/features/dashboard/types/hafiz';
import { motion } from 'framer-motion';

interface JourneyAnalyticsV3Props {
    settings: UserSettings;
    stats: CompletionData;
}

const JourneyAnalyticsV3: React.FC<JourneyAnalyticsV3Props> = ({ settings, stats }) => {
    // Calculate stroke offsets for circular progress
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (stats.progressPercentage / 100) * circumference;

    return (
        <div className="h-full flex flex-col items-center justify-center relative animate-in zoom-in-95 duration-700">

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Central Circular Viz */}
            <div className="relative w-[320px] h-[320px] flex items-center justify-center mb-12">
                {/* Outer Ring Background */}
                <svg className="w-full h-full rotate-[-90deg]">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        className="stroke-muted/20"
                        strokeWidth="24"
                    />
                    {/* Progress Ring */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        fill="none"
                        className="stroke-foreground"
                        strokeWidth="24"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: progressOffset }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                </svg>

                {/* Inner Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-muted-foreground text-xs uppercase tracking-widest mb-2"
                    >
                        Completion
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-6xl font-display font-light text-foreground"
                    >
                        {Math.round(stats.progressPercentage)}%
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-accent text-sm font-medium mt-2"
                    >
                        {stats.pagesRemaining} Pages Left
                    </motion.div>
                </div>
            </div>

            {/* Minimal Stats Row */}
            <div className="flex gap-16">
                <div className="text-center group cursor-default">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-foreground transition-colors">Target Date</div>
                    <div className="text-xl font-display font-medium">{stats.estimatedCompletionDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                </div>

                <div className="w-px bg-border h-12"></div>

                <div className="text-center group cursor-default">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-foreground transition-colors">Current Juz</div>
                    <div className="text-xl font-display font-medium">{stats.juzCompleted + 1}</div>
                </div>

                <div className="w-px bg-border h-12"></div>

                <div className="text-center group cursor-default">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 group-hover:text-foreground transition-colors">Velocity</div>
                    <div className="text-xl font-display font-medium">{settings.dailyGoalPages}/day</div>
                </div>
            </div>

            <div className="mt-12 opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase tracking-widest text-center max-w-xs leading-relaxed">
                    "And We have certainly made the Quran easy for remembrance, so is there any who will remember?"
                </p>
            </div>

        </div>
    );
};

export default JourneyAnalyticsV3;
