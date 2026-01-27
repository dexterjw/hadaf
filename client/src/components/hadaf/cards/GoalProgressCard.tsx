
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GoalProgressCardProps {
    variant: 'ahead' | 'behind';
    percentage: number; // e.g., 30 for 30%
    className?: string;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ variant, percentage, className }) => {
    // Colors based on variant
    const isAhead = variant === 'ahead';

    // Base progress (visual approximation from image)
    const baseProgress = 40;
    const deltaProgress = 20; // The striped part width relative to bar

    return (
        <Card className={cn("overflow-hidden border-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300", className)}>
            <CardHeader className="pb-3 pt-6 px-6">
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground/90">Goal Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-8">
                {/* Progress Bar Container */}
                <div className={cn("relative h-4 w-full rounded-full overflow-hidden ring-1 ring-inset ring-black/5", isAhead ? "bg-[#dcfce7]" : "bg-[#fee2e2]")}>

                    {/* Background Track */}
                    <div className={cn("absolute inset-0 w-full h-full", isAhead ? "bg-[#effdf4]" : "bg-[#fef2f2]")}></div>

                    {isAhead ? (
                        <>
                            {/* Dark Green Segment */}
                            <div className="absolute left-0 top-0 h-full bg-[#15803d] z-20 rounded-l-full shadow-[2px_0_4px_rgba(0,0,0,0.1)]" style={{ width: '30%' }}></div>
                            {/* Striped Green Segment */}
                            <div className="absolute h-full z-10"
                                style={{
                                    left: '30%',
                                    width: '20%',
                                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, #4ade80 4px, #4ade80 8px)',
                                    backgroundColor: '#bbf7d0'
                                }}
                            ></div>
                            {/* Dot */}
                            <div className="absolute top-1/2 -translate-y-1/2 z-30 h-4 w-4 rounded-full bg-white border-[3px] border-[#15803d] shadow-sm transform transition-transform hover:scale-110" style={{ left: 'calc(50% - 6px)' }}></div>
                        </>
                    ) : (
                        <>
                            {/* Dark Red Segment */}
                            <div className="absolute left-0 top-0 h-full bg-[#b91c1c] z-20 rounded-l-full shadow-[2px_0_4px_rgba(0,0,0,0.1)]" style={{ width: '45%' }}></div>
                            {/* Dot - placed at end of solid */}
                            <div className="absolute top-1/2 -translate-y-1/2 z-30 h-4 w-4 rounded-full bg-white border-[3px] border-[#b91c1c] shadow-sm transform transition-transform hover:scale-110" style={{ left: 'calc(45% - 6px)' }}></div>
                            {/* Striped Red Segment - starts after solid */}
                            <div className="absolute top-0 h-full z-10"
                                style={{
                                    left: '45%',
                                    width: '25%',
                                    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, #f87171 4px, #f87171 8px)',
                                    backgroundColor: '#fecaca'
                                }}
                            ></div>
                        </>
                    )}
                </div>

                {/* Text Content */}
                <div className="text-[15px] leading-relaxed text-muted-foreground/80 font-normal">
                    {isAhead ? (
                        <>
                            You're <span className="font-semibold text-green-700/90">ahead of pace</span> and should reach your goal <span className="font-bold text-foreground tracking-tight">{percentage}%</span><br />
                            <span className="font-semibold text-foreground/90 tracking-tight">ahead of schedule</span>
                        </>
                    ) : (
                        <>
                            You're <span className="font-semibold text-red-700/90">behind pace</span> and should reach your goal <span className="font-bold text-foreground tracking-tight">{percentage}%</span><br />
                            <span className="font-semibold text-foreground/90 tracking-tight">behind schedule</span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default GoalProgressCard;
