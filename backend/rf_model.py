import pandas as pd
import numpy as np
import json
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

class RandomForestModel:
    def __init__(self, data_path):
        self.data_path = data_path
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.le_teams = LabelEncoder()
        self.is_trained = False
        self.train()

    def _prepare_data(self):
        if not os.path.exists(self.data_path):
            return None, None
            
        with open(self.data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        if df.empty: return None, None
        
        df['homeTeam'] = df['homeTeam'].str.strip()
        df['awayTeam'] = df['awayTeam'].str.strip()
        df['date_dt'] = pd.to_datetime(df['date'], errors='coerce')
        df = df.dropna(subset=['date_dt']).sort_values('date_dt')
        
        def get_result(row):
            if row['homeScore'] > row['awayScore']: return 2
            if row['homeScore'] < row['awayScore']: return 0
            return 1
        
        df['result'] = df.apply(get_result, axis=1)
        all_teams = sorted(list(set(df['homeTeam']) | set(df['awayTeam'])))
        self.le_teams.fit(all_teams)
        
        df['home_id'] = self.le_teams.transform(df['homeTeam'])
        df['away_id'] = self.le_teams.transform(df['awayTeam'])
        
        for team in all_teams:
            team_df = df[(df['homeTeam'] == team) | (df['awayTeam'] == team)].copy()
            team_df['scored'] = np.where(team_df['homeTeam'] == team, team_df['homeScore'], team_df['awayScore'])
            team_df['conceded'] = np.where(team_df['homeTeam'] == team, team_df['awayScore'], team_df['homeScore'])
            team_df['roll_gf'] = team_df['scored'].shift(1).rolling(5, min_periods=1).mean().fillna(1.5)
            team_df['roll_ga'] = team_df['conceded'].shift(1).rolling(5, min_periods=1).mean().fillna(1.2)
            
            for idx, row in team_df.iterrows():
                if row['homeTeam'] == team:
                    df.at[idx, 'home_roll_gf'] = row['roll_gf']
                    df.at[idx, 'home_roll_ga'] = row['roll_ga']
                else:
                    df.at[idx, 'away_roll_gf'] = row['roll_gf']
                    df.at[idx, 'away_roll_ga'] = row['roll_ga']
        
        features = ['home_id', 'away_id', 'home_roll_gf', 'home_roll_ga', 'away_roll_gf', 'away_roll_ga']
        df = df.dropna(subset=features)
        return df[features], df['result']

    def train(self):
        X, y = self._prepare_data()
        if X is not None and not X.empty:
            self.model.fit(X, y)
            self.is_trained = True

    def predict(self, home_team, away_team):
        if not self.is_trained: return None
        try:
            h_id = self.le_teams.transform([home_team])[0]
            a_id = self.le_teams.transform([away_team])[0]
            
            # Use some defaults for simulation if data is sparse
            X_input = pd.DataFrame([{
                'home_id': h_id, 'away_id': a_id,
                'home_roll_gf': 1.8, 'home_roll_ga': 1.0,
                'away_roll_gf': 1.4, 'away_roll_ga': 1.3
            }])
            
            probs = self.model.predict_proba(X_input)[0]
            return {
                "home_win": round(probs[2] * 100, 1),
                "draw": round(probs[1] * 100, 1),
                "away_win": round(probs[0] * 100, 1)
            }
        except: return None
