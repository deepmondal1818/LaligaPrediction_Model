import { type PredictionResult } from "@/api/client";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface PredictionResultProps {
    result: PredictionResult;
}

export function PredictionResult({ result }: PredictionResultProps) {
    const isHomeWinner = result.probabilities.home_win > result.probabilities.away_win;
    const isAwayWinner = result.probabilities.away_win > result.probabilities.home_win;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* LALIGA MATCH PREDICTION CARD */}
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-white py-6 border-b border-rose-100 text-center">
                    <h3 className="text-rose-600 font-black uppercase tracking-[0.2em] text-sm">Laliga Match Prediction</h3>
                </div>

                <div className="p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50/50 via-transparent to-slate-50/50 pointer-events-none" />

                    {/* Home Team */}
                    <div className="text-center space-y-6 z-10 w-full md:w-1/3">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-slate-100 flex items-center justify-center p-4 shadow-inner">
                            <div className="w-16 h-16 rounded-full bg-rose-500 shadow-lg" />
                        </div>
                        <h4 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{result.home_team}</h4>
                        {isHomeWinner && <Badge className="bg-emerald-50 text-emerald-500 font-black px-6 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest text-[10px]">Predicted Winner</Badge>}
                    </div>

                    {/* Score & Confidence */}
                    <div className="flex flex-col items-center gap-4 z-10 w-full md:w-1/3 text-center">
                        <div className="text-[120px] md:text-[160px] font-black text-slate-900 leading-none tracking-tighter flex items-center tabular-nums">
                            {result.predicted_score.split('-')[0]}
                            <span className="text-slate-200 mx-4">-</span>
                            {result.predicted_score.split('-')[1]}
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-full px-8 py-3 flex items-center gap-3 shadow-sm group">
                            <Sparkles size={18} className="text-amber-500 group-hover:scale-120 transition-transform" />
                            <span className="text-slate-500 font-bold text-sm tracking-tight">Confidence: <span className="text-slate-900 font-black">{result.confidence}%</span></span>
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="text-center space-y-6 z-10 w-full md:w-1/3">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-slate-100 flex items-center justify-center p-4 shadow-inner">
                            <div className="w-16 h-16 rounded-full bg-blue-600 shadow-lg" />
                        </div>
                        <h4 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tighter">{result.away_team}</h4>
                        {isAwayWinner && <Badge className="bg-emerald-50 text-emerald-500 font-black px-6 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest text-[10px]">Predicted Winner</Badge>}
                    </div>
                </div>

                {/* Probability Bars Footer */}
                <div className="px-12 pb-12 space-y-10">
                    <ProbabilityStrip
                        label="Poisson Engine Probabilities"
                        probs={result.poisson_probs}
                        color="rose"
                    />
                    <ProbabilityStrip
                        label="Random Forest ML Probabilities"
                        probs={result.rf_probs}
                        color="amber"
                    />
                </div>
            </div>
        </div>
    );
}

function ProbabilityStrip({ label, probs, color }: { label: string, probs: any, color: 'rose' | 'amber' }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
                <span className={`${color === 'rose' ? 'text-rose-600' : 'text-amber-500'} font-black uppercase tracking-widest text-[10px]`}>{label}</span>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home {probs.home}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draw {probs.draw}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Away {probs.away}%</span>
                </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className={`h-full ${color === 'rose' ? 'bg-rose-600' : 'bg-rose-400'} transition-all duration-1000`} style={{ width: `${probs.home}%` }} />
                <div className="h-full bg-slate-300 transition-all duration-1000" style={{ width: `${probs.draw}%` }} />
                <div className={`h-full ${color === 'rose' ? 'bg-amber-400' : 'bg-amber-400'} transition-all duration-1000`} style={{ width: `${probs.away}%` }} />
            </div>
        </div>
    );
}

