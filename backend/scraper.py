import json
import os
import random
from datetime import datetime

def main():
    print("Simulating FBref Scraper for LaLiga (2014-2025)...")
    
    # Path to save the data
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(backend_dir)
    data_dir = os.path.join(project_root, 'src', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    data_path = os.path.join(data_dir, 'matches-all-seasons.json')
    
    # In a real scenario, this would scrape FBref. 
    # For restoration, if the file exists, we keep it. If not, we seed it with some mock historical data.
    if os.path.exists(data_path):
        print(f"Data file already exists at {data_path}. Skipping seed.")
        return

    # Seed with some example teams for the UI to work initially
    teams = ["Real Madrid", "Barcelona", "Atlético Madrid", "Athletic Club", "Real Sociedad", "Villarreal", "Real Betis", "Valencia", "Sevilla", "Girona"]
    
    mock_matches = []
    for i in range(100):
        h, a = random.sample(teams, 2)
        h_score = random.randint(0, 4)
        a_score = random.randint(0, 3)
        mock_matches.append({
            "id": f"seed-{i}",
            "homeTeam": h,
            "awayTeam": a,
            "homeScore": h_score,
            "awayScore": a_score,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "season": "2024-2025"
        })
        
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(mock_matches, f, indent=2)
    
    print(f"Scraper simulation complete. Seeded {len(mock_matches)} matches to {data_path}")

if __name__ == "__main__":
    main()
