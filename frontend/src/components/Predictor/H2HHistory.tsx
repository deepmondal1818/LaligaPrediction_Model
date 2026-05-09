import { PredictionResult } from "@/api/client";
import { History, Sword } from "lucide-react";

interface H2HHistoryProps {
    result: PredictionResult;
}

export function H2HHistory({ result }: H2HHistoryProps) {
    const { h2h_history, home_team, away_team } = result;

    if (!h2h_history || h2h_history.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">HEAD-TO-HEAD HISTORY</h2>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 font-medium italic">No recent head-to-head records found for these teams.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-secondary rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-800">Head-to-Head History</h2>
                </div>
                <History className="text-slate-300" size={20} />
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">
                    LAST {h2h_history.length} ENCOUNTERS
                </p>

                <div className="space-y-3">
                    {h2h_history.map((match, idx) => {
                        const isHome = match.homeTeam === home_team;
                        const teamScore = isHome ? match.homeScore : match.awayScore;
                        const opponentScore = isHome ? match.awayScore : match.homeScore;

                        let outcome = "DRAW";
                        let outcomeColor = "bg-slate-100 text-slate-500";

                        if (teamScore > opponentScore) {
                            outcome = "WIN";
                            outcomeColor = "bg-emerald-100 text-emerald-600";
                        } else if (teamScore < opponentScore) {
                            outcome = "LOSS";
                            outcomeColor = "bg-rose-100 text-rose-600";
                        }

                        return (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{match.date}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-black px-2 py-0.5 rounded ${outcomeColor}`}>
                                            {outcome}
                                        </span>
                                        <span className="text-sm font-bold text-slate-500">
                                            {isHome ? "Home" : "Away"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex items-center gap-4 text-right min-w-[120px] justify-end">
                                        <span className={`text-sm font-bold ${isHome ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>{match.homeTeam}</span>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 min-w-[80px] justify-center">
                                        <span className="text-xl font-black text-slate-800">{match.homeScore}</span>
                                        <span className="text-slate-300 text-sm">-</span>
                                        <span className="text-xl font-black text-slate-800">{match.awayScore}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-left min-w-[120px]">
                                        <span className={`text-sm font-bold ${!isHome ? 'text-slate-800' : 'text-slate-400 font-medium'}`}>{match.awayTeam}</span>
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    <Sword size={14} className="text-slate-200" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                        <span>Historical Rivalry Data</span>
                        <span>LaLiga Santander</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
