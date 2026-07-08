import { useState } from "react";
import { TeamSelector } from "@/components/Predictor/TeamSelector";
import { PredictionResult } from "@/components/Predictor/PredictionResult";
import { GoalProbabilityAnalysis } from "@/components/Predictor/GoalProbabilityAnalysis";
import { KeyPlayerImpact } from "@/components/Predictor/KeyPlayerImpact";
import { H2HHistory } from "@/components/Predictor/H2HHistory";
import { HomeAwayPerformance } from "@/components/Predictor/HomeAwayPerformance";
import { ModelComparison } from "@/components/Predictor/ModelComparison";
import { RecentForm } from "@/components/Predictor/RecentForm";
import { PredictionHistory } from "@/components/Predictor/PredictionHistory";
import { api, type PredictionResult as PredictionType } from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import { LayoutDashboard, History as HistoryIcon } from "lucide-react";

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'predict' | 'history'>('predict');
  const { toast } = useToast();

  const handlePredict = async (home: string, away: string) => {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await api.predictMatch(home, away);
      setPrediction(result);
      toast({
        title: "Prediction Generated!",
        description: `Analysis complete for ${home} vs ${away}.`,
      });
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Could not connect to the AI backend.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-rose-500/10 pb-32">
      {/* Top Banner decoration */}
      <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />

      <main className="max-width-7xl mx-auto px-6 space-y-16 pt-16">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-3xl w-fit mx-auto shadow-inner">
          <button
            onClick={() => setView('predict')}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${view === 'predict' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <LayoutDashboard size={18} />
            PREDICTOR
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${view === 'history' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <HistoryIcon size={18} />
            VAULT
          </button>
        </div>

        {view === 'predict' ? (
          <>
            {/* Match Selector Section */}
            <section className="space-y-12 bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 shadow-xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
                    LALIGA <span className="text-rose-600 italic">PREDICTOR</span> PRO
                  </h1>
                  <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-lg">
                    Next-generation match analysis powered by advanced Poisson modeling and Random Forest ML algorithms.
                  </p>
                </div>
                <TeamSelector onPredict={handlePredict} isLoading={isLoading} />
              </div>
            </section>

            {prediction && (
              <div className="space-y-24 animate-in fade-in duration-1000">
                {/* 1. Main Prediction Card */}
                <PredictionResult result={prediction} />

                {/* 2. AI Model Comparison */}
                <ModelComparison result={prediction} />

                {/* 3. Head-to-Head History */}
                <H2HHistory result={prediction} />

                {/* 4. Key Player Impact Analysis */}
                <KeyPlayerImpact result={prediction} />

                {/* 5. Goal Probability Analysis */}
                <GoalProbabilityAnalysis result={prediction} />

                {/* Secondary Analysis (Keeping for completeness) */}
                <div className="pt-12 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12 text-center">Contextual Statistics</p>
                  <div className="space-y-24">
                    <RecentForm result={prediction} />
                    <HomeAwayPerformance result={prediction} />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <PredictionHistory />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
