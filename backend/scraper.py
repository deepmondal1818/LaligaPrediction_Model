import json
import os
import random
from datetime import datetime, timedelta

def generate_realistic_mock_data():
    teams = {
        "Real Madrid": {"attack": 2.2, "defense": 0.8},
        "Barcelona": {"attack": 2.0, "defense": 1.0},
        "Atlético Madrid": {"attack": 1.6, "defense": 0.9},
        "Athletic Club": {"attack": 1.5, "defense": 1.1},
        "Real Sociedad": {"attack": 1.4, "defense": 1.2},
        "Villarreal": {"attack": 1.5, "defense": 1.4},
        "Real Betis": {"attack": 1.3, "defense": 1.3},
        "Valencia": {"attack": 1.2, "defense": 1.2},
        "Sevilla": {"attack": 1.4, "defense": 1.5},
        "Girona": {"attack": 1.8, "defense": 1.6},
        "Celta Vigo": {"attack": 1.1, "defense": 1.5},
        "Osasuna": {"attack": 1.0, "defense": 1.3},
        "Alavés": {"attack": 0.9, "defense": 1.2},
        "Getafe": {"attack": 1.0, "defense": 1.4},
        "Mallorca": {"attack": 0.8, "defense": 1.1},
        "Las Palmas": {"attack": 0.9, "defense": 1.3},
        "Rayo Vallecano": {"attack": 1.1, "defense": 1.6},
        "Cádiz": {"attack": 0.7, "defense": 1.5},
        "Almería": {"attack": 1.0, "defense": 2.0},
        "Granada": {"attack": 1.0, "defense": 1.9}
    }

    matches = []
    base_date = datetime.now() - timedelta(days=365) # 1 year of data

    match_id = 0
    # Simulate a full season (each team plays each other twice)
    team_names = list(teams.keys())
    for home in team_names:
        for away in team_names:
            if home == away:
                continue

            # Calculate probabilities based on team strengths
            h_attack = teams[home]["attack"]
            h_defense = teams[home]["defense"]
            a_attack = teams[away]["attack"]
            a_defense = teams[away]["defense"]

            # Simple expected goals formula
            # Home team gets a 1.2x advantage
            h_xg = (h_attack + a_defense) / 2 * 1.2
            a_xg = (a_attack + h_defense) / 2 * 0.8

            # Randomize slightly around xG using numpy-like logic but with standard random
            # Convert xG to actual goals using a simplified normal distribution clamp
            def get_goals(xg):
                base = int(xg)
                dec = xg - base
                if random.random() < dec:
                    base += 1
                
                # Add some football variance (rarely +1 or -1)
                variance = random.random()
                if variance > 0.85: base += 1
                elif variance < 0.15 and base > 0: base -= 1
                
                return max(0, min(base, 6)) # Cap goals at 6

            h_score = get_goals(h_xg)
            a_score = get_goals(a_xg)

            match_date = base_date + timedelta(days=random.randint(0, 360))

            matches.append({
                "id": f"2023-2024-{match_id}",
                "homeTeam": home,
                "awayTeam": away,
                "homeScore": h_score,
                "awayScore": a_score,
                "date": match_date.strftime("%Y-%m-%d"),
                "season": "2023-2024"
            })
            match_id += 1

    # Sort by date
    matches.sort(key=lambda x: x["date"])
    return matches

def main():
    print("Generating Intelligent Historical LaLiga Match Data...")
    
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)
    data_dir = os.path.join(project_root, 'src', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    data_path = os.path.join(data_dir, 'matches-all-seasons.json')
    
    all_matches = generate_realistic_mock_data()

    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(all_matches, f, indent=2)
    
    print(f"Update complete! Successfully saved {len(all_matches)} realistic historical matches to {data_path}")

if __name__ == "__main__":
    main()

