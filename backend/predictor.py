import json
import os
import math
from form_analyzer import RecentFormAnalyzer
from poisson_model import PoissonPerformanceModel
from rf_model import RandomForestModel

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(PROJECT_ROOT, 'src/data/matches-all-seasons.json')

class PredictionEngine:
    def __init__(self):
        self.matches = []
        self.load_data()

    def load_data(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                raw = json.load(f)
                for m in raw:
                    m['homeTeam'] = " ".join(m['homeTeam'].replace('\n', ' ').split()).strip()
                    m['awayTeam'] = " ".join(m['awayTeam'].replace('\n', ' ').split()).strip()
                self.matches = raw
            self.analyzer = RecentFormAnalyzer(DATA_FILE)
            self.poisson_model = PoissonPerformanceModel(DATA_FILE)
            self.rf_model = RandomForestModel(DATA_FILE)
        else:
            self.matches = []
            self.analyzer = None
            self.poisson_model = None
            self.rf_model = None

    def get_teams(self):
        teams = set()
        for m in self.matches:
            teams.add(m['homeTeam'])
            teams.add(m['awayTeam'])
        return sorted(list(teams))

    def predict_match(self, home_team, away_team):
        if not self.poisson_model or not self.analyzer:
            return {"error": "Engine not ready"}

        # Poisson logic
        stats = self.poisson_model.get_performance_stats(home_team, away_team)
        if "error" in stats: return stats
        
        lh, la = stats['lambda_values']['lambda_home'], stats['lambda_values']['lambda_away']
        
        def poisson(k, lam): return (lam**k * math.exp(-lam)) / math.factorial(k)
        
        hw, d, aw = 0, 0, 0
        most_likely = (0, 0)
        max_p = 0
        
        for i in range(6):
            for j in range(6):
                p = poisson(i, lh) * poisson(j, la)
                if i > j: hw += p
                elif i == j: d += p
                else: aw += p
                if p > max_p: max_p, most_likely = p, (i, j)

        # Normalize Poisson
        total_p = hw + d + aw
        p_probs = {
            "home": round(hw/total_p * 100, 1),
            "draw": round(d/total_p * 100, 1),
            "away": round(aw/total_p * 100, 1)
        }
        
        # RF Prediction
        rf_result = self.rf_model.predict(home_team, away_team) if self.rf_model else None
        rf_probs = {
            "home": rf_result['home_win'] if rf_result else p_probs['home'],
            "draw": rf_result['draw'] if rf_result else p_probs['draw'],
            "away": rf_result['away_win'] if rf_result else p_probs['away']
        }
        
        # Model Comparison Logic
        diff = abs(p_probs['home'] - rf_probs['home']) + abs(p_probs['away'] - rf_probs['away'])
        variance = round(diff / 2, 1)
        agreement = "HIGH" if variance < 5 else "MEDIUM" if variance < 15 else "LOW"

        # Market Probabilities (Simulated based on Poisson)
        over_1_5 = round((1 - poisson(0, lh+la) - poisson(1, lh+la)) * 100, 1)
        over_2_5 = round(over_1_5 * 0.8, 1) # Simple scaling for simulation
        btts = round((1 - poisson(0, lh)) * (1 - poisson(0, la)) * 100, 1)

        # Form Analysis
        h_form = self.analyzer.get_team_form(home_team)
        a_form = self.analyzer.get_team_form(away_team)
        
        def get_points(form):
            pts = 0
            for m in form['match_history']:
                if m['outcome'] == "Win": pts += 3
                elif m['outcome'] == "Draw": pts += 1
            return pts

        h_pts = get_points(h_form)
        a_pts = get_points(a_form)

        return {
            "home_team": home_team,
            "away_team": away_team,
            "predicted_score": f"{most_likely[0]} - {most_likely[1]}",
            "probabilities": {
                "home_win": rf_probs['home'],
                "draw": rf_probs['draw'],
                "away_win": rf_probs['away']
            },
            "poisson_probs": p_probs,
            "rf_probs": rf_probs,
            "confidence": round(max_p * 100 + 30, 1),
            "comparison": {
                "agreement": agreement,
                "variance": variance,
                "recommendation": "Primary: Poisson Distribution" if agreement == "HIGH" else "Hybrid Analysis"
            },
            "market_analysis": {
                "over_1_5": over_1_5,
                "over_2_5": over_2_5,
                "btts": btts
            },
            "performance_analysis": {
                "home": {
                    "avg_scored": stats['home_team_stats']['avg_goals_scored'],
                    "avg_conceded": stats['home_team_stats']['avg_goals_conceded'],
                    "played": stats['home_team_stats']['matches_played'],
                    "lambda": lh,
                    "strength": "STRONG" if stats['home_team_stats']['avg_goals_scored'] > 1.8 else "WEAK"
                },
                "away": {
                    "avg_scored": stats['away_team_stats']['avg_goals_scored'],
                    "avg_conceded": stats['away_team_stats']['avg_goals_conceded'],
                    "played": stats['away_team_stats']['matches_played'],
                    "lambda": la,
                    "strength": "STRONG" if stats['away_team_stats']['avg_goals_scored'] > 1.5 else "WEAK"
                }
            },
            "form_analysis": {
                "home": {**h_form, "points": h_pts, "label": "GOOD FORM" if h_pts >= 10 else "POOR FORM"},
                "away": {**a_form, "points": a_pts, "label": "EXCELLENT FORM" if a_pts >= 12 else "STABLE FORM"},
                "momentum_gap": h_pts - a_pts
            },
            "insights": {
                "poisson": f"Based on Poisson analysis, {home_team} has an expected goal value of {lh:.2f} at home, while {away_team} is expected to score {la:.2f} as the visitor.",
                "predictor": f"{away_team if a_pts > h_pts else home_team} is currently in a superior run of form."
            }
        }
