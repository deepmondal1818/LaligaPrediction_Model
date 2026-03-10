import pandas as pd
import json
import os

class PoissonPerformanceModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.df = self._load_and_clean_data()

    def _load_and_clean_data(self):
        if not os.path.exists(self.data_path):
            return pd.DataFrame()
            
        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        df = pd.DataFrame(data)
        if not df.empty:
            df['homeTeam'] = df['homeTeam'].str.replace(r'\n', ' ', regex=True).str.strip()
            df['awayTeam'] = df['awayTeam'].str.replace(r'\n', ' ', regex=True).str.strip()
        return df

    def get_performance_stats(self, home_team, away_team):
        if self.df.empty:
            return {"error": "No data available"}

        # Home team performance only in home matches
        home_matches = self.df[self.df['homeTeam'] == home_team]
        home_played = len(home_matches)
        
        if home_played == 0:
            return {"error": f"No home match data found for team: {home_team}"}
            
        home_avg_scored = home_matches['homeScore'].mean()
        home_avg_conceded = home_matches['awayScore'].mean()

        # Away team performance only in away matches
        away_matches = self.df[self.df['awayTeam'] == away_team]
        away_played = len(away_matches)
        
        if away_played == 0:
            return {"error": f"No away match data found for team: {away_team}"}
            
        away_avg_scored = away_matches['awayScore'].mean()
        away_avg_conceded = away_matches['homeScore'].mean()

        # Poisson λ (expected goals)
        lambda_home = home_avg_scored * away_avg_conceded
        lambda_away = away_avg_scored * home_avg_conceded

        return {
            "home_team_stats": {
                "team": home_team,
                "matches_played": home_played,
                "avg_goals_scored": round(float(home_avg_scored), 3),
                "avg_goals_conceded": round(float(home_avg_conceded), 3)
            },
            "away_team_stats": {
                "team": away_team,
                "matches_played": away_played,
                "avg_goals_scored": round(float(away_avg_scored), 3),
                "avg_goals_conceded": round(float(away_avg_conceded), 3)
            },
            "lambda_values": {
                "lambda_home": round(float(lambda_home), 3),
                "lambda_away": round(float(lambda_away), 3)
            }
        }
