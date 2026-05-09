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

        # Calculate League Averages for Normalization
        # Total goals scored by home teams / Total matches
        league_home_goals_avg = self.df['homeScore'].mean()
        # Total goals scored by away teams / Total matches
        league_away_goals_avg = self.df['awayScore'].mean()

        # Calculate Attack Strength
        # Home Attack Strength = (Home Team Avg Scored at Home) / (League Home Avg Scored)
        home_attack_strength = home_avg_scored / league_home_goals_avg if league_home_goals_avg > 0 else 1.0
        # Away Attack Strength = (Away Team Avg Scored Away) / (League Away Avg Scored)
        away_attack_strength = away_avg_scored / league_away_goals_avg if league_away_goals_avg > 0 else 1.0

        # Calculate Defense Strength
        # Home Defense Strength = (Home Team Avg Conceded at Home) / (League Away Avg Scored)
        # Note: What home concedes is what away scores
        home_defense_strength = home_avg_conceded / league_away_goals_avg if league_away_goals_avg > 0 else 1.0
        # Away Defense Strength = (Away Team Avg Conceded Away) / (League Home Avg Scored)
        away_defense_strength = away_avg_conceded / league_home_goals_avg if league_home_goals_avg > 0 else 1.0

        # Poisson λ (expected goals)
        # lambda_home = Home Attack * Away Defense * League Home Avg
        lambda_home = home_attack_strength * away_defense_strength * league_home_goals_avg
        
        # lambda_away = Away Attack * Home Defense * League Away Avg
        lambda_away = away_attack_strength * home_defense_strength * league_away_goals_avg

        return {
            "home_team_stats": {
                "team": home_team,
                "matches_played": home_played,
                "avg_goals_scored": round(float(home_avg_scored), 3),
                "avg_goals_conceded": round(float(home_avg_conceded), 3),
                "attack_strength": round(float(home_attack_strength), 2),
                "defense_strength": round(float(home_defense_strength), 2)
            },
            "away_team_stats": {
                "team": away_team,
                "matches_played": away_played,
                "avg_goals_scored": round(float(away_avg_scored), 3),
                "avg_goals_conceded": round(float(away_avg_conceded), 3),
                "attack_strength": round(float(away_attack_strength), 2),
                "defense_strength": round(float(away_defense_strength), 2)
            },
            "lambda_values": {
                "lambda_home": round(float(lambda_home), 3),
                "lambda_away": round(float(lambda_away), 3)
            }
        }

