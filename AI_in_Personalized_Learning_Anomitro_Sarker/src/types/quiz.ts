export interface Question {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  question: string;
  choices: string[];
  answer: string;
  hint: string;
  explanation: string;
}

export interface Response {
  id: string;
  timestamp: string;
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  responseTime: number;
  difficulty: string;
  hintUsed: boolean;
}

export interface LearnerProfile {
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  currentStreak: number;
  learnerState: 'new' | 'struggling' | 'normal' | 'advanced';
  topicProgress: Record<string, number>;
}

export interface QuizState {
  currentQuestionIndex: number;
  questions: Question[];
  responses: Response[];
  learnerProfile: LearnerProfile;
  showHint: boolean;
  quizCompleted: boolean;
  startTime: number | null;
}