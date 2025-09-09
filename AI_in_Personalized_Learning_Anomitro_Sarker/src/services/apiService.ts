import { Question, Response, LearnerProfile, QuizState } from '@/types/quiz';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiService {
  static async analyzePerformance(responses: Response[]): Promise<{
    state: 'struggling' | 'normal' | 'advanced';
    accuracy: number;
    avgResponseTime: number;
    streak: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/analyze-performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses })
    });
    return response.json();
  }

  static async selectNextQuestion(
    availableQuestions: Question[],
    responses: Response[],
    currentDifficulty?: string
  ): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/select-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ availableQuestions, responses, currentDifficulty })
    });
    return response.json();
  }

  static async generateFeedback(
    isCorrect: boolean,
    responseTime: number,
    question: Question,
    learnerState: string
  ): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/generate-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCorrect, responseTime, question, learnerState })
    });
    const data = await response.json();
    return data.feedback;
  }

  static async shouldShowHint(
    responses: Response[],
    currentQuestion: Question
  ): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/should-show-hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses, currentQuestion })
    });
    const data = await response.json();
    return data.showHint;
  }

  static async updateLearnerProfile(
    profile: LearnerProfile,
    newResponse: Response
  ): Promise<LearnerProfile> {
    const response = await fetch(`${API_BASE_URL}/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, newResponse })
    });
    return response.json();
  }

  // Fallback methods for offline mode
  static getFallbackQuestion(availableQuestions: Question[]): Question {
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }

  static getFallbackFeedback(isCorrect: boolean): string {
    return isCorrect 
      ? "Great job! Keep up the good work!" 
      : "Don't worry, practice makes perfect!";
  }
}