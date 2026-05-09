import { PredictionResult } from "@/api/client";

interface PoissonAnalysisProps {
    analysis: PredictionResult['poisson_analysis'];
}

export function PoissonAnalysis({ analysis }: PoissonAnalysisProps) {
    if (!analysis) return null;

    return (
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-8 space-y-6 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-400">
                    <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                </svg>
            </div>

            <h3 className="text-2xl font-black text-emerald-400 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full" />
                Poisson Analysis
            </h3>

            <p className="text-xl leading-relaxed text-emerald-100/90 font-medium italic">
                "{analysis.ai_insight}"
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                    <p className="text-sm font-bold text-emerald-500/60 uppercase tracking-widest">Home Expected Goals (xG)</p>
                    <p className="text-4xl font-black text-white">{analysis.lambda_values.lambda_home.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-bold text-emerald-500/60 uppercase tracking-widest">Away Expected Goals (xG)</p>
                    <p className="text-4xl font-black text-white">{analysis.lambda_values.lambda_away.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
