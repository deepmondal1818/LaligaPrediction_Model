import { PredictionResult } from "@/api/client";
import { Progress } from "@/components/ui/progress";
import { HelpCircle } from "lucide-react";

interface GoalProbabilityAnalysisProps {
    result: PredictionResult;
}

export function GoalProbabilityAnalysis({ result }: GoalProbabilityAnalysisProps) {
    const { over_1_5, over_2_5, btts } = result.market_analysis;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Goal Probability Analysis</h2>
                </div>
                <HelpCircle className="text-slate-300 pointer-events-auto cursor-help" size={20} />
            </div>

            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm space-y-12">
                {/* Horizontal Bar Chart */}
                <div className="space-y-8 max-w-4xl mx-auto px-10">
                    <MarketBar label="Over 1.5 Goals" value={over_1_5} color="bg-rose-600" />
                    <MarketBar label="Over 2.5 Goals" value={over_2_5} color="bg-amber-500" tooltip="Total goals scored in the match will be 3 or more." />
                    <MarketBar label="BTTS (Yes)" value={btts} color="bg-rose-500" />
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-6">
                    <StatBox label="OVER 1.5 GOALS" value={over_1_5} color="text-rose-600" dotColor="bg-rose-600" />
                    <StatBox label="OVER 2.5 GOALS" value={over_2_5} color="text-slate-800" dotColor="bg-amber-500" />
                    <StatBox label="BTTS (YES)" value={btts} color="text-slate-800" dotColor="bg-rose-500" />
                </div>

                {/* Probability Disclaimer */}
                <div className="bg-slate-50 rounded-2xl p-6 flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">i</div>
                    <p className="text-sm font-bold text-slate-400 leading-normal">
                        Probabilities are derived from the Poisson Distribution model, which estimates the likelihood of specific scorelines based on the teams' historical scoring and conceding frequencies in home and away conditions.
                    </p>
                </div>

                {/* AI Poisson Insight */}
                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                        <span className="font-bold">i</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">AI POISSON INSIGHT</p>
                        <p className="text-lg font-bold text-slate-600 leading-snug italic">
                            "{result.insights.poisson}"
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function MarketBar({ label, value, color, tooltip }: { label: string, value: number, color: string, tooltip?: string }) {
    return (
        <div className="flex items-center gap-6 relative group">
            <span className="text-sm font-black text-slate-800 w-32 text-right">{label}</span>
            <div className="flex-1 h-8 bg-slate-50 rounded-sm relative">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out rounded-sm`}
                    style={{ width: `${value}%` }}
                />
                {tooltip && (
                    <div className="absolute top-[-70px] left-[50%] -translate-x-1/2 bg-white border border-slate-100 shadow-xl p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 w-48 animate-in zoom-in-95">
                        <p className="text-sm font-black text-slate-800">{label}</p>
                        <p className="text-2xl font-black text-rose-600">{value}%</p>
                        <p className="text-[10px] font-bold text-slate-400 leading-tight mt-1">{tooltip}</p>
                        <div className="absolute bottom-[-6px] left-[50%] -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45" />
                    </div>
                )}
            </div>
            <span className="text-lg font-black text-slate-800 w-16">{value}%</span>
        </div>
    );
}

function StatBox({ label, value, color, dotColor }: { label: string, value: number, color: string, dotColor: string }) {
    return (
        <div className="bg-slate-50/50 rounded-2xl p-6 space-y-1">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            </div>
            <p className={`text-4xl font-black ${color}`}>
                {value}% <span className="text-xs font-bold text-slate-400 ml-1">Likelihood</span>
            </p>
        </div>
    );
}
