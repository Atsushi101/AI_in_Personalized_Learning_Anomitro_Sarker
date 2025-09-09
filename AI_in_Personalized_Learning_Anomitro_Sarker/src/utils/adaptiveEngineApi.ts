import { Question, Response, LearnerProfile, QuizState } from '@/types/quiz';
import { ApiService } from '@/services/apiService';
import { AdaptiveEngine } from './adaptiveEngine';

export class AdaptiveEngineApi {
  static async analyzeLearnerState(responses: Response[]): Promise<{
    state: 'struggling' | 'normal' | 'advanced';
    accuracy: number;
    avgResponseTime: number;
    streak: number;
  }> {
    try {
      return await ApiService.analyzePerformance(responses);
    } catch (error) {
      console.warn('API unavailable, using local fallback:', error);
      // Fallback to local implementation
      const accuracy = AdaptiveEngine.calculateAccuracy(responses);
      const avgResponseTime = responses.length > 0 
        ? responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length 
        : 0;
      const streak = AdaptiveEngine.calculateStreak(responses);
      
      let state: 'struggling' | 'normal' | 'advanced' = 'normal';
      if (accuracy < 0.6 || avgResponseTime > 15) state = 'struggling';
      else if (accuracy >= 0.85 && avgResponseTime < 8) state = 'advanced';
      
      return { state, accuracy, avgResponseTime, streak };
    }
  }

  static async selectNextQuestion(
    availableQuestions: Question[],
    responses: Response[],
    currentDifficulty?: string
  ): Promise<Question> {
    try {
      return await ApiService.selectNextQuestion(availableQuestions, responses, currentDifficulty);
    } catch (error) {
      console.warn('API unavailable, using local fallback:', error);
      const learnerState = AdaptiveEngine.analyzeLearnerState(responses);
      return AdaptiveEngine.selectNextQuestion(availableQuestions, responses, learnerState);
    }
  }

  static async generateFeedback(
    isCorrect: boolean,
    responseTime: number,
    question: Question,
    learnerState: string
  ): Promise<string> {
    try {
      return await ApiService.generateFeedback(isCorrect, responseTime, question, learnerState);
    } catch (error) {
      console.warn('API unavailable, using local fallback:', error);
      const response: Response = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        questionId: question.id,
        selectedAnswer: '',
        correct: isCorrect,
        responseTime,
        difficulty: question.difficulty,
        hintUsed: false
      };
      return AdaptiveEngine.generateFeedback(response, question, learnerState as 'struggling' | 'normal' | 'advanced');
    }
  }

  static async shouldShowHint(responses: Response[], currentQuestion: Question): Promise<boolean> {
    try {
      return await ApiService.shouldShowHint(responses, currentQuestion);
    } catch (error) {
      console.warn('API unavailable, using local fallback:', error);
      const state = AdaptiveEngine.analyzeLearnerState(responses);
      const avgResponseTime = responses.length > 0 
        ? responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length 
        : 0;
      return AdaptiveEngine.shouldShowHint(state, avgResponseTime);
    }
  }

  static async updateLearnerProfile(
    profile: LearnerProfile,
    newResponse: Response
  ): Promise<LearnerProfile> {
    try {
      return await ApiService.updateLearnerProfile(profile, newResponse);
    } catch (error) {
      console.warn('API unavailable, using local fallback:', error);
      const analysis = AdaptiveEngine.analyzeLearnerState([newResponse]);
      return AdaptiveEngine.updateLearnerProfile(profile, newResponse, [newResponse]);
    }
  }
}