import { PredictionResult } from "@/api/client";
import { AlertCircle, Zap } from "lucide-react";

interface KeyPlayerImpactProps {
    result: PredictionResult;
}

export function KeyPlayerImpact({ result }: KeyPlayerImpactProps) {
    if (!result.player_impact) return null;

    const { home_injured, away_injured, insight, home_key_player, away_key_player } = result.player_impact;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Key Player Impact Analysis</h2>
                </div>
                <Zap className="text-slate-300" size={20} />
            </div>

            <div className={`bg-white rounded-[32px] p-8 border shadow-sm transition-all duration-500 ${home_injured || away_injured
                ? 'border-amber-200 bg-amber-50/30'
                : 'border-slate-100'
                }`}>
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Visual Warning indicator if relevant */}
                    {(home_injured || away_injured) && (
                        <div className="shrink-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 animate-pulse">
                                <AlertCircle size={32} />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">AI SQUAD INTELLIGENCE</p>
                            <p className="text-xl font-bold text-slate-700 leading-tight">
                                {insight}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                            <PlayerCard
                                teamName={result.home_team}
                                playerName={home_key_player.top_scorer}
                                goals={home_key_player.goals}
                                isInjured={home_injured}
                            />
                            <PlayerCard
                                teamName={result.away_team}
                                playerName={away_key_player.top_scorer}
                                goals={away_key_player.goals}
                                isInjured={away_injured}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerCard({ teamName, playerName, goals, isInjured }: { teamName: string, playerName: string, goals: number, isInjured: boolean }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{teamName} Star Player</p>
                {isInjured && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full uppercase">Injured</span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${isInjured ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-600 shadow-sm'}`}>
                    {playerName.charAt(0)}
                </div>
                <div>
                    <p className={`font-bold ${isInjured ? 'text-slate-400' : 'text-slate-800'}`}>{playerName}</p>
                    <p className="text-xs text-slate-500 font-medium">Top Scorer • {goals} Goals</p>
                </div>
            </div>
        </div>
    );
}
