const API_BASE_URL = 'http://localhost:8000/api';

export interface PredictionResult {
    home_team: string;
    away_team: string;
    predicted_score: string;
    probabilities: {
        home_win: number;
        draw: number;
        away_win: number;
    };
    poisson_probs: { home: number, draw: number, away: number };
    rf_probs: { home: number, draw: number, away: number };
    confidence: number;
    comparison: {
        agreement: 'HIGH' | 'MEDIUM' | 'LOW';
        variance: number;
        recommendation: string;
    };
    market_analysis: {
        over_1_5: number;
        over_2_5: number;
        btts: number;
    };
    performance_analysis: {
        home: TeamPerformance;
        away: TeamPerformance;
    };
    form_analysis: {
        home: TeamStats & { points: number, label: string };
        away: TeamStats & { points: number, label: string };
        momentum_gap: number;
    };
    insights: {
        poisson: string;
        predictor: string;
    };
    h2h_history: any[];
    player_impact?: {
        home_key_player: {
            top_scorer: string;
            goals: number;
            key_injured: boolean;
        };
        away_key_player: {
            top_scorer: string;
            goals: number;
            key_injured: boolean;
        };
        home_injured: boolean;
        away_injured: boolean;
        insight: string;
    };
}

export interface TeamPerformance {
    avg_scored: number;
    avg_conceded: number;
    played: number;
    lambda: number;
    strength: 'STRONG' | 'AVERAGE' | 'WEAK';
}

export interface TeamStats {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_scored: number;
    goals_conceded: number;
    match_history: any[];
}

export const api = {
    getTeams: async (): Promise<string[]> => {
        const response = await fetch(`${API_BASE_URL}/teams`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();
        return data.teams;
    },

    predictMatch: async (homeTeam: string, awayTeam: string): Promise<PredictionResult> => {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam }),
        });
        if (!response.ok) throw new Error('Failed to get prediction');
        return response.json();
    },

    getHistory: async (): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/history`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    }
};
