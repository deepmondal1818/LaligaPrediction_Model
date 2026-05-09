from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import scraper
from predictor import PredictionEngine
from database import init_db, get_db, MatchPrediction
from sqlalchemy.orm import Session
from fastapi import Depends

app = FastAPI(title="LaLiga Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

engine = PredictionEngine()

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str

@app.get("/api/teams")
def get_teams():
    return {"teams": engine.get_teams()}

@app.post("/api/predict")
def predict_match(request: PredictionRequest, db: Session = Depends(get_db)):
    try:
        result = engine.predict_match(request.home_team, request.away_team)
        
        # Save prediction to history
        db_prediction = MatchPrediction(
            home_team=result['home_team'],
            away_team=result['away_team'],
            predicted_score=result['predicted_score'],
            home_win_prob=result['probabilities']['home_win'],
            draw_prob=result['probabilities']['draw'],
            away_win_prob=result['probabilities']['away_win'],
            confidence=result['confidence']
        )
        db.add(db_prediction)
        db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    predictions = db.query(MatchPrediction).order_by(MatchPrediction.created_at.desc()).limit(20).all()
    return predictions

@app.post("/api/refresh")
def refresh():
    scraper.main()
    engine.load_data()
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
