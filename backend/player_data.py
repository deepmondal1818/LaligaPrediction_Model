import random

# Mock database of key players and injuries for LaLiga teams
PLAYER_DATA = {
    "Real Madrid": {"top_scorer": "Jude Bellingham", "goals": 16, "key_injured": False},
    "Barcelona": {"top_scorer": "Robert Lewandowski", "goals": 14, "key_injured": False},
    "Atlético Madrid": {"top_scorer": "Antoine Griezmann", "goals": 13, "key_injured": False},
    "Athletic Club": {"top_scorer": "Gorka Guruzeta", "goals": 11, "key_injured": False},
    "Real Sociedad": {"top_scorer": "Mikel Oyarzabal", "goals": 9, "key_injured": False},
    "Villarreal": {"top_scorer": "Gerard Moreno", "goals": 10, "key_injured": False},
    "Real Betis": {"top_scorer": "Willian José", "goals": 10, "key_injured": False},
    "Valencia": {"top_scorer": "Hugo Duro", "goals": 12, "key_injured": False},
    "Sevilla": {"top_scorer": "Youssef En-Nesyri", "goals": 11, "key_injured": False},
    "Girona": {"top_scorer": "Artem Dovbyk", "goals": 17, "key_injured": False},
    "Celta Vigo": {"top_scorer": "Jørgen Strand Larsen", "goals": 11, "key_injured": False},
    "Osasuna": {"top_scorer": "Ante Budimir", "goals": 15, "key_injured": False},
    "Alavés": {"top_scorer": "Samu Omorodion", "goals": 8, "key_injured": False},
    "Getafe": {"top_scorer": "Borja Mayoral", "goals": 15, "key_injured": False},
    "Mallorca": {"top_scorer": "Vedat Muriqi", "goals": 5, "key_injured": False},
    "Las Palmas": {"top_scorer": "Kirian Rodríguez", "goals": 6, "key_injured": False},
    "Rayo Vallecano": {"top_scorer": "Álvaro García", "goals": 6, "key_injured": False},
    "Cádiz": {"top_scorer": "Chris Ramos", "goals": 5, "key_injured": False},
    "Almería": {"top_scorer": "Sergio Arribas", "goals": 6, "key_injured": False},
    "Granada": {"top_scorer": "Myrto Uzuni", "goals": 8, "key_injured": False}
}

def get_player_stats(team_name: str):
    """Returns player stats, randomly generating an injury to a key player 15% of the time."""
    data = PLAYER_DATA.get(team_name, {"top_scorer": "Unknown", "goals": 0, "key_injured": False}).copy()
    
    # Simulate a dynamic 15% chance that the top scorer is injured for this specific prediction
    is_injured = random.random() < 0.15
    data["key_injured"] = is_injured
    
    return data
