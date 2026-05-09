import { type PredictionResult } from "@/api/client";
import { Badge } from "@/components/ui/badge";

interface RecentFormProps {
    result: PredictionResult;
}

export function RecentForm({ result }: RecentFormProps) {
    const { home, away, momentum_gap } = result.form_analysis;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-rose-600 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Recent Form <span className="text-rose-600">Analysis</span></h2>
            </div>
            <p className="text-sm font-bold text-slate-400 -mt-4">Performance in the last 5 matches</p>

            <div className="grid md:grid-cols-2 gap-6">
                <FormCard team={result.home_team} stats={home} color="rose" />
                <FormCard team={result.away_team} stats={away} color="blue" />
            </div>

            {/* Momentum Bar */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{result.home_team}</p>
                    <div className="bg-slate-100 px-4 py-1 rounded-full">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Form Momentum</span>
                    </div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-right">{result.away_team}</p>
                </div>

                <div className="flex justify-between items-end mb-4">
                    <p className="text-3xl font-black text-slate-800">{home.points} pts</p>
                    <p className="text-3xl font-black text-slate-800">{away.points} pts</p>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                    <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${(home.points / (home.points + away.points)) * 100}%` }} />
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(away.points / (home.points + away.points)) * 100}%` }} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 text-center italic mt-2">Points accumulated in the last 5 matches comparison</p>
            </div>

            {/* Predictor Insight */}
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                    <span className="font-bold">i</span>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Predictor Insight</p>
                    <p className="text-lg font-bold text-slate-600 leading-snug italic">
                        "{result.insights.predictor}"
                    </p>
                </div>
            </div>
        </div>
    );
}

function FormCard({ team, stats, color }: { team: string, stats: any, color: 'rose' | 'blue' }) {
    const accent = color === 'rose' ? 'text-rose-600 bg-rose-50' : 'text-blue-600 bg-blue-50';
    const border = color === 'rose' ? 'border-rose-100' : 'border-blue-100';

    return (
        <div className={`bg-white rounded-3xl p-8 border ${border} shadow-sm space-y-6`}>
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {/* Placeholder for logo */}
                        <div className={`w-6 h-6 rounded-full ${color === 'rose' ? 'bg-rose-500' : 'bg-blue-600'}`} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{team}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{color === 'rose' ? 'Home' : 'Away'}</p>
                    </div>
                </div>
                <Badge className={`bg-emerald-50 text-emerald-500 border border-emerald-100 font-bold px-3 py-1 rounded-xl`}>
                    {stats.label}
                </Badge>
            </div>

            <div className="flex gap-3">
                {stats.match_history.map((m: any, i: number) => {
                    const outcomeColor = m.outcome === 'Win' ? 'bg-emerald-500' : m.outcome === 'Draw' ? 'bg-amber-500' : 'bg-rose-500';
                    return (
                        <div key={i} className={`w-10 h-10 rounded-2xl ${outcomeColor} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                            {m.outcome[0]}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50/50 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-slate-800">{stats.wins}-{stats.draws}-{stats.losses}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">W - D - L</p>
                </div>
                <div className="bg-slate-50/50 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-rose-500">{stats.goals_scored}:{stats.goals_conceded}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Goals Score/Conc</p>
                </div>
            </div>
        </div>
    );
}
