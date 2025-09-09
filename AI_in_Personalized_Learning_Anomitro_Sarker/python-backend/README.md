# Adaptive Quiz Python Backend

## Setup Instructions

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the FastAPI server:**
```bash
uvicorn main:app --reload
```

3. **API will be available at:** `http://localhost:8000`

## API Endpoints

- `POST /analyze-performance` - Analyze learner performance using ML
- `POST /select-question` - Select next question adaptively  
- `POST /generate-feedback` - Generate personalized feedback
- `POST /should-show-hint` - Decide whether to show hints
- `POST /update-profile` - Update learner profile
- `GET /` - Health check

## ML Features

- **Performance Analysis**: Uses LogisticRegression to classify learner state
- **Question Selection**: Uses RandomForestClassifier to predict optimal difficulty
- **Adaptive Feedback**: NLP-inspired personalized messaging
- **Hint System**: Smart hint recommendations based on performance patterns

## Frontend Integration

The React app automatically calls these APIs when available, with local fallbacks for offline mode.

Set `VITE_API_URL=http://localhost:8000` in your React app's environment.