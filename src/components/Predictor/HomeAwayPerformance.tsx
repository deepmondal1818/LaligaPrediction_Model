import { PredictionResult } from "@/api/client";
import { Home, Plane } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface HomeAwayPerformanceProps {
    result: PredictionResult;
}

export function HomeAwayPerformance({ result }: HomeAwayPerformanceProps) {
    const { home, away } = result.performance_analysis;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800">Home vs Away Performance Analysis</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Home Card */}
                <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                                <Home size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Home Performance</p>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{result.home_team}</h3>
                            </div>
                        </div>
                        <Badge className={`${home.strength === 'STRONG' ? 'bg-emerald-500' : 'bg-red-500'} text-white font-bold px-4 py-1.5 rounded-xl`}>
                            {home.strength}
                        </Badge>
                    </div>

                    <div className="space-y-6 mb-10">
                        <StatRow label="Avg Goals Scored" value={home.avg_scored} color="bg-red-600" />
                        <StatRow label="Avg Goals Conceded" value={home.avg_conceded} color="bg-slate-300" />
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Matches Played</p>
                            <p className="text-4xl font-black text-slate-800 tabular-nums">{home.played}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic">Poisson λ</p>
                            <p className="text-4xl font-black text-red-600 tabular-nums">{home.lambda.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Away Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                                <Plane size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Away Performance</p>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{result.away_team}</h3>
                            </div>
                        </div>
                        <Badge className={`${away.strength === 'STRONG' ? 'bg-emerald-500' : 'bg-red-500'} text-white font-bold px-4 py-1.5 rounded-xl`}>
                            {away.strength}
                        </Badge>
                    </div>

                    <div className="space-y-6 mb-10">
                        <StatRow label="Avg Goals Scored" value={away.avg_scored} color="bg-amber-500" />
                        <StatRow label="Avg Goals Conceded" value={away.avg_conceded} color="bg-slate-300" />
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Matches Played</p>
                            <p className="text-4xl font-black text-slate-800 tabular-nums">{away.played}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic">Poisson λ</p>
                            <p className="text-4xl font-black text-red-600 tabular-nums">{away.lambda.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatRow({ label, value, color }: { label: string, value: number, color: string }) {
    // Normalizing bar width (assuming 3.0 is a high avg goals)
    const percentage = Math.min((value / 3) * 100, 100);
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-800">{value.toFixed(2)}</span>
            </div>
            <Progress value={percentage} className="h-2.5 bg-slate-100 rounded-full">
                <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
            </Progress>
        </div>
    );
}
