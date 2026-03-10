import json
import os

class RecentFormAnalyzer:
    def __init__(self, data_path):
        self.data_path = data_path
        self.matches = self._load_data()

    def _load_data(self):
        if not os.path.exists(self.data_path):
            return []
        with open(self.data_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_team_form(self, team, last_n=5):
        team_matches = []
        for m in reversed(self.matches):
            if m['homeTeam'] == team or m['awayTeam'] == team:
                is_home = m['homeTeam'] == team
                score = f"{m['homeScore']}-{m['awayScore']}"
                if m['homeScore'] == m['awayScore']: outcome = "Draw"
                elif (is_home and m['homeScore'] > m['awayScore']) or (not is_home and m['awayScore'] > m['homeScore']):
                    outcome = "Win"
                else: outcome = "Loss"
                
                team_matches.append({
                    "date": m['date'],
                    "opponent": m['awayTeam'] if is_home else m['homeTeam'],
                    "venue": "Home" if is_home else "Away",
                    "score": score,
                    "outcome": outcome,
                    "goals_scored": m['homeScore'] if is_home else m['awayScore'],
                    "goals_conceded": m['awayScore'] if is_home else m['homeScore']
                })
            if len(team_matches) >= last_n: break
            
        stats = {"wins": 0, "draws": 0, "losses": 0, "goals_scored": 0, "goals_conceded": 0, "match_history": team_matches}
        for m in team_matches:
            if m['outcome'] == "Win": stats["wins"] += 1
            elif m['outcome'] == "Draw": stats["draws"] += 1
            else: stats["losses"] += 1
            stats["goals_scored"] += m['goals_scored']
            stats["goals_conceded"] += m['goals_conceded']
            
        stats["played"] = len(team_matches)
        return stats
