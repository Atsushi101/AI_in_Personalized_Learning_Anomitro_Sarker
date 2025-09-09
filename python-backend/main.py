"""
FastAPI backend for Adaptive Quiz with ML-powered recommendations
Install: pip install fastapi uvicorn scikit-learn pandas numpy sentence-transformers
Run: uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from datetime import datetime
import json

app = FastAPI(title="Adaptive Quiz API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Response(BaseModel):
    questionId: str
    selected: str
    correct: bool
    responseTime: float
    difficulty: str
    timestamp: str

class Question(BaseModel):
    id: str
    difficulty: str
    question: str
    options: List[str]
    correct: str
    hint: str
    explanation: str

class LearnerProfile(BaseModel):
    name: str
    totalQuestions: int
    correctAnswers: int
    currentStreak: int
    longestStreak: int
    averageResponseTime: float
    currentState: str
    strengthAreas: List[str]
    improvementAreas: List[str]

# ML Models (initialize with dummy data)
performance_model = LogisticRegression()
difficulty_model = RandomForestClassifier(n_estimators=10, random_state=42)

# Initialize models with dummy data
dummy_X = np.array([[0.5, 10.0, 2], [0.8, 5.0, 5], [0.3, 20.0, 1]])
dummy_y_perf = np.array([0, 1, 0])  # struggling, advanced, struggling
dummy_y_diff = np.array([0, 2, 0])  # easy, hard, easy

performance_model.fit(dummy_X, dummy_y_perf)
difficulty_model.fit(dummy_X, dummy_y_diff)

@app.post("/analyze-performance")
async def analyze_performance(data: Dict[str, List[Response]]):
    """Analyze learner performance using ML models"""
    responses = data["responses"]
    
    if not responses:
        return {
            "state": "normal",
            "accuracy": 0.0,
            "avgResponseTime": 0.0,
            "streak": 0
        }
    
    # Calculate metrics
    recent_responses = responses[-5:] if len(responses) >= 5 else responses
    accuracy = sum(1 for r in recent_responses if r.correct) / len(recent_responses)
    avg_time = sum(r.responseTime for r in recent_responses) / len(recent_responses)
    
    # Calculate streak
    streak = 0
    for r in reversed(responses):
        if r.correct:
            streak += 1
        else:
            break
    
    # Use ML model to predict state
    features = np.array([[accuracy, avg_time, streak]])
    try:
        state_pred = performance_model.predict(features)[0]
        state_map = {0: "struggling", 1: "normal", 2: "advanced"}
        predicted_state = state_map.get(state_pred, "normal")
    except:
        # Fallback logic
        if accuracy < 0.6 or avg_time > 15:
            predicted_state = "struggling"
        elif accuracy >= 0.85 and avg_time < 8:
            predicted_state = "advanced"
        else:
            predicted_state = "normal"
    
    return {
        "state": predicted_state,
        "accuracy": accuracy,
        "avgResponseTime": avg_time,
        "streak": streak
    }

@app.post("/select-question")
async def select_question(data: Dict[str, Any]):
    """Select next question using adaptive logic and ML"""
    available_questions = data["availableQuestions"]
    responses = data["responses"]
    current_difficulty = data.get("currentDifficulty")
    
    if not available_questions:
        return None
    
    # Analyze performance first
    perf_analysis = await analyze_performance({"responses": responses})
    learner_state = perf_analysis["state"]
    
    # Filter questions based on adaptive logic
    if learner_state == "struggling":
        preferred_difficulties = ["easy", "medium"]
    elif learner_state == "advanced":
        preferred_difficulties = ["medium", "hard"]
    else:
        preferred_difficulties = ["easy", "medium", "hard"]
    
    # Filter available questions
    suitable_questions = [
        q for q in available_questions 
        if q["difficulty"] in preferred_difficulties
    ]
    
    if not suitable_questions:
        suitable_questions = available_questions
    
    # Use ML model to score questions (simplified)
    if len(responses) >= 3:
        try:
            accuracy = perf_analysis["accuracy"]
            avg_time = perf_analysis["avgResponseTime"]
            streak = perf_analysis["streak"]
            
            features = np.array([[accuracy, avg_time, streak]])
            difficulty_scores = difficulty_model.predict_proba(features)[0]
            
            # Map scores to difficulties
            diff_map = {0: "easy", 1: "medium", 2: "hard"}
            best_difficulty = diff_map[np.argmax(difficulty_scores)]
            
            # Prefer questions of the predicted difficulty
            best_questions = [q for q in suitable_questions if q["difficulty"] == best_difficulty]
            if best_questions:
                suitable_questions = best_questions
        except:
            pass  # Use filtered questions if ML fails
    
    # Return random question from suitable ones
    import random
    return random.choice(suitable_questions)

@app.post("/generate-feedback")
async def generate_feedback(data: Dict[str, Any]):
    """Generate personalized feedback using NLP-inspired logic"""
    is_correct = data["isCorrect"]
    response_time = data["responseTime"]
    question = data["question"]
    learner_state = data["learnerState"]
    
    # Base feedback
    if is_correct:
        if response_time < 5:
            base_feedback = "Excellent! Lightning fast response!"
        elif response_time < 10:
            base_feedback = "Great job! You got it right!"
        else:
            base_feedback = "Correct! Take your time to think through the problem."
    else:
        if response_time < 5:
            base_feedback = "Not quite right. Take a moment to read the question carefully."
        else:
            base_feedback = "Close! Review the concept and try similar problems."
    
    # Personalized addition based on learner state
    if learner_state == "struggling":
        encouragement = " Remember, every expert was once a beginner. Keep practicing!"
    elif learner_state == "advanced":
        encouragement = " You're doing great! Ready for more challenging problems?"
    else:
        encouragement = " You're making good progress!"
    
    return {"feedback": base_feedback + encouragement}

@app.post("/should-show-hint")
async def should_show_hint(data: Dict[str, Any]):
    """Decide whether to show hint using ML logic"""
    responses = data["responses"]
    current_question = data["currentQuestion"]
    
    if not responses:
        return {"showHint": False}
    
    # Analyze recent performance
    recent_responses = responses[-3:] if len(responses) >= 3 else responses
    recent_accuracy = sum(1 for r in recent_responses if r.correct) / len(recent_responses)
    
    # Show hint if struggling or if question is hard and accuracy is low
    show_hint = (
        recent_accuracy < 0.5 or 
        (current_question["difficulty"] == "hard" and recent_accuracy < 0.7)
    )
    
    return {"showHint": show_hint}

@app.post("/update-profile")
async def update_profile(data: Dict[str, Any]):
    """Update learner profile with new response"""
    profile = data["profile"]
    new_response = data["newResponse"]
    
    # Update basic stats
    profile["totalQuestions"] += 1
    if new_response["correct"]:
        profile["correctAnswers"] += 1
        profile["currentStreak"] += 1
        profile["longestStreak"] = max(profile["longestStreak"], profile["currentStreak"])
    else:
        profile["currentStreak"] = 0
    
    # Update average response time
    total_time = profile["averageResponseTime"] * (profile["totalQuestions"] - 1)
    profile["averageResponseTime"] = (total_time + new_response["responseTime"]) / profile["totalQuestions"]
    
    # Update state (simplified)
    accuracy = profile["correctAnswers"] / profile["totalQuestions"]
    if accuracy < 0.6:
        profile["currentState"] = "struggling"
    elif accuracy >= 0.85:
        profile["currentState"] = "advanced"
    else:
        profile["currentState"] = "normal"
    
    return profile

@app.get("/")
async def root():
    return {"message": "Adaptive Quiz API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)