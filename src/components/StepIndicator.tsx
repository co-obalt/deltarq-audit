import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    className?: string;
}

const steps = [
    { id: 1, label: 'Framework' },
    { id: 2, label: 'Profile' },
    { id: 3, label: 'Risk' },
    { id: 4, label: 'Report' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, className }) => {
    const isResultsPage = currentStep === 4;
    const targetWidth = Math.min(100, Math.max(0, (currentStep - 1) / (steps.length - 1)) * 100);
    const [animatedWidth, setAnimatedWidth] = React.useState(targetWidth);

    React.useEffect(() => {
        setAnimatedWidth(targetWidth);
    }, [targetWidth]);

    return (
        <div className={cn("w-full py-2 z-50", className)}>
            <div className="container mx-auto max-w-2xl px-4">
                <div className="relative flex justify-between items-center h-12">
                    {/* Background Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[3px] bg-secondary/30 -translate-y-1/2 z-0 rounded-full" />

                    {/* Active Progress Line with Shimmer */}
                    <div
                        className={cn(
                            "absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-indigo-600 via-emerald-500 to-emerald-400 transition-all duration-[1500ms] ease-in-out -translate-y-1/2 z-0 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]",
                            isResultsPage && "animate-pulse"
                        )}
                        style={{ width: `${animatedWidth}%` }}
                    />

                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id || (isResultsPage && step.id === 4);
                        const isActive = currentStep === step.id && !isResultsPage;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-700 border-2 relative",
                                        isCompleted ? "bg-emerald-500 border-emerald-400 text-[#0A0A0A] shadow-[0_0_15px_rgba(16,185,129,0.4)]" :
                                            isActive ? "bg-[#0A0A0A] border-emerald-500 text-emerald-500 ring-4 ring-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-breathe" :
                                                "bg-background border-secondary text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-3.5 h-3.5 stroke-[4px]" />
                                    ) : (
                                        <span className="text-[10px] font-black">{step.id}</span>
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        "absolute top-10 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                                        isActive || (isResultsPage && step.id === 4) ? "text-emerald-500 translate-y-0.5" :
                                            isCompleted ? "text-emerald-500/70" : "text-muted-foreground"
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StepIndicator;
