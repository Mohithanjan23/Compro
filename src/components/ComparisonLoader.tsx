import { useState, useEffect } from 'react';
import { Check, Circle, Loader2 } from 'lucide-react';

const STEPS = [
    "Confirming we've got the right product",
    "Comparing prices across all major stores",
    "Reading thousands of reviews for you",
    "Spotting the pros, cons, and hidden details",
    "Uncovering what people really think",
    "Creating your personalized buying guide"
];

export const ComparisonLoader = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < STEPS.length - 1) {
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 800); // 800ms per step

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 w-full max-w-md">
                <div className="space-y-6">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;
                        const isPending = index > currentStep;

                        return (
                            <div
                                key={step}
                                className={`flex items-center gap-4 transition-all duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}
                            >
                                <div className="shrink-0">
                                    {isCompleted ? (
                                        <div className="w-6 h-6 bg-emerald rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white bg-green-500 rounded-full p-0.5" />
                                        </div>
                                    ) : isCurrent ? (
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <Loader2 size={20} className="text-ink animate-spin" />
                                        </div>
                                    ) : (
                                        <Circle size={24} className="text-slate-200 fill-slate-50" />
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${isCurrent ? 'text-ink scale-105 origin-left' : 'text-slate-500'} transition-transform`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <p className="mt-8 text-slate-400 text-xs animate-pulse">Powered by Flash AI</p>
        </div>
    );
};
