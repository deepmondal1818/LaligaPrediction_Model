from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import scraper
from predictor import PredictionEngine

app = FastAPI(title="LaLiga Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = PredictionEngine()

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str

@app.get("/api/teams")
def get_teams():
    return {"teams": engine.get_teams()}

@app.post("/api/predict")
def predict_match(request: PredictionRequest):
    try:
        return engine.predict_match(request.home_team, request.away_team)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/refresh")
def refresh():
    scraper.main()
    engine.load_data()
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
