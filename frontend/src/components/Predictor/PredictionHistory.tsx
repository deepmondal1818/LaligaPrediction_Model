import { useEffect, useState } from "react";
import { api } from "@/api/client";
import { Clock, TrendingUp, Trophy } from "lucide-react";

export function PredictionHistory() {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.getHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-[40px] p-20 border border-slate-100 shadow-xl flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Prediction Vault...</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="bg-white rounded-[40px] p-20 border border-slate-100 shadow-xl flex flex-col items-center justify-center space-y-6 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Clock size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Predictions Found</h3>
                    <p className="text-slate-400 font-medium max-w-sm">
                        Generate your first AI prediction above and it will automatically be archived here for future analysis.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between px-4">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">PREDICTION <span className="text-rose-600 italic">VAULT</span></h2>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">History of AI Projections</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
                        <TrendingUp size={16} />
                        <span className="text-xs font-black uppercase">{history.length} RECORDS</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {history.map((record) => (
                    <div key={record.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-rose-500 transition-colors" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Clock size={12} />
                                    <span>{new Date(record.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-xl font-bold text-slate-800">{record.home_team}</div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-rose-600 font-black text-lg">
                                        {record.predicted_score}
                                    </div>
                                    <div className="text-xl font-bold text-slate-800">{record.away_team}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 md:flex items-center gap-4 md:gap-12 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                <ProbabilityBox label="HOME" value={record.home_win_prob} />
                                <ProbabilityBox label="DRAW" value={record.draw_prob} />
                                <ProbabilityBox label="AWAY" value={record.away_win_prob} />

                                <div className="col-span-3 md:col-auto flex flex-col items-end justify-center pl-6 md:border-l border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI CONFIDENCE</p>
                                    <p className="text-2xl font-black text-slate-900 leading-tight">{record.confidence}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProbabilityBox({ label, value }: { label: string, value: number }) {
    return (
        <div className="flex flex-col items-center">
            <p className="text-[10px] font-black text-slate-400 tracking-tighter mb-1">{label}</p>
            <p className="text-lg font-black text-slate-800">{value}%</p>
        </div>
    );
}
