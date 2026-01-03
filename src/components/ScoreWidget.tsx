import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreWidgetProps {
    score: number;
    delta?: number;
    className?: string;
    variant?: 'sidebar' | 'hero';
}

const ScoreWidget: React.FC<ScoreWidgetProps> = ({ score, delta, className, variant = 'sidebar' }) => {
    const [animatedScore, setAnimatedScore] = useState(59);
    const [showDelta, setShowDelta] = useState(false);
    const [lastDelta, setLastDelta] = useState(0);

    const isHero = variant === 'hero';
    const isInitial = score === 59; // Simplified check for "Initial Benchmark"

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timeout);
    }, [score]);

    useEffect(() => {
        if (delta !== undefined && delta !== 0) {
            setLastDelta(delta);
            setShowDelta(true);
            const timer = setTimeout(() => setShowDelta(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [delta]);

    const getColor = (s: number) => {
        if (s <= 40) return 'text-rose-500 stroke-rose-500';
        if (s <= 70) return 'text-amber-500 stroke-amber-500';
        return 'text-emerald-500 stroke-emerald-500';
    };

    const colorClass = getColor(animatedScore);
    const STROKE_LENGTH = 251.32;
    const strokeDashoffset = STROKE_LENGTH * (1 - animatedScore / 100);

    return (
        <div className={cn(
            isHero ? "" : "glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5",
            className
        )}>
            {!isHero && (
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-30 pointer-events-none" />
            )}

            <div className={cn(
                "relative z-10",
                isHero ? "w-[340px] h-[180px]" : "w-44 h-28 mb-3"
            )}>
                <svg viewBox="0 0 180 100" className="w-full h-full transform overflow-visible">
                    <defs>
                        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Background Track */}
                    <path
                        d="M 10 90 A 80 80 0 0 1 170 90"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={isHero ? "11" : "9"}
                        strokeLinecap="round"
                    />

                    {/* Active Progress */}
                    <path
                        d="M 10 90 A 80 80 0 0 1 170 90"
                        fill="none"
                        stroke="url(#arcGradient)"
                        strokeWidth={isHero ? "11" : "9"}
                        strokeDasharray={STROKE_LENGTH}
                        strokeDashoffset={strokeDashoffset}
                        className={cn("transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]", colorClass.split(' ')[1])}
                        style={{ filter: animatedScore > 30 ? 'url(#glow)' : 'none' }}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <div className="flex flex-col items-center text-center w-full">
                        <span className={cn(
                            "font-black tracking-tighter leading-none select-none drop-shadow-2xl transition-all duration-1000",
                            isHero ? "text-[80px]" : "text-[36px]",
                            colorClass.split(' ')[0]
                        )}>
                            {Math.round(animatedScore)}%
                        </span>

                        {!isHero && (
                            <div className="h-5 relative w-full overflow-hidden mt-1">
                                {showDelta ? (
                                    <span className={cn(
                                        "absolute inset-0 text-[13px] font-black animate-in slide-in-from-bottom-2 fade-in duration-700",
                                        lastDelta > 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {lastDelta > 0 ? `+${lastDelta}` : lastDelta} Score Impact
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 animate-in fade-in duration-1000">
                                        {isInitial ? "Initial Benchmark" : "Real-time Delta"}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!isHero && (
                <div className="flex flex-col items-center gap-3 w-full animate-in fade-in duration-1000 delay-300">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest relative z-10 shadow-lg border-2 transition-all duration-1000",
                        animatedScore <= 40 ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' :
                            animatedScore <= 70 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                                'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    )}>
                        {animatedScore <= 40 ? 'Critical Risk' : animatedScore <= 70 ? 'Moderate Readiness' : 'High Readiness'}
                    </div>

                    {animatedScore === 89 && (
                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.1em] text-center max-w-[180px] leading-relaxed">
                            Max Automated Score Reached.<br />
                            <span className="text-secondary-foreground/60">Final 11% requires manual verification.</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScoreWidget;
