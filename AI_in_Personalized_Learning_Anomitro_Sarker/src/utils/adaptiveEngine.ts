import { Response, LearnerProfile, Question } from '@/types/quiz';

export class AdaptiveEngine {
  static analyzeLearnerState(responses: Response[], windowSize: number = 5): LearnerProfile['learnerState'] {
    if (responses.length === 0) return 'new';
    
    const recentResponses = responses.slice(-windowSize);
    const accuracy = recentResponses.filter(r => r.correct).length / recentResponses.length;
    const avgResponseTime = recentResponses.reduce((sum, r) => sum + r.responseTime, 0) / recentResponses.length;
    
    // Enhanced rule-based classification with more granular analysis
    const streakLength = this.calculateStreak(responses);
    const hintUsageRate = recentResponses.filter(r => r.hintUsed).length / recentResponses.length;
    
    // Struggling: low accuracy, slow responses, or high hint usage
    if (accuracy < 0.6 || avgResponseTime > 25 || hintUsageRate > 0.6) return 'struggling';
    
    // Advanced: high accuracy, fast responses, low hint usage, and good streak
    if (accuracy >= 0.85 && avgResponseTime < 10 && hintUsageRate < 0.2 && streakLength >= 3) return 'advanced';
    
    return 'normal';
  }

  static calculateAccuracy(responses: Response[]): number {
    if (responses.length === 0) return 0;
    return responses.filter(r => r.correct).length / responses.length;
  }

  static calculateStreak(responses: Response[]): number {
    if (responses.length === 0) return 0;
    
    let streak = 0;
    for (let i = responses.length - 1; i >= 0; i--) {
      if (responses[i].correct) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  static selectNextQuestion(
    availableQuestions: Question[], 
    responses: Response[], 
    learnerState: LearnerProfile['learnerState']
  ): Question | null {
    if (availableQuestions.length === 0) return null;

    // Get answered question IDs
    const answeredIds = new Set(responses.map(r => r.questionId));
    const unansweredQuestions = availableQuestions.filter(q => !answeredIds.has(q.id));
    
    if (unansweredQuestions.length === 0) return null;

    // Select difficulty based on learner state
    let preferredDifficulties: string[] = [];
    
    switch (learnerState) {
      case 'struggling':
        preferredDifficulties = ['easy', 'medium', 'hard'];
        break;
      case 'normal':
        preferredDifficulties = ['medium', 'easy', 'hard'];
        break;
      case 'advanced':
        preferredDifficulties = ['hard', 'medium', 'easy'];
        break;
      default:
        preferredDifficulties = ['easy', 'medium', 'hard'];
    }

    // Find question with preferred difficulty
    for (const difficulty of preferredDifficulties) {
      const questionsOfDifficulty = unansweredQuestions.filter(q => q.difficulty === difficulty);
      if (questionsOfDifficulty.length > 0) {
        return questionsOfDifficulty[Math.floor(Math.random() * questionsOfDifficulty.length)];
      }
    }

    // Fallback: return any unanswered question
    return unansweredQuestions[0];
  }

  static shouldShowHint(learnerState: LearnerProfile['learnerState'], responseTime: number): boolean {
    if (learnerState === 'struggling') return true;
    if (learnerState === 'normal' && responseTime > 15) return true;
    return false;
  }

  static generateFeedback(
    response: Response, 
    question: Question, 
    learnerState: LearnerProfile['learnerState'],
    allResponses: Response[] = []
  ): string {
    const responseTime = response.responseTime;
    const streak = this.calculateStreak(allResponses);
    
    if (response.correct) {
      // Personalized positive feedback based on performance patterns
      if (responseTime < 5) {
        return `Lightning fast! ⚡ You solved that in ${responseTime.toFixed(1)}s. ${question.explanation}`;
      } else if (streak >= 5) {
        return `Amazing streak! 🔥 That's ${streak} correct in a row! ${question.explanation}`;
      } else if (learnerState === 'struggling') {
        return `Fantastic improvement! 🌟 You're building confidence. ${question.explanation}`;
      } else if (learnerState === 'advanced') {
        return `Excellent work! 🎯 Ready for something more challenging?`;
      } else {
        return `Great job! ✅ ${question.explanation}`;
      }
    } else {
      // Personalized corrective feedback
      if (learnerState === 'struggling') {
        return `No worries! Let's break this down: ${question.hint}. ${question.explanation} Keep practicing - you're improving!`;
      } else if (responseTime < 3) {
        return `Take your time! 🤔 Sometimes slowing down helps. ${question.hint}. ${question.explanation}`;
      } else if (learnerState === 'advanced') {
        return `Almost there! 💭 ${question.explanation} This was a tricky one.`;
      } else {
        return `Not quite right. 📝 ${question.hint}. ${question.explanation}`;
      }
    }
  }

  static updateLearnerProfile(
    currentProfile: LearnerProfile, 
    newResponse: Response, 
    allResponses: Response[]
  ): LearnerProfile {
    const totalQuestions = allResponses.length;
    const correctAnswers = allResponses.filter(r => r.correct).length;
    const accuracy = this.calculateAccuracy(allResponses);
    const averageResponseTime = allResponses.reduce((sum, r) => sum + r.responseTime, 0) / totalQuestions;
    const currentStreak = this.calculateStreak(allResponses);
    const learnerState = this.analyzeLearnerState(allResponses);

    return {
      ...currentProfile,
      totalQuestions,
      correctAnswers,
      accuracy,
      averageResponseTime,
      currentStreak,
      learnerState
    };
  }
}