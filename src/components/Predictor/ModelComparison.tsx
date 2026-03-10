import { PredictionResult } from "@/api/client";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ModelComparisonProps {
    result: PredictionResult;
}

export function ModelComparison({ result }: ModelComparisonProps) {
    const { agreement, variance, recommendation } = result.comparison;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800">AI Model Comparison</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className={`rounded-3xl p-8 flex flex-col justify-between border ${agreement === 'HIGH' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex gap-4 items-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${agreement === 'HIGH' ? 'bg-white text-emerald-500 border-emerald-100' : 'bg-white text-slate-400 border-slate-100'}`}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Model Agreement</p>
                            <h3 className={`text-3xl font-black italic tracking-tighter ${agreement === 'HIGH' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                {agreement}
                            </h3>
                        </div>
                    </div>
                    <p className="text-lg font-bold text-slate-600 leading-snug">
                        The Statistical and ML models are {agreement === 'HIGH' ? 'closely aligned.' : agreement === 'MEDIUM' ? 'showing moderate consensus.' : 'demonstrating significant variance.'}
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prediction Variance</p>
                            <p className="text-4xl font-black text-slate-800">
                                {variance}% <span className="text-sm font-bold text-slate-400">Deviation</span>
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                            <ArrowRight size={20} />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Expert Recommendation</p>
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight">{recommendation}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
